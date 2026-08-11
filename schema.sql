-- ============================================================
-- CineVault — PostgreSQL Schema
-- Run this file against a fresh database, e.g.:
--   psql -U postgres -d cinevault -f schema.sql
-- ============================================================

DROP TABLE IF EXISTS food_orders CASCADE;
DROP TABLE IF EXISTS booking_seats CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS seats CASCADE;
DROP TABLE IF EXISTS shows CASCADE;
DROP TABLE IF EXISTS food_items CASCADE;
DROP TABLE IF EXISTS theatres CASCADE;
DROP TABLE IF EXISTS movies CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ------------------------------------------------------------
-- users
-- ------------------------------------------------------------
CREATE TABLE users (
    id            SERIAL PRIMARY KEY,
    name          VARCHAR(120)  NOT NULL,
    email         VARCHAR(160)  NOT NULL UNIQUE,
    password      VARCHAR(255)  NOT NULL,
    created_at    TIMESTAMP     NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------
-- movies
-- ------------------------------------------------------------
CREATE TABLE movies (
    id            SERIAL PRIMARY KEY,
    title         VARCHAR(160)  NOT NULL,
    genre         VARCHAR(120)  NOT NULL,
    duration      INTEGER       NOT NULL,      -- minutes
    rating        NUMERIC(2,1)  NOT NULL DEFAULT 0.0,
    language      VARCHAR(60)   NOT NULL,
    poster_url    TEXT,
    synopsis      TEXT,
    created_at    TIMESTAMP     NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------
-- theatres
-- ------------------------------------------------------------
CREATE TABLE theatres (
    id            SERIAL PRIMARY KEY,
    name          VARCHAR(160)  NOT NULL,
    location      VARCHAR(200)  NOT NULL,
    screens       INTEGER       NOT NULL DEFAULT 1
);

-- ------------------------------------------------------------
-- shows  (a movie playing at a theatre at a given time)
-- ------------------------------------------------------------
CREATE TABLE shows (
    id            SERIAL PRIMARY KEY,
    movie_id      INTEGER NOT NULL REFERENCES movies(id)   ON DELETE CASCADE,
    theatre_id    INTEGER NOT NULL REFERENCES theatres(id) ON DELETE CASCADE,
    show_time     VARCHAR(20) NOT NULL,   -- 'Morning' | 'Afternoon' | 'Evening' | 'Night'
    show_date     DATE        NOT NULL DEFAULT CURRENT_DATE,
    price         NUMERIC(8,2) NOT NULL
);

-- ------------------------------------------------------------
-- seats  (one physical seat per show)
-- ------------------------------------------------------------
CREATE TABLE seats (
    id            SERIAL PRIMARY KEY,
    show_id       INTEGER NOT NULL REFERENCES shows(id) ON DELETE CASCADE,
    seat_number   VARCHAR(10) NOT NULL,      -- e.g. 'A1'
    status        VARCHAR(20) NOT NULL DEFAULT 'available', -- available | booked
    UNIQUE (show_id, seat_number)
);

-- ------------------------------------------------------------
-- bookings
-- ------------------------------------------------------------
CREATE TABLE bookings (
    id            SERIAL PRIMARY KEY,
    user_id       INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    show_id       INTEGER NOT NULL REFERENCES shows(id) ON DELETE CASCADE,
    booking_date  TIMESTAMP NOT NULL DEFAULT NOW(),
    total_amount  NUMERIC(10,2) NOT NULL DEFAULT 0,
    status        VARCHAR(20) NOT NULL DEFAULT 'confirmed' -- confirmed | cancelled
);

-- ------------------------------------------------------------
-- booking_seats  (join table: which seats belong to which booking)
-- ------------------------------------------------------------
CREATE TABLE booking_seats (
    id            SERIAL PRIMARY KEY,
    booking_id    INTEGER NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    seat_id       INTEGER NOT NULL REFERENCES seats(id)    ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- food_items
-- ------------------------------------------------------------
CREATE TABLE food_items (
    id            SERIAL PRIMARY KEY,
    name          VARCHAR(120) NOT NULL,
    category      VARCHAR(40)  NOT NULL,   -- popcorn | drinks | combo
    price         NUMERIC(8,2) NOT NULL,
    image_url     TEXT
);

-- ------------------------------------------------------------
-- food_orders
-- ------------------------------------------------------------
CREATE TABLE food_orders (
    id            SERIAL PRIMARY KEY,
    booking_id    INTEGER NOT NULL REFERENCES bookings(id)   ON DELETE CASCADE,
    food_item_id  INTEGER NOT NULL REFERENCES food_items(id) ON DELETE CASCADE,
    quantity      INTEGER NOT NULL DEFAULT 1,
    total_price   NUMERIC(10,2) NOT NULL
);

-- Helpful indexes for the lookups the API performs most often
CREATE INDEX idx_shows_movie_id      ON shows(movie_id);
CREATE INDEX idx_shows_theatre_id    ON shows(theatre_id);
CREATE INDEX idx_seats_show_id       ON seats(show_id);
CREATE INDEX idx_bookings_user_id    ON bookings(user_id);
CREATE INDEX idx_booking_seats_bid   ON booking_seats(booking_id);
CREATE INDEX idx_food_orders_bid     ON food_orders(booking_id);

-- ============================================================
-- SAMPLE DATA
-- ============================================================

INSERT INTO users (name, email, password) VALUES
  ('Guest User', 'guest@cinevault.com', 'guest123');

INSERT INTO movies (title, genre, duration, rating, language, poster_url, synopsis) VALUES
  ('Karuppu',   'Thriller / Drama',      128, 4.6, 'English', 'https://imgs.search.brave.com/dqOWL5D06cbnZN8kCXMIopI2eJQ_oJyDgf2ot17JH8c/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly90YW1p/bGd1bi5ub3cvd3At/Y29udGVudC91cGxv/YWRzLzIwMjYvMDUv/S2FydXBwdS0yMDI2/LVRhbWlsLU1vdmll/LmpwZw',  'A detective chases a killer who only strikes at the stroke of midnight.'),
  ('The Gilded Hour',    'Romance / Period',      142, 4.3, 'English', 'https://imgs.search.brave.com/9LSvlodsVJzAX1VfDu5GCcZRIOKFot6fOMMQRz2oQFs/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly81Lmlt/aW1nLmNvbS9kYXRh/NS9TRUxMRVIvRGVm/YXVsdC8yMDI0LzMv/Mzk5NTM2MzQ5L0NO/L0tVL05QLzIxNjEx/NTMzMy90YW1pbC1t/b3ZpZXMtd2FsbC1w/b3N0ZXJzLTEwMDB4/MTAwMC5qcGc',        'In 1920s Paris, two rival painters fall for each other against their better judgement.'),
  ('Velocity',           'Action / Sci-Fi',       119, 4.5, 'English', 'https://imgs.search.brave.com/NvxzEHuiohm3rpRtHEKbrBtPn6U081pRNKV62rLtC0A/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9nb29k/LWhvcGUuaW4vY2Ru/L3Nob3AvZmlsZXMv/VmlqYXlfQmFkYmFz/c18zLnBuZz92PTE3/NTU1MDU4OTImd2lk/dGg9MTQ0NQ',     'A test pilot must outrun a weapon she helped design.'),
  ('Kanchana Nadhi',     'Drama',                 135, 4.7, 'Tamil',   'https://imgs.search.brave.com/fJCLds0tRrU8KWwczywUjbfu8Wm69szIcB-jvAEf2Zs/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9wcmV2/aWV3LnJlZGQuaXQv/c29tZS1vZi1teS1m/YXZvdXJpdGUtdGFt/aWwtZmlsbS1wb3N0/ZXJzLW9mLXRoZS0y/MXN0LWNlbnR1cnkt/djAtcG0zcW5zZ2Zs/Ym5jMS5qcGc_d2lk/dGg9NjQwJmNyb3A9/c21hcnQmYXV0bz13/ZWJwJnM9YjUzN2U1/NzI5M2Q3OWY2MDJh/MTU4MzNlN2IxZWMx/Y2YyZmU1MTEzMA',      'A river town reckons with the return of its most famous son.'),
  ('Whispering Pines',   'Horror / Mystery',      101, 4.1, 'English', 'https://imgs.search.brave.com/a2gMGz39RG4Z5sMjVfgPYGCUnhpCWQxybPpSormyQLA/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9wcmV2/aWV3LnJlZGQuaXQv/c29tZS1yZWFsbHkt/Z3JlYXQtdGFtaWwt/bW92aWUtcG9zdGVy/cy1kcm9wLXdoYXQt/eWFsbC10aGluay12/MC11YXBvYXZpenU3/eGExLmpwZz93aWR0/aD00NjUmZm9ybWF0/PXBqcGcmYXV0bz13/ZWJwJnM9ZTI4NDhi/YmVjYWEyN2JmZTFj/OGEwMDRkMjgxZDZj/Y2Y4YzdlZGQwYQ',    'Four friends find a cabin that remembers every guest it has ever had.'),
  ('Laugh Track',        'Comedy',                 98, 4.0, 'English', 'https://imgs.search.brave.com/QGSX_ZLIlFpAwm1yOIipdN_g5oMBJ07nP-asgCqjXhM/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9wcmV2/aWV3LnJlZGQuaXQv/c29tZS1yZWFsbHkt/Z3JlYXQtdGFtaWwt/bW92aWUtcG9zdGVy/cy1kcm9wLXdoYXQt/eWFsbC10aGluay12/MC1kdWQ3bmd1YjYx/eWExLmpwZWc_d2lk/dGg9NzczJmZvcm1h/dD1wanBnJmF1dG89/d2VicCZzPWViNmZj/NGRlNzgwMDhhNzY0/ZjIxNDQwMmRkZGY4/MjM4YjhlYWY0ZTk',         'A washed-up sitcom star gets one last shot at a comeback special.'),
  ('Iron Monsoon',       'Action / War',          151, 4.8, 'Hindi',   'https://picsum.photos/seed/ironmonsoon/400/560',        'A battalion holds a flooded border post through the worst storm in a decade.'),
  ('Paper Constellations','Animation / Family',    96, 4.4, 'English', 'https://picsum.photos/seed/paperconstellations/400/560','A child folds an origami universe that starts folding back.');

INSERT INTO theatres (name, location, screens) VALUES
  ('CineVault Grand — Anna Nagar',   'Anna Nagar, Chennai',      6),
  ('CineVault Prime — OMR',          'OMR, Chennai',             8),
  ('CineVault Lumière — Nungambakkam','Nungambakkam, Chennai',   4),
  ('CineVault Skyline — T. Nagar',   'T. Nagar, Chennai',        5);

-- Shows: give every movie a spread of theatres and time slots
INSERT INTO shows (movie_id, theatre_id, show_time, price) VALUES
  (1, 1, 'Morning',   220.00), (1, 2, 'Evening',   260.00), (1, 3, 'Night',     240.00),
  (2, 1, 'Afternoon', 210.00), (2, 4, 'Evening',   250.00),
  (3, 2, 'Morning',   230.00), (3, 2, 'Night',      270.00), (3, 3, 'Evening',  260.00),
  (4, 1, 'Evening',   200.00), (4, 4, 'Afternoon',  190.00),
  (5, 3, 'Night',     240.00), (5, 2, 'Evening',    250.00),
  (6, 4, 'Afternoon', 180.00), (6, 1, 'Morning',    170.00),
  (7, 2, 'Evening',   280.00), (7, 3, 'Night',      290.00), (7, 1, 'Afternoon',260.00),
  (8, 4, 'Morning',   190.00), (8, 1, 'Afternoon',  200.00);

-- Seats: 5 rows (A–E) x 8 seats for every show
DO $$
DECLARE
  s RECORD;
  row_letter TEXT;
  seat_num INTEGER;
BEGIN
  FOR s IN SELECT id FROM shows LOOP
    FOREACH row_letter IN ARRAY ARRAY['A','B','C','D','E'] LOOP
      FOR seat_num IN 1..8 LOOP
        INSERT INTO seats (show_id, seat_number, status)
        VALUES (s.id, row_letter || seat_num,
                CASE WHEN random() < 0.15 THEN 'booked' ELSE 'available' END);
      END LOOP;
    END LOOP;
  END LOOP;
END $$;

INSERT INTO food_items (name, category, price, image_url) VALUES
  ('Small Popcorn',        'popcorn', 120.00, 'https://picsum.photos/seed/popcornsmall/300/300'),
  ('Medium Popcorn',       'popcorn', 170.00, 'https://picsum.photos/seed/popcornmedium/300/300'),
  ('Large Popcorn',        'popcorn', 220.00, 'https://picsum.photos/seed/popcornlarge/300/300'),
  ('Coke',                 'drinks',   90.00, 'https://picsum.photos/seed/cokedrink/300/300'),
  ('Pepsi',                'drinks',   90.00, 'https://picsum.photos/seed/pepsidrink/300/300'),
  ('Water Bottle',         'drinks',   40.00, 'https://picsum.photos/seed/waterbottle/300/300'),
  ('Fresh Juice',          'drinks',  110.00, 'https://picsum.photos/seed/freshjuice/300/300'),
  ('Popcorn + Drink Combo','combo',   250.00, 'https://picsum.photos/seed/popcorndrinkcombo/300/300'),
  ('Family Combo',         'combo',   550.00, 'https://picsum.photos/seed/familycombo/300/300'),
  ('Couple Combo',         'combo',   380.00, 'https://picsum.photos/seed/couplecombo/300/300');
