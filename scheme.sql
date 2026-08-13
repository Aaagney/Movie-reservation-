USE cinevault_db;

CREATE TABLE movies (
    id INT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    director VARCHAR(100) NOT NULL,
    cast_members TEXT NOT NULL,
    description TEXT NOT NULL,
    rating VARCHAR(10) NOT NULL,
    duration INT NOT NULL,
    poster_url TEXT NOT NULL,
    category VARCHAR(50) NOT NULL
);

CREATE TABLE showtimes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    movie_id INT NOT NULL,
    date_label VARCHAR(50) NOT NULL,
    time_label VARCHAR(20) NOT NULL,
    hall_name VARCHAR(50) NOT NULL,
    price DECIMAL(6,2) NOT NULL,
    FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE
);

INSERT INTO movies (id, title, director, cast_members, description, rating, duration, poster_url, category) VALUES
(1, 'Interstellar Odyssey', 'Christopher Nolan', 'Matthew McConaughey, Anne Hathaway, Jessica Chastain', 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity''s survival.', 'PG-13', 169, 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop', 'Sci-Fi'),
(2, 'The Dark Knight Vanguard', 'Christopher Nolan', 'Christian Bale, Heath Ledger, Aaron Eckhart', 'When the menace known as the Joker wreaks havoc and chaos on Gotham, Batman must accept one of the greatest tests.', 'PG-13', 152, 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop', 'Action'),
(3, 'Neon Cyberpunk 2099', 'Denis Villeneuve', 'Ryan Gosling, Harrison Ford, Ana de Armas', 'A young blade runner''s discovery of a long-buried secret leads him to track down a former blade runner.', 'R', 164, 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop', 'Sci-Fi'),
(4, 'Shadows of Venice', 'Martin Scorsese', 'Leonardo DiCaprio, Mark Ruffalo, Ben Kingsley', 'A detective investigates the disappearance of a murderer who escaped from a hospital for the criminally insane.', 'R', 138, 'https://images.unsplash.com/photo-1514565131-fce0801e5785?q=80&w=800&auto=format&fit=crop', 'Thriller');

INSERT INTO showtimes (movie_id, date_label, time_label, hall_name, price) VALUES
(1, 'MONDAY, JULY 27', '2:30 PM', 'Grand Hall', 16.00),
(1, 'MONDAY, JULY 27', '7:00 PM', 'Premiere Suite', 18.00),
(2, 'MONDAY, JULY 27', '4:15 PM', 'Hall B', 15.00),
(3, 'MONDAY, JULY 27', '6:00 PM', 'Hall C', 14.00),
(4, 'MONDAY, JULY 27', '8:30 PM', 'Grand Hall', 16.00),
(5, 'MONDAY, JULY 27', '10:00 PM', 'Premiere Suite', 18.00);

CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_code VARCHAR(50) NOT NULL UNIQUE,
    user_name VARCHAR(100) NOT NULL,
    movie_title VARCHAR(255) NOT NULL,
    hall_name VARCHAR(100) NOT NULL,
    showtime_label VARCHAR(150) NOT NULL,
    seats VARCHAR(255) NOT NULL,
    total_amount DECIMAL(8,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'CONFIRMED',
    poster_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE booking_seats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    seat_label VARCHAR(20) NOT NULL,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
);


select * from bookings;
delete from bookings where id=19;

select * from movies;


INSERT INTO movies (id, title, director, cast_members, description, rating, duration, poster_url, category) VALUES
(6, 'The Crimson Phantom', 'Guillermo del Toro', 'Tom Hiddleston, Mia Wasikowska, Jessica Chastain', 'In the aftermath of a family tragedy, an aspiring author is torn between love for her childhood friend and a mysterious stranger.', 'R', 119, 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop', 'Horror');

