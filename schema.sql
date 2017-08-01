DROP TABLE IF EXISTS albums;

CREATE TABLE albums (
  id SERIAL,
  title VARCHAR(255) NOT NULL,
  artist VARCHAR(255) NOT NULL
);

DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id SERIAL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  join_date DATE DEFAULT CURRENT_DATE,
  avatar_url VARCHAR(255),
  salted_password VARCHAR(255) NOT NULL
);

DROP TABLE IF EXISTS reviews;

CREATE TABLE reviews (
  id SERIAL,
  album_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  review_body VARCHAR(5000),
  review_created TIMESTAMP
);
