-- DROP TABLE IF EXISTS users;
-- DROP TABLE IF EXISTS password_reset_codes;
-- DROP TABLE IF EXISTS friendships;
-- DROP TABLE IF EXISTS images;
-- DROP TABLE IF EXISTS videos;
-- DROP TABLE IF EXISTS posts;

CREATE TABLE users(
      id SERIAL PRIMARY KEY,
      first VARCHAR(255) NOT NULL CHECK (first != ''),
      last VARCHAR(255) NOT NULL CHECK (last != ''),
      email VARCHAR(255) NOT NULL UNIQUE CHECK (email != ''),
      password VARCHAR(255) NOT NULL CHECK (password != ''),
      url VARCHAR,
      bio VARCHAR,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

CREATE TABLE password_reset_codes(
    id SERIAL PRIMARY KEY,
    code VARCHAR NOT NULL CHECK (code != ''),
    email VARCHAR NOT NULL CHECK (email != ''),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE friendships (
      id SERIAL PRIMARY KEY,
      receiver_id INT NOT NULL REFERENCES users(id),
      sender_id INT NOT NULL REFERENCES users(id),
      accepted BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );


CREATE TABLE messages (
      id SERIAL PRIMARY KEY,
      message_text VARCHAR NOT NULL CHECK (message_text != ''),
      sender_id INT NOT NULL REFERENCES users(id),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

--
CREATE TABLE posts (
      id SERIAL PRIMARY KEY,
      post_text VARCHAR NOT NULL CHECK (post_text != ''),
      sender_id INT NOT NULL REFERENCES users(id),
      receiver_id INT NOT NULL REFERENCES users(id),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
--
 CREATE TABLE images(
    id SERIAL PRIMARY KEY,
    image VARCHAR NOT NULL,
    sender_id INT NOT NULL REFERENCES users(id),
    receiver_id INT NOT NULL REFERENCES users(id),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
--
 CREATE TABLE videos(
    id SERIAL PRIMARY KEY,
    video VARCHAR NOT NULL,
    sender_id INT NOT NULL REFERENCES users(id),
    title VARCHAR,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
