<<<<<<< HEAD
# CinéVault — Movie Reservation System
### Module 8: Theatre & Showtime Management

A full-stack movie reservation system built for a college project. The UI follows the
provided Figma design (dark cinema theme, gold accents), while the backend focuses on
**Theatre, Screen, and Showtime Management** — the assigned module.

---

## Tech Stack

| Layer     | Technology |
|-----------|------------|
| Frontend  | React 19, Vite, React Router, Axios, Tailwind CSS, React Icons |
| Backend   | Node.js, Express.js |
| Database  | MySQL 8 (tested against MariaDB 10.11, fully compatible) |

---

## Folder Structure

```
cinevault/
├── client/          # React + Vite frontend
├── server/          # Express REST API
└── database/
    ├── schema.sql       # Full DDL (tables, keys, indexes)
    ├── seed.sql          # Generated dummy data (10 movies, 5 theatres, 15 screens, 100 showtimes, 1640 seats, 50 bookings)
    └── generate_seed.js  # Script that produced seed.sql (re-run any time with `node generate_seed.js`)
```
=======
# CinéVault - Premium Movie Reservation System

A complete Movie Reservation System with a Node.js/Express.js REST API backend, a MySQL database, and a React frontend, styled with a sleek obsidian-gold dark mode to match the Figma specifications.

This project was built for a college assignment using simple, readable, and structured code.

---

## Features

### Member Flow:
1. **Browse Movies:** View active films with category filters and title searches.
2. **Movie Details:** Look up cast/duration/rating, and check scheduled shows grouped by theater.
3. **Interactive Seat Layout:** Choose seats (color-coded as Available, Selected, Blocked, and Reserved).
4. **Temporary Seat Locks:** Selected seats are held for 5 minutes during the booking process to prevent double booking.
5. **Booking Confirmation:** Real-time billing summary based on base seat or premium seat (+ $5.00) types, generating a unique booking ticket.
6. **Booking History:** Access previous tickets and cancel upcoming shows (up to 2 hours before showtime).

### Admin Flow:
1. **Overview stats:** Monitor total films, theaters, confirmed reservations, and system revenue.
2. **Movie Management:** Full CRUD (Create, Read, Update, Delete) with modals.
3. **Theater Management:** Add custom theaters specifying row/column sizes (which dynamically generate the screen grids and seats).
4. **Showtime Management:** Allocate movies to screens with custom dates, times, and pricing.
5. **Manage Bookings:** View all system reservations.

---

## Getting Started

### Prerequisites
* **Node.js** (v18 or higher recommended)
* **MySQL Server** (ensure it's running locally)
>>>>>>> abb3987d02db75c5920cc9fc36c938b99361c481

---

## 1. Database Setup
<<<<<<< HEAD

You need a running MySQL (or MariaDB) server.

```bash
cd database
mysql -u root -p --default-character-set=utf8mb4 < schema.sql
mysql -u root -p --default-character-set=utf8mb4 < seed.sql
```

> **Important:** always load these files with `--default-character-set=utf8mb4`
> (or an equivalent client setting). Without it, the accented character in
> "CinéVault" and similar text can appear mangled — the data itself is correct
> UTF-8, it's purely a MySQL-client display/import setting.

Want different amounts of dummy data? Edit `database/generate_seed.js` and re-run:

```bash
node generate_seed.js
```
=======
Ensure MySQL is running on your machine (e.g., standard port `3306`).
There are two ways to import the schema and seed data:

#### Option A: Automatic Import (Recommended)
Once your backend server is running, send a `POST` request to `http://localhost:5000/api/setup-db` (e.g., using Postman, Thunder Client, or the browser). This will read `database/schema.sql`, clean it, and load it into your MySQL instance automatically.

#### Option B: Manual CLI Import
Create the database and run the schema file directly from your terminal or MySQL Workbench:
```sql
mysql -u root -p < database/schema.sql
```

*Note: The schema seeds default movies, screens, showtimes, seats, and the demo accounts below.*
>>>>>>> abb3987d02db75c5920cc9fc36c938b99361c481

---

## 2. Backend Setup
<<<<<<< HEAD

```bash
cd server
npm install
cp .env.example .env   # then edit DB_USER / DB_PASSWORD to match your MySQL setup
npm start               # or: npm run dev (nodemon)
```

The API runs on `http://localhost:5000` by default. Health check: `GET /api/health`.

### Authentication
Dummy authentication only — no JWT, no password hashing (by design, per project spec).

| Role     | Email                  | Password  |
|----------|------------------------|-----------|
| Admin    | admin@cinevault.com    | admin123  |
| Customer | user@cinevault.com     | user123   |

The frontend stores the logged-in user in `localStorage` and sends an `x-user-role`
header on requests; the backend's `requireAdmin` middleware checks that header on
admin-only routes (create/update/delete for movies, theatres, screens, showtimes,
and the dashboard stats endpoint).
=======
1. Navigate to the `backend/` folder:
   ```bash
   cd backend
   ```
2. Inspect or update `.env` with your local MySQL credentials:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=root
   DB_NAME=cinevault_db
   JWT_SECRET=cinevault_super_secret_jwt_key_12345
   JWT_EXPIRES_IN=7d
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the server in development mode (using nodemon):
   ```bash
   npm run dev
   ```
   *The server runs on [http://localhost:5000](http://localhost:5000)*
>>>>>>> abb3987d02db75c5920cc9fc36c938b99361c481

---

## 3. Frontend Setup
<<<<<<< HEAD

```bash
cd client
npm install
npm run dev
```

Runs on `http://localhost:5173`. It talks to the API at `http://localhost:5000/api`
by default — override with a `.env` file containing `VITE_API_URL=...` if needed.

---

## API Overview

| Resource   | Endpoints |
|------------|-----------|
| Auth       | `POST /api/auth/login`, `POST /api/auth/register` |
| Movies     | `GET/POST /api/movies`, `GET/PUT/DELETE /api/movies/:id`, `GET /api/movies/genres/list` |
| Theatres   | `GET/POST /api/theatres`, `GET/PUT/DELETE /api/theatres/:id`, `GET /api/theatres/cities/list` |
| Screens    | `GET/POST /api/screens`, `GET/PUT/DELETE /api/screens/:id`, `GET /api/screens/types/list` |
| Showtimes  | `GET/POST /api/showtimes`, `GET/PUT/DELETE /api/showtimes/:id`, `GET /api/showtimes/movie/:movieId` |
| Seats      | `GET /api/seats/showtime/:showtimeId` (live seat map with availability) |
| Bookings   | `POST /api/bookings`, `GET /api/bookings`, `GET /api/bookings/:id` |
| Dashboard  | `GET /api/dashboard/stats` (admin only) |

All list endpoints accept query-string filters (see controller source for exact
params — e.g. `/api/showtimes?movie_id=&theatre_id=&date=&screen_id=&status=&city=`).

---

## Core Flows

**Customer booking flow:**
Movie → Choose Showtime (grouped by date, generated dynamically from the `showtimes`
table) → Seat Selection (live seat map, color-coded available/VIP/selected/booked) →
Booking Summary → Booking Success. No payment gateway, per spec.

**Admin flow:**
Login as admin → Dashboard (theatre/screen/show/booking stats) → full CRUD on
Movies, Theatres, Screens (auto-generates seats for the screen's row × column grid),
and Showtimes (filterable by movie/theatre/date/status) → read-only Bookings view.

---

## Notes

- Booking creation is wrapped in a DB transaction with a row lock on the showtime and
  a check for already-booked seats, so two people can't double-book the same seat.
- Seats are generated automatically whenever a screen is created (rows × columns),
  with the last row marked VIP by default — customize this in
  `server/controllers/screenController.js` if you want a different VIP layout.
- This project was built and smoke-tested end-to-end (schema load, seed load, all
  CRUD endpoints, booking transaction, and a production `vite build`) against a
  local MariaDB/MySQL instance before delivery.
=======
1. Navigate to the `frontend/` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite React development server:
   ```bash
   npm run dev
   ```
   *Open [http://localhost:5173](http://localhost:5173) in your browser.*

---

## Demo Accounts (Autofill Enabled)
For easy grading and review, the Sign-In screen contains click-to-autofill options for the default seeded accounts:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Member** (Alex Rivera) | `your@email.com` | `password123` |
| **Administrator** (Morgan Adeyemi) | `morgan@email.com` | `password123` |

---

## Technology Stack
* **Frontend:** React, React Router, Context API, Vanilla CSS (Design Tokens, Custom Elements)
* **Backend:** Node.js, Express.js, JWT, BcryptJS, MySQL2 (Connection Pools, Transactions)
* **Database:** MySQL
>>>>>>> abb3987d02db75c5920cc9fc36c938b99361c481
