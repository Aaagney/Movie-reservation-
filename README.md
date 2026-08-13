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

---

## 1. Database Setup
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

---

## 2. Backend Setup
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

---

## 3. Frontend Setup
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
