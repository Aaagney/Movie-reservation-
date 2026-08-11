-- CREATE DATABASE
CREATE DATABASE IF NOT EXISTS cinevault_db;
USE cinevault_db;

-- DROP TABLES IF THEY EXIST (In reverse dependency order)
DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS showtimes;
DROP TABLE IF EXISTS theaters;
DROP TABLE IF EXISTS movies;
DROP TABLE IF EXISTS users;

-- USERS TABLE
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- MOVIES TABLE
CREATE TABLE movies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  genre VARCHAR(100) NOT NULL,
  duration INT NOT NULL, -- in minutes
  description TEXT,
  rating VARCHAR(10) DEFAULT 'PG-13',
  poster_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- THEATERS TABLE
CREATE TABLE theaters (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  capacity_desc VARCHAR(100),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- SHOWTIMES TABLE
CREATE TABLE showtimes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  movie_id INT NOT NULL,
  theater_id INT NOT NULL,
  start_time DATETIME NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,
  FOREIGN KEY (theater_id) REFERENCES theaters(id) ON DELETE CASCADE
);

-- BOOKINGS TABLE
CREATE TABLE bookings (
  id VARCHAR(36) PRIMARY KEY, -- Unique ID (UUID or custom string)
  user_id INT NOT NULL,
  showtime_id INT NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  status ENUM('confirmed', 'cancelled') DEFAULT 'confirmed',
  booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (showtime_id) REFERENCES showtimes(id) ON DELETE CASCADE
);

-- AUDIT LOGS TABLE
CREATE TABLE audit_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_name VARCHAR(100) NOT NULL,
  action VARCHAR(100) NOT NULL,
  module VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ip_address VARCHAR(45) DEFAULT '127.0.0.1'
);

-- SEED DATA

-- 1. USERS (passwords are 'password123' pre-hashed with bcrypt)
INSERT INTO users (id, name, email, password, role, created_at) VALUES
(1, 'Alex Rivera', 'your@email.com', '$2a$10$nKq.9hYm6k0yH64K9l.JgOzH/nUoGgXv0mK5ZgYw1vD.g6LqLgJyG', 'user', '2026-05-01 10:00:00'),
(2, 'Morgan Adeyemi', 'morgan@email.com', '$2a$10$nKq.9hYm6k0yH64K9l.JgOzH/nUoGgXv0mK5ZgYw1vD.g6LqLgJyG', 'admin', '2026-05-01 10:15:00'),
(3, 'Jordan Lee', 'jordan.lee@example.com', '$2a$10$nKq.9hYm6k0yH64K9l.JgOzH/nUoGgXv0mK5ZgYw1vD.g6LqLgJyG', 'user', '2026-05-15 14:22:00'),
(4, 'Casey Smith', 'casey.smith@example.com', '$2a$10$nKq.9hYm6k0yH64K9l.JgOzH/nUoGgXv0mK5ZgYw1vD.g6LqLgJyG', 'user', '2026-06-01 09:30:00'),
(5, 'Taylor Wong', 'taylor.w@example.com', '$2a$10$nKq.9hYm6k0yH64K9l.JgOzH/nUoGgXv0mK5ZgYw1vD.g6LqLgJyG', 'user', '2026-06-12 18:45:00'),
(6, 'Riley Davis', 'riley.d@example.com', '$2a$10$nKq.9hYm6k0yH64K9l.JgOzH/nUoGgXv0mK5ZgYw1vD.g6LqLgJyG', 'user', '2026-06-25 11:10:00');

-- 2. MOVIES
INSERT INTO movies (id, title, genre, duration, description, rating, poster_url) VALUES
(1, 'Neon Frontier', 'Sci-Fi', 142, 'A high-stakes cyberpunk adventure set in the year 2099, where a rogue hacker discovers a secret that could collapse the megacity.', 'PG-13', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500'),
(2, 'The Venetian Heist', 'Thriller', 118, 'A group of elite thieves plan the heist of the century in the canals of Venice, targeting a rare Renaissance artifact.', 'R', 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500'),
(3, 'Ember & Ash', 'Drama', 126, 'An emotional story of a family rebuilding their lives in a small town after a devastating fire destroys their heritage home.', 'PG-13', 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=500'),
(4, 'Razorback', 'Action', 108, 'A retired special ops agent goes on a rogue mission to save his kidnapped daughter from a shadowy cartel in the Australian outback.', 'R', 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=500'),
(5, 'The Laughing Fox', 'Comedy', 95, 'A series of comical misunderstandings follow a mischievous fox who accidentally becomes the mascot of a prestigious boarding school.', 'PG', 'https://images.unsplash.com/photo-1513829092301-0227e783acb7?w=500'),
(6, 'Whispers in the Deep', 'Horror', 112, 'A deep-sea research crew discovers something terrifying and ancient awakened in the Mariana Trench.', 'R', 'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=500');

-- 3. THEATERS
INSERT INTO theaters (id, name, capacity_desc, description) VALUES
(1, 'Grand Hall', '126 seats (9x14)', 'Our flagship 126-seat auditorium with Dolby Atmos.'),
(2, 'Premiere Suite', '84 seats (7x12)', 'Premium 84-seat hall with reclining seats.'),
(3, 'Studio Screen', '60 seats (6x10)', 'Intimate 60-seat arthouse screen.');

-- 4. SHOWTIMES
INSERT INTO showtimes (id, movie_id, theater_id, start_time, price) VALUES
(1, 1, 1, '2026-06-15 14:00:00', 16.00),
(2, 1, 2, '2026-06-16 18:30:00', 18.00),
(3, 2, 1, '2026-06-18 20:00:00', 16.00),
(4, 2, 3, '2026-06-20 15:00:00', 13.00),
(5, 3, 2, '2026-06-22 17:00:00', 18.00),
(6, 4, 1, '2026-06-25 21:00:00', 16.00),
(7, 5, 3, '2026-06-28 11:00:00', 12.00),
(8, 6, 1, '2026-06-30 23:00:00', 15.00),
-- July Showtimes
(9, 1, 1, '2026-07-05 14:00:00', 16.00),
(10, 2, 2, '2026-07-08 19:00:00', 18.00),
(11, 3, 3, '2026-07-12 16:30:00', 13.00),
(12, 4, 1, '2026-07-15 20:45:00', 16.00),
(13, 5, 2, '2026-07-18 13:00:00', 17.00),
(14, 6, 3, '2026-07-22 18:00:00', 13.00),
(15, 1, 2, '2026-07-25 15:30:00', 18.00),
(16, 2, 1, '2026-07-28 20:00:00', 16.00);

-- 5. BOOKINGS (Generates total_price, booking_date)
INSERT INTO bookings (id, user_id, showtime_id, total_price, status, booking_date) VALUES
-- June Bookings
('BK-3021', 1, 1, 16.00, 'confirmed', '2026-06-14 10:15:22'),
('BK-3022', 3, 1, 32.00, 'confirmed', '2026-06-14 11:32:05'),
('BK-3023', 4, 2, 18.00, 'confirmed', '2026-06-15 15:22:40'),
('BK-3024', 5, 2, 36.00, 'cancelled', '2026-06-15 16:04:12'),
('BK-3025', 1, 3, 16.00, 'confirmed', '2026-06-17 19:12:00'),
('BK-3026', 6, 3, 48.00, 'confirmed', '2026-06-17 22:50:11'),
('BK-3027', 3, 4, 13.00, 'confirmed', '2026-06-19 12:05:33'),
('BK-3028', 4, 5, 18.00, 'confirmed', '2026-06-21 14:45:00'),
('BK-3029', 5, 6, 16.00, 'confirmed', '2026-06-24 18:30:19'),
('BK-3030', 6, 6, 32.00, 'cancelled', '2026-06-24 20:15:55'),
('BK-3031', 1, 7, 12.00, 'confirmed', '2026-06-27 09:12:30'),
('BK-3032', 3, 8, 30.00, 'confirmed', '2026-06-29 21:00:44'),
-- July Bookings (Daily/Weekly distributions)
-- Week 1 July (July 1 - July 7)
('BK-4001', 4, 9, 16.00, 'confirmed', '2026-07-02 11:22:00'),
('BK-4002', 5, 9, 32.00, 'confirmed', '2026-07-03 14:15:00'),
('BK-4003', 1, 9, 16.00, 'confirmed', '2026-07-04 10:05:00'),
('BK-4004', 6, 9, 16.00, 'cancelled', '2026-07-04 16:33:00'),
('BK-4005', 3, 10, 36.00, 'confirmed', '2026-07-07 18:44:00'),
-- Week 2 July (July 8 - July 14)
('BK-4006', 4, 10, 18.00, 'confirmed', '2026-07-08 09:20:00'),
('BK-4007', 5, 11, 26.00, 'confirmed', '2026-07-10 13:12:00'),
('BK-4008', 6, 11, 13.00, 'confirmed', '2026-07-11 15:40:00'),
('BK-4009', 1, 11, 13.00, 'confirmed', '2026-07-12 11:00:00'),
('BK-4010', 3, 12, 32.00, 'confirmed', '2026-07-13 19:22:00'),
('BK-4011', 5, 12, 16.00, 'cancelled', '2026-07-14 10:05:00'),
-- Week 3 July (July 15 - July 21)
('BK-4012', 4, 12, 16.00, 'confirmed', '2026-07-15 17:30:00'),
('BK-4013', 6, 13, 34.00, 'confirmed', '2026-07-16 11:15:00'),
('BK-4014', 1, 13, 17.00, 'confirmed', '2026-07-17 14:02:00'),
('BK-4015', 3, 13, 17.00, 'confirmed', '2026-07-18 09:50:00'),
('BK-4016', 4, 14, 26.00, 'confirmed', '2026-07-20 15:22:00'),
('BK-4017', 5, 14, 13.00, 'cancelled', '2026-07-21 16:45:00'),
-- Week 4 July (July 22 - July 29)
('BK-4018', 6, 14, 13.00, 'confirmed', '2026-07-22 12:10:00'),
('BK-4019', 1, 15, 36.00, 'confirmed', '2026-07-23 15:30:00'),
('BK-4020', 3, 15, 18.00, 'confirmed', '2026-07-24 17:15:00'),
('BK-4021', 4, 15, 18.00, 'confirmed', '2026-07-25 11:00:00'),
('BK-4022', 5, 16, 32.00, 'confirmed', '2026-07-26 14:22:00'),
('BK-4023', 6, 16, 16.00, 'confirmed', '2026-07-27 19:40:00'),
('BK-4024', 3, 16, 16.00, 'confirmed', '2026-07-28 10:15:00'),
('BK-4025', 1, 16, 16.00, 'cancelled', '2026-07-28 13:00:00'),
-- Additional cancelled bookings for statistics diversity
('BK-4026', 4, 3, 32.00, 'cancelled', '2026-06-18 10:00:00'),
('BK-4027', 5, 5, 18.00, 'cancelled', '2026-06-22 09:15:00'),
('BK-4028', 6, 8, 15.00, 'cancelled', '2026-06-30 18:20:00'),
('BK-4029', 3, 10, 18.00, 'cancelled', '2026-07-08 14:10:00');

-- 6. AUDIT LOGS
INSERT INTO audit_logs (id, user_name, action, module, description, created_at, ip_address) VALUES
(1, 'System', 'Database Seeding', 'System', 'Initialized reports and audit log tables with seed data.', '2026-07-29 10:00:00', '127.0.0.1'),
(2, 'Morgan Adeyemi', 'Login', 'Auth', 'Administrator logged in successfully.', '2026-07-29 10:05:12', '192.168.1.15'),
(3, 'Morgan Adeyemi', 'View Report', 'Reports', 'Accessed statistics dashboard and total revenue aggregates.', '2026-07-29 10:08:44', '192.168.1.15'),
(4, 'Morgan Adeyemi', 'Export PDF', 'Reports', 'Exported daily revenue report to PDF.', '2026-07-29 10:10:22', '192.168.1.15'),
(5, 'Morgan Adeyemi', 'Export CSV', 'Reports', 'Exported all bookings details to CSV.', '2026-07-29 10:12:05', '192.168.1.15'),
(6, 'Alex Rivera', 'Login', 'Auth', 'Member logged in successfully.', '2026-07-29 10:15:30', '192.168.1.42'),
(7, 'Alex Rivera', 'Book Ticket', 'Bookings', 'Placed booking BK-4019 for Neon Frontier.', '2026-07-29 10:18:14', '192.168.1.42'),
(8, 'Morgan Adeyemi', 'Cancel Booking', 'Bookings', 'Cancelled booking BK-4025 due to user request.', '2026-07-29 10:20:00', '192.168.1.15'),
(9, 'Morgan Adeyemi', 'View Logs', 'Audit Logs', 'Filtered audit logs by Module: Bookings.', '2026-07-29 10:22:15', '192.168.1.15'),
(10, 'Riley Davis', 'Login', 'Auth', 'Member logged in successfully.', '2026-07-29 11:00:05', '192.168.1.55'),
(11, 'Riley Davis', 'Book Ticket', 'Bookings', 'Placed booking BK-4023 for The Venetian Heist.', '2026-07-29 11:05:44', '192.168.1.55'),
(12, 'Morgan Adeyemi', 'Add Movie', 'Movies', 'Added new film "The Venetian Heist" to system.', '2026-07-29 11:15:10', '192.168.1.15'),
(13, 'Morgan Adeyemi', 'Create Showtime', 'Showtimes', 'Created showtime for "The Venetian Heist" on 2026-07-28.', '2026-07-29 11:18:22', '192.168.1.15'),
(14, 'Morgan Adeyemi', 'Update Theater', 'Theaters', 'Modified description of Grand Hall theater screen.', '2026-07-29 11:22:00', '192.168.1.15'),
(15, 'Jordan Lee', 'Login', 'Auth', 'Member logged in successfully.', '2026-07-29 12:00:18', '192.168.1.19'),
(16, 'Jordan Lee', 'Book Ticket', 'Bookings', 'Placed booking BK-4024 for The Venetian Heist.', '2026-07-29 12:03:59', '192.168.1.19'),
(17, 'Morgan Adeyemi', 'Export PDF', 'Reports', 'Exported Movie-wise sales breakdowns.', '2026-07-29 12:30:15', '192.168.1.15'),
(18, 'Morgan Adeyemi', 'Export CSV', 'Audit Logs', 'Exported full activity log sheet for audit review.', '2026-07-29 12:45:00', '192.168.1.15'),
(19, 'Morgan Adeyemi', 'View Report', 'Reports', 'Analyzed monthly booking counts and cancelled trends.', '2026-07-29 13:10:00', '192.168.1.15'),
(20, 'Morgan Adeyemi', 'Login', 'Auth', 'Administrator logged in from home backup connection.', '2026-07-29 15:45:22', '172.56.21.90'),
(21, 'Morgan Adeyemi', 'View Logs', 'Audit Logs', 'Searched logs for action "Delete" or "Cancel".', '2026-07-29 15:50:11', '172.56.21.90'),
(22, 'Casey Smith', 'Login', 'Auth', 'Member logged in successfully.', '2026-07-29 16:10:44', '192.168.1.102'),
(23, 'Casey Smith', 'Book Ticket', 'Bookings', 'Placed booking BK-4021 for The Laughing Fox.', '2026-07-29 16:15:30', '192.168.1.102'),
(24, 'Morgan Adeyemi', 'Export PDF', 'Reports', 'Exported Theatre-wise utilization report to PDF.', '2026-07-29 17:05:00', '192.168.1.15'),
(25, 'Morgan Adeyemi', 'View Report', 'Reports', 'Refreshed active dashboards for weekly sales comparison.', '2026-07-29 18:15:00', '192.168.1.15');
