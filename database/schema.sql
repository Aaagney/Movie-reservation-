-- ============================================================
-- CINEVAULT - Movie Reservation System
-- Module 8: Theatre & Showtime Management
-- Database Schema
-- ============================================================

DROP DATABASE IF EXISTS cinevault;
CREATE DATABASE cinevault CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE cinevault;

-- ------------------------------------------------------------
-- USERS  (dummy auth - no hashing/JWT per project spec)
-- ------------------------------------------------------------
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'customer') NOT NULL DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_users_email (email)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- GENRES
-- ------------------------------------------------------------
CREATE TABLE genres (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(60) NOT NULL UNIQUE
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- MOVIES
-- ------------------------------------------------------------
CREATE TABLE movies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    poster_url VARCHAR(500),
    rating VARCHAR(10) DEFAULT 'PG-13',
    duration_minutes INT NOT NULL DEFAULT 120,
    director VARCHAR(150),
    cast_list VARCHAR(500),
    release_date DATE,
    status ENUM('now_showing', 'coming_soon', 'ended') DEFAULT 'now_showing',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_movies_status (status)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- MOVIE <-> GENRE (many to many)
-- ------------------------------------------------------------
CREATE TABLE movie_genres (
    movie_id INT NOT NULL,
    genre_id INT NOT NULL,
    PRIMARY KEY (movie_id, genre_id),
    FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,
    FOREIGN KEY (genre_id) REFERENCES genres(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- THEATRES  (Module focus)
-- ------------------------------------------------------------
CREATE TABLE theatres (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    location VARCHAR(200),
    city VARCHAR(100) NOT NULL,
    address VARCHAR(300),
    phone VARCHAR(30),
    email VARCHAR(150),
    status ENUM('active', 'inactive') DEFAULT 'active',
    has_parking BOOLEAN DEFAULT FALSE,
    has_food_court BOOLEAN DEFAULT FALSE,
    has_wheelchair_access BOOLEAN DEFAULT FALSE,
    has_ac BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_theatres_city (city),
    INDEX idx_theatres_status (status)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- SCREEN TYPES
-- ------------------------------------------------------------
CREATE TABLE screen_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(20) NOT NULL UNIQUE -- 2D, 3D, IMAX, 4DX, VIP
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- SCREENS  (Module focus)
-- ------------------------------------------------------------
CREATE TABLE screens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    theatre_id INT NOT NULL,
    screen_name VARCHAR(100) NOT NULL,
    screen_number INT NOT NULL,
    capacity INT NOT NULL,
    rows_count INT NOT NULL DEFAULT 10,
    columns_count INT NOT NULL DEFAULT 12,
    screen_type_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (theatre_id) REFERENCES theatres(id) ON DELETE CASCADE,
    FOREIGN KEY (screen_type_id) REFERENCES screen_types(id),
    UNIQUE KEY uniq_theatre_screen_number (theatre_id, screen_number),
    INDEX idx_screens_theatre (theatre_id)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- SHOWTIMES  (Main Module)
-- ------------------------------------------------------------
CREATE TABLE showtimes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    movie_id INT NOT NULL,
    theatre_id INT NOT NULL,
    screen_id INT NOT NULL,
    show_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    language VARCHAR(50) DEFAULT 'English',
    format VARCHAR(20) DEFAULT '2D',
    ticket_price DECIMAL(8,2) NOT NULL DEFAULT 12.00,
    available_seats INT NOT NULL,
    status ENUM('scheduled', 'ongoing', 'completed', 'cancelled') DEFAULT 'scheduled',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,
    FOREIGN KEY (theatre_id) REFERENCES theatres(id) ON DELETE CASCADE,
    FOREIGN KEY (screen_id) REFERENCES screens(id) ON DELETE CASCADE,
    INDEX idx_showtimes_movie (movie_id),
    INDEX idx_showtimes_theatre (theatre_id),
    INDEX idx_showtimes_date (show_date),
    INDEX idx_showtimes_screen (screen_id),
    INDEX idx_showtimes_status (status)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- SEATS  (generated per screen)
-- ------------------------------------------------------------
CREATE TABLE seats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    screen_id INT NOT NULL,
    seat_row VARCHAR(2) NOT NULL,
    seat_number INT NOT NULL,
    seat_type ENUM('standard', 'vip') DEFAULT 'standard',
    FOREIGN KEY (screen_id) REFERENCES screens(id) ON DELETE CASCADE,
    UNIQUE KEY uniq_screen_seat (screen_id, seat_row, seat_number),
    INDEX idx_seats_screen (screen_id)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- BOOKINGS
-- ------------------------------------------------------------
CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    showtime_id INT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    booking_status ENUM('confirmed', 'cancelled') DEFAULT 'confirmed',
    booked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (showtime_id) REFERENCES showtimes(id) ON DELETE CASCADE,
    INDEX idx_bookings_user (user_id),
    INDEX idx_bookings_showtime (showtime_id)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- BOOKING SEATS (many to many: booking <-> seat)
-- ------------------------------------------------------------
CREATE TABLE booking_seats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    seat_id INT NOT NULL,
    price DECIMAL(8,2) NOT NULL,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (seat_id) REFERENCES seats(id) ON DELETE CASCADE,
    UNIQUE KEY uniq_booking_seat (booking_id, seat_id),
    INDEX idx_booking_seats_booking (booking_id)
) ENGINE=InnoDB;
