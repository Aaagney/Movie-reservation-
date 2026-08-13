// Minimal dependency-free booking server. Run with: node server.js
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { randomUUID } = require('node:crypto');

const root = __dirname;
const storeFile = path.join(root, 'booking-data.json');
const port = process.env.PORT || 4173;
const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
const allSeats = rows.flatMap((row) => Array.from({ length: 12 }, (_, i) => `${row}${i + 1}`));
const unavailable = ['A7', 'A8', 'B2', 'B3', 'C9', 'C10', 'D4', 'D5', 'E6', 'E7', 'F1', 'F2', 'G8'];
const blocked = ['A11', 'D10'];

function initialData() {
  return {
    holds: {},
    bookings: Object.fromEntries(
      unavailable.map((seat) => [seat, { seat, reference: 'PREBOOKED' }])
    ),
    blocked,
  };
}
function readStore() {
  try {
    return JSON.parse(fs.readFileSync(storeFile, 'utf8'));
  } catch {
    const data = initialData();
    writeStore(data);
    return data;
  }
}
function writeStore(data) {
  fs.writeFileSync(storeFile, JSON.stringify(data, null, 2));
}
function expireHolds(data) {
  const now = Date.now();
  for (const [id, hold] of Object.entries(data.holds))
    if (hold.expiresAt <= now) delete data.holds[id];
}
function seatState(data, seat) {
  if (data.blocked.includes(seat)) return 'blocked';
  if (data.bookings[seat]) return 'reserved';
  if (Object.values(data.holds).some((hold) => hold.seats.includes(seat))) return 'held';
  return 'available';
}
function send(res, code, body) {
  res.writeHead(code, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(body));
}
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => (raw += chunk));
    req.on('end', () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch {
        reject(new Error('Invalid JSON'));
      }
    });
  });
}
function publicShowtime(data) {
  return { seats: Object.fromEntries(allSeats.map((seat) => [seat, seatState(data, seat)])) };
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  if (url.pathname.startsWith('/api/')) {
    const data = readStore();
    expireHolds(data);
    writeStore(data);
    if (req.method === 'GET' && url.pathname === '/api/showtime')
      return send(res, 200, publicShowtime(data));
    if (req.method === 'POST' && url.pathname === '/api/holds') {
      try {
        const { seats } = await parseBody(req);
        if (
          !Array.isArray(seats) ||
          !seats.length ||
          seats.some((seat) => !allSeats.includes(seat))
        )
          return send(res, 400, { error: 'Choose at least one valid seat.' });
        const uniqueSeats = [...new Set(seats)];
        const conflicts = uniqueSeats.filter((seat) => seatState(data, seat) !== 'available');
        if (conflicts.length)
          return send(res, 409, {
            error: 'One or more seats were just taken.',
            conflicts,
            showtime: publicShowtime(data),
          });
        const id = randomUUID();
        const hold = { id, seats: uniqueSeats, expiresAt: Date.now() + 10 * 60 * 1000 };
        data.holds[id] = hold;
        writeStore(data);
        return send(res, 201, hold);
      } catch (error) {
        return send(res, 400, { error: error.message });
      }
    }
    const holdMatch = url.pathname.match(/^\/api\/holds\/([\w-]+)$/);
    if (holdMatch && req.method === 'DELETE') {
      delete data.holds[holdMatch[1]];
      writeStore(data);
      return send(res, 204, {});
    }
    const confirmMatch = url.pathname.match(/^\/api\/holds\/([\w-]+)\/confirm$/);
    if (confirmMatch && req.method === 'POST') {
      const hold = data.holds[confirmMatch[1]];
      if (!hold || hold.expiresAt <= Date.now())
        return send(res, 410, { error: 'This hold has expired. Please choose seats again.' });
      const conflicts = hold.seats.filter((seat) => data.bookings[seat]);
      if (conflicts.length)
        return send(res, 409, { error: 'These seats are no longer available.', conflicts });
      const reference = `BK${randomUUID().replaceAll('-', '').slice(0, 6).toUpperCase()}`;
      hold.seats.forEach(
        (seat) => (data.bookings[seat] = { seat, reference, bookedAt: new Date().toISOString() })
      );
      delete data.holds[hold.id];
      writeStore(data);
      return send(res, 201, { reference, seats: hold.seats });
    }
    return send(res, 404, { error: 'Endpoint not found.' });
  }
  const requested =
    url.pathname === '/' ? 'index.html' : path.normalize(url.pathname).replace(/^[/\\]+/, '');
  const file = path.join(root, requested);
  if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    res.writeHead(404);
    return res.end('Not found');
  }
  const type =
    path.extname(file) === '.css'
      ? 'text/css'
      : path.extname(file) === '.js'
        ? 'text/javascript'
        : 'text/html';
  res.writeHead(200, { 'Content-Type': `${type}; charset=utf-8` });
  fs.createReadStream(file).pipe(res);
});
server.listen(port, () => console.log(`CinéVault running at http://localhost:${port}`));
