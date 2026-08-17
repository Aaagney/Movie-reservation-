const price = 18;
const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
let selected = new Set(),
  hold = null,
  booking = null;
const seatArea = document.querySelector('.seat-area');

function createGrid() {
  seatArea.replaceChildren();
  rows.forEach((row) => {
    const left = document.createElement('span');
    left.className = 'row-label';
    left.textContent = row;
    seatArea.append(left);
    for (let n = 1; n <= 12; n++) {
      const id = `${row}${n}`,
        button = document.createElement('button');
      button.className = `seat available${n === 3 ? ' aisle' : ''}`;
      button.type = 'button';
      button.dataset.seat = id;
      button.setAttribute('aria-label', `Seat ${id}`);
      button.addEventListener('click', () => toggleSeat(button));
      seatArea.append(button);
    }
    const right = document.createElement('span');
    right.className = 'row-label';
    right.textContent = row;
    seatArea.append(right);
  });
}
async function refreshSeats() {
  const response = await fetch('/api/showtime');
  if (!response.ok) throw new Error('Could not load seat availability.');
  const { seats } = await response.json();
  document.querySelectorAll('button.seat').forEach((button) => {
    const state = seats[button.dataset.seat];
    button.className = `seat ${state}${button.dataset.seat.endsWith('3') ? ' aisle' : ''}${selected.has(button.dataset.seat) ? ' selected' : ''}`;
    button.disabled = state !== 'available' && !selected.has(button.dataset.seat);
  });
}
function toggleSeat(button) {
  if (button.disabled) return;
  const id = button.dataset.seat;
  selected.has(id) ? selected.delete(id) : selected.add(id);
  button.classList.toggle('selected');
  updateSelection();
}
function totals() {
  const subtotal = selected.size * price;
  return { subtotal, fee: +(subtotal * 0.05).toFixed(2), total: +(subtotal * 1.05).toFixed(2) };
}
function money(amount) {
  return `$${amount.toFixed(2).replace(/\.00$/, '')}`;
}
function orderedSeats() {
  return [...selected].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}
function updateSelection() {
  const count = selected.size,
    total = totals(),
    btn = document.querySelector('#continue-button'),
    copy = document.querySelector('#selection-copy');
  btn.disabled = !count;
  copy.innerHTML = count
    ? `<strong>${count} seat${count > 1 ? 's' : ''}:</strong> <b>${orderedSeats().join(', ')}</b><br><span>Total: <b>${money(total.total)}</b></span>`
    : 'Choose your seats';
}
function fillSummary() {
  const { subtotal, fee, total } = totals(),
    seats = orderedSeats().join(', ');
  document.querySelector('#summary-seats').textContent = seats;
  document.querySelector('#quantity-label').textContent = `${selected.size} × ${money(price)}`;
  document.querySelector('#summary-subtotal').textContent = money(subtotal);
  document.querySelector('#summary-fee').textContent = money(fee);
  document.querySelector('#summary-total').textContent = money(total);
  document.querySelector('#pay-total').textContent = money(total);
  ['seats', 'subtotal', 'fee', 'total'].forEach(
    (key) =>
      (document.querySelector(`#receipt-${key}`).textContent =
        key === 'seats' ? seats : money({ subtotal, fee, total }[key]))
  );
}
function show(id) {
  document.querySelectorAll('.view').forEach((v) => v.classList.remove('active'));
  document.querySelector(id).classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
function notify(message) {
  let toast = document.querySelector('#toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    document.body.append(toast);
  }
  toast.textContent = message;
  toast.classList.add('visible');
  setTimeout(() => toast.classList.remove('visible'), 4500);
}
async function releaseHold() {
  if (!hold) return;
  await fetch(`/api/holds/${hold.id}`, { method: 'DELETE' });
  hold = null;
}

document.querySelector('#continue-button').addEventListener('click', async () => {
  const button = document.querySelector('#continue-button');
  button.disabled = true;
  button.textContent = 'Holding seats…';
  try {
    const response = await fetch('/api/holds', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ seats: orderedSeats() }),
    });
    const data = await response.json();
    if (!response.ok) {
      selected = new Set();
      updateSelection();
      await refreshSeats();
      throw new Error(data.error);
    }
    hold = data;
    fillSummary();
    updateTimer();
    show('#summary-view');
  } catch (error) {
    notify(error.message);
  } finally {
    button.innerHTML = 'Continue <span>→</span>';
    updateSelection();
  }
});
document.querySelector('#payment-button').addEventListener('click', () => show('#payment-view'));
document.querySelectorAll('.previous').forEach((button) =>
  button.addEventListener('click', async () => {
    if (button.closest('#summary-view')) {
      await releaseHold();
      selected.clear();
      updateSelection();
      await refreshSeats();
      show('#seats-view');
    } else show('#summary-view');
  })
);
document.querySelector('#payment-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const button = event.submitter;
  button.disabled = true;
  button.textContent = 'Confirming…';
  try {
    const response = await fetch(`/api/holds/${hold.id}/confirm`, { method: 'POST' }),
      data = await response.json();
    if (!response.ok) throw new Error(data.error);
    booking = data;
    hold = null;
    document.querySelector('#booking-ref').textContent = booking.reference;
    show('#confirmed-view');
  } catch (error) {
    notify(error.message);
    await refreshSeats();
    show('#seats-view');
  } finally {
    button.disabled = false;
    button.innerHTML = `Pay <span id="pay-total">${money(totals().total)}</span> &amp; confirm`;
  }
});
document.querySelector('#browse-button').addEventListener('click', async () => {
  selected.clear();
  updateSelection();
  await refreshSeats();
  show('#seats-view');
});
function updateTimer() {
  if (!hold) return;
  const remaining = Math.max(0, hold.expiresAt - Date.now()),
    mins = Math.floor(remaining / 60000),
    secs = Math.floor((remaining % 60000) / 1000);
  document.querySelector('#hold-timer').textContent = remaining
    ? `◷ Seats held for ${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
    : '⌛ Seat hold expired';
  if (remaining) setTimeout(updateTimer, 1000);
  else {
    hold = null;
    notify('Your seat hold expired. Please choose seats again.');
    show('#seats-view');
    refreshSeats();
  }
}
createGrid();
refreshSeats().catch((error) => notify(error.message));
