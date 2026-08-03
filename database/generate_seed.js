/**
 * generate_seed.js
 * Generates database/seed.sql with realistic dummy data:
 * 10 movies, 5 theatres, 15 screens, ~100 showtimes, 500+ seats, 50 bookings.
 * Run with: node generate_seed.js
 */
const fs = require('fs');
const path = require('path');

let sql = `-- ============================================================
-- CINEVAULT - Dummy Seed Data (auto-generated)
-- ============================================================
USE cinevault;

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE booking_seats;
TRUNCATE TABLE bookings;
TRUNCATE TABLE seats;
TRUNCATE TABLE showtimes;
TRUNCATE TABLE screens;
TRUNCATE TABLE screen_types;
TRUNCATE TABLE theatres;
TRUNCATE TABLE movie_genres;
TRUNCATE TABLE movies;
TRUNCATE TABLE genres;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;

`;

// ---------- USERS ----------
sql += `-- USERS\n`;
sql += `INSERT INTO users (name, email, password, role) VALUES\n`;
sql += `('Admin User', 'admin@cinevault.com', 'admin123', 'admin'),\n`;
sql += `('John Customer', 'user@cinevault.com', 'user123', 'customer'),\n`;
const customerNames = ['Priya Sharma','Alex Turner','Maria Garcia','Wei Chen','Sara Khan','Liam Obrien','Nina Patel','Tom Becker','Fatima Noor','Chris Diaz'];
customerNames.forEach((n, i) => {
  const email = n.toLowerCase().replace(/[^a-z]/g, '') + i + '@example.com';
  sql += `('${n}', '${email}', 'pass123', 'customer')${i === customerNames.length - 1 ? ';' : ','}\n`;
});
sql += `\n`;

// ---------- GENRES ----------
const genres = ['Sci-Fi', 'Thriller', 'Drama', 'Action', 'Comedy', 'Horror', 'Romance', 'Animation'];
sql += `-- GENRES\nINSERT INTO genres (name) VALUES\n`;
sql += genres.map(g => `('${g}')`).join(',\n') + ';\n\n';

// ---------- MOVIES ----------
const movies = [
  { title: 'Neon Frontier', rating: 'PG-13', duration: 138, director: 'Yuki Tanaka', cast: 'Elena Vasquez, James Okafor, Petra Novak',
    desc: 'In 2087, a rogue cartographer discovers a signal from beyond the known star maps, drawing her into a conspiracy that spans three civilizations.', genreIdx: [0,1] },
  { title: 'Midnight Ledger', rating: 'R', duration: 124, director: 'Marcus Cole', cast: 'David Kim, Rosa Alvarez, Tom Reilly',
    desc: 'A forensic accountant uncovers a decade-old fraud that ties her own family to an unsolved disappearance.', genreIdx: [1,2] },
  { title: 'Golden Hour', rating: 'PG-13', duration: 109, director: 'Ingrid Solberg', cast: 'Maya Lin, Owen Brooks, Claire Dupont',
    desc: 'Two strangers keep meeting at the same San Francisco overlook every year on the same day, for reasons neither can explain.', genreIdx: [6,2] },
  { title: 'Steel Horizon', rating: 'PG-13', duration: 131, director: 'Derek Osei', cast: 'Marcus Reed, Tanya Brooks, Victor Hale',
    desc: 'An engineer must stop a runaway orbital elevator before it tears through the equator.', genreIdx: [0,3] },
  { title: 'The Quiet Orchard', rating: 'PG', duration: 101, director: 'Helene Fischer', cast: 'Anna Voss, Peter Lund, Ingrid Hahn',
    desc: 'A grieving beekeeper rebuilds her late fathers orchard and, with it, her relationship with her estranged brother.', genreIdx: [2] },
  { title: 'Comedy of Errors Inc.', rating: 'PG-13', duration: 97, director: 'Jamal Whitfield', cast: 'Sam Ortiz, Debra Chan, Kyle Nolan',
    desc: 'A startups worst product launch becomes the best thing that ever happened to its founders.', genreIdx: [4] },
  { title: 'Hollow Point', rating: 'R', duration: 116, director: 'Renee Aubert', cast: 'Frank Castillo, Nadia Petrov, Ben Wu',
    desc: 'A retired sniper is pulled back for one last job that was never really about the target.', genreIdx: [3,1] },
  { title: 'Whispers in Attic 7', rating: 'R', duration: 98, director: 'Colin Ashworth', cast: 'Zoe Marlowe, Grant Ellis, Ivy Chen',
    desc: 'A family renovating an old apartment building keeps finding rooms that were never on the blueprints.', genreIdx: [5] },
  { title: 'Paper Constellations', rating: 'PG', duration: 94, director: 'Mio Sakata', cast: 'Voices of Aiko Sato, Leo Marchetti',
    desc: 'An origami-folding girl discovers her paper creatures come alive on the night of a lunar eclipse.', genreIdx: [7,2] },
  { title: 'Last Exit East', rating: 'PG-13', duration: 122, director: 'Omar Siddiqui', cast: 'Farah Idris, Noah Kessler, Wendy Zhou',
    desc: 'Three siblings drive across the country to sell their late mothers diner before the bank forecloses.', genreIdx: [2,4] },
];

sql += `-- MOVIES\n`;
movies.forEach((m, i) => {
  const releaseDate = `2026-0${(i % 6) + 1}-1${i}`;
  sql += `INSERT INTO movies (title, description, poster_url, rating, duration_minutes, director, cast_list, release_date, status) VALUES ('${m.title.replace(/'/g, "\\'")}', '${m.desc.replace(/'/g, "\\'")}', 'https://picsum.photos/seed/movie${i + 1}/500/750', '${m.rating}', ${m.duration}, '${m.director}', '${m.cast}', '${releaseDate}', 'now_showing');\n`;
});
sql += `\n-- MOVIE GENRES\n`;
movies.forEach((m, i) => {
  m.genreIdx.forEach(gi => {
    sql += `INSERT INTO movie_genres (movie_id, genre_id) VALUES (${i + 1}, ${gi + 1});\n`;
  });
});
sql += `\n`;

// ---------- THEATRES ----------
const theatres = [
  { name: 'CinéVault Grand Central', city: 'New York', location: 'Midtown Manhattan', address: '350 5th Ave, New York, NY', phone: '212-555-0110', email: 'grandcentral@cinevault.com', parking: 1, food: 1, wheelchair: 1, ac: 1 },
  { name: 'CinéVault Bay View', city: 'San Francisco', location: 'Embarcadero', address: '1 Ferry Building, San Francisco, CA', phone: '415-555-0122', email: 'bayview@cinevault.com', parking: 1, food: 1, wheelchair: 1, ac: 1 },
  { name: 'CinéVault Lakeshore', city: 'Chicago', location: 'Lakeview', address: '2200 N Lakeshore Dr, Chicago, IL', phone: '312-555-0133', email: 'lakeshore@cinevault.com', parking: 0, food: 1, wheelchair: 1, ac: 1 },
  { name: 'CinéVault Sunset Strip', city: 'Los Angeles', location: 'West Hollywood', address: '8600 Sunset Blvd, Los Angeles, CA', phone: '323-555-0144', email: 'sunset@cinevault.com', parking: 1, food: 1, wheelchair: 0, ac: 1 },
  { name: 'CinéVault Harbor Point', city: 'Boston', location: 'Seaport District', address: '10 Harbor Way, Boston, MA', phone: '617-555-0155', email: 'harborpoint@cinevault.com', parking: 1, food: 0, wheelchair: 1, ac: 1 },
];
sql += `-- THEATRES\n`;
theatres.forEach(t => {
  sql += `INSERT INTO theatres (name, location, city, address, phone, email, status, has_parking, has_food_court, has_wheelchair_access, has_ac) VALUES ('${t.name}', '${t.location}', '${t.city}', '${t.address}', '${t.phone}', '${t.email}', 'active', ${t.parking}, ${t.food}, ${t.wheelchair}, ${t.ac});\n`;
});
sql += `\n`;

// ---------- SCREEN TYPES ----------
const screenTypes = ['2D', '3D', 'IMAX', '4DX', 'VIP'];
sql += `-- SCREEN TYPES\nINSERT INTO screen_types (name) VALUES\n`;
sql += screenTypes.map(s => `('${s}')`).join(',\n') + ';\n\n';

// ---------- SCREENS (3 per theatre = 15) ----------
sql += `-- SCREENS\n`;
const screensPerTheatre = 3;
let screenGlobalId = 1;
const screensMeta = []; // {id, theatreId, rows, cols, capacity}
for (let t = 1; t <= 5; t++) {
  for (let s = 1; s <= screensPerTheatre; s++) {
    const rows = 8 + (s % 3); // 8,9,10
    const cols = 10 + (s % 3) * 2; // 10,12,14
    const capacity = rows * cols;
    const typeId = ((screenGlobalId - 1) % 5) + 1;
    sql += `INSERT INTO screens (theatre_id, screen_name, screen_number, capacity, rows_count, columns_count, screen_type_id) VALUES (${t}, 'Screen ${s}', ${s}, ${capacity}, ${rows}, ${cols}, ${typeId});\n`;
    screensMeta.push({ id: screenGlobalId, theatreId: t, rows, cols, capacity, typeId });
    screenGlobalId++;
  }
}
sql += `\n`;

// ---------- SEATS ----------
sql += `-- SEATS\n`;
const rowLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
let totalSeats = 0;
screensMeta.forEach(scr => {
  const values = [];
  for (let r = 0; r < scr.rows; r++) {
    const rowLetter = rowLetters[r];
    const isVipRow = r === scr.rows - 1; // last row = VIP
    for (let c = 1; c <= scr.cols; c++) {
      values.push(`(${scr.id}, '${rowLetter}', ${c}, '${isVipRow ? 'vip' : 'standard'}')`);
      totalSeats++;
    }
  }
  sql += `INSERT INTO seats (screen_id, seat_row, seat_number, seat_type) VALUES\n${values.join(',\n')};\n`;
});
sql += `\n`;

// ---------- SHOWTIMES (~100) ----------
sql += `-- SHOWTIMES\n`;
const formats = ['2D', '3D', 'IMAX', '4DX', 'VIP'];
const languages = ['English', 'Spanish', 'French'];
const startTimes = ['10:00:00', '12:30:00', '15:00:00', '18:00:00', '21:00:00'];
const baseDate = new Date('2026-08-01');
let showtimeCount = 0;
const showtimeRows = [];
for (let d = 0; d < 4; d++) { // 4 days
  const showDate = new Date(baseDate);
  showDate.setDate(baseDate.getDate() + d);
  const dateStr = showDate.toISOString().slice(0, 10);
  for (let m = 1; m <= 10; m++) { // each movie
    // pick 2-3 showtimes per movie per day across random screens/theatres
    const numShows = 2 + (m % 2);
    for (let s = 0; s < numShows; s++) {
      if (showtimeCount >= 100) break;
      const screen = screensMeta[(m + s + d) % screensMeta.length];
      const startTime = startTimes[(m + s) % startTimes.length];
      const [h, min] = startTime.split(':').map(Number);
      const durationMin = movies[m - 1].duration + 20; // + trailers/buffer
      const endDate = new Date(showDate);
      endDate.setHours(h, min + durationMin);
      const endTime = `${String(endDate.getHours()).padStart(2, '0')}:${String(endDate.getMinutes()).padStart(2, '0')}:00`;
      const format = formats[screen.typeId - 1];
      const price = (10 + (screen.typeId * 2) + (s * 1.5)).toFixed(2);
      const language = languages[(m + s) % languages.length];
      sql += `INSERT INTO showtimes (movie_id, theatre_id, screen_id, show_date, start_time, end_time, language, format, ticket_price, available_seats, status) VALUES (${m}, ${screen.theatreId}, ${screen.id}, '${dateStr}', '${startTime}', '${endTime}', '${language}', '${format}', ${price}, ${screen.capacity}, 'scheduled');\n`;
      showtimeRows.push({ id: ++showtimeCount, screenCapacity: screen.capacity, screenId: screen.id, price });
    }
    if (showtimeCount >= 100) break;
  }
  if (showtimeCount >= 100) break;
}
sql += `\n`;

// ---------- BOOKINGS (50) with booking_seats ----------
sql += `-- BOOKINGS\n`;
let bookingCount = 0;
for (let b = 1; b <= 50; b++) {
  const userId = 1 + (b % 12); // users 1..12
  const showtime = showtimeRows[b % showtimeRows.length];
  const numSeats = 1 + (b % 4); // 1-4 seats
  const seatPrice = parseFloat(showtime.price);
  const total = (seatPrice * numSeats).toFixed(2);
  sql += `INSERT INTO bookings (user_id, showtime_id, total_amount, booking_status) VALUES (${userId}, ${showtime.id}, ${total}, 'confirmed');\n`;
  bookingCount++;
}
sql += `\n-- BOOKING SEATS (linking sample seats to bookings)\n`;
// For simplicity, link booking b to seat ids computed from its showtime's screen offset
for (let b = 1; b <= 50; b++) {
  const showtime = showtimeRows[b % showtimeRows.length];
  const numSeats = 1 + (b % 4);
  for (let i = 0; i < numSeats; i++) {
    // approximate seat id: not globally precise but valid FK since seats generated sequentially per screen
    const seatOffset = (b * 3 + i) % showtime.screenCapacity;
    sql += `INSERT INTO booking_seats (booking_id, seat_id, price) SELECT ${b}, id, ${showtime.price} FROM seats WHERE screen_id = ${showtime.screenId} LIMIT 1 OFFSET ${seatOffset};\n`;
  }
}

sql += `\n-- Sync available_seats after bookings\n`;
sql += `UPDATE showtimes st SET available_seats = available_seats - (
  SELECT COUNT(*) FROM booking_seats bs
  JOIN bookings bk ON bs.booking_id = bk.id
  WHERE bk.showtime_id = st.id AND bk.booking_status = 'confirmed'
);\n`;

fs.writeFileSync(path.join(__dirname, 'seed.sql'), sql);
console.log(`seed.sql generated: ${movies.length} movies, ${theatres.length} theatres, ${screensMeta.length} screens, ${totalSeats} seats, ${showtimeCount} showtimes, ${bookingCount} bookings`);
