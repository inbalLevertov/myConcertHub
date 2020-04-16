// const spicedPg = require("spiced-pg");
// let secrets;
// process.env.NODE_ENV === "production"
//     ? (secrets = process.env)
//     : (secrets = require("../secrets"));
// const dbUrl =
//     process.env.DATABASE_URL ||
//     `postgres:${secrets.dbUser}:${secrets.dbPassword}@localhost:5432/finalproject`;
// const db = spicedPg(dbUrl);

///////
const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL ||
        `postgres://postgres:postgres@localhost:5432/finalproject`
);

exports.addRegister = function(first, last, email, password) {
    // console.log("addRegister is working");
    return db.query(
        `INSERT INTO users (first, last, email, password)
      VALUES ($1, $2, $3, $4)
      RETURNING id`,
        [first, last, email, password]
    );
};

exports.getPass = function(email) {
    return db.query(`SELECT password, id FROM users WHERE email = $1`, [email]);
};

exports.compareEmail = function(email) {
    return db.query(`SELECT email FROM users WHERE email = $1`, [email]);
};
// exports.compareCode = function() {
//     return db.query(
//         `SELECT * FROM password_reset_codes WHERE CURRENT_TIMESTAMP - created_at < INTERVAL '10 minutes'`
//     );
// };

exports.insertCode = function(email, code) {
    return db.query(
        `INSERT INTO password_reset_codes (email, code)
      VALUES ($1, $2)
      RETURNING id`,
        [email, code]
    );
};

exports.getCode = function(email) {
    return db.query(
        `SELECT code FROM password_reset_codes WHERE CURRENT_TIMESTAMP - created_at < INTERVAL '10 minutes' AND email = $1`,
        [email]
    );
};

exports.getUserDetails = function(id) {
    return db
        .query(`SELECT * FROM users WHERE id = $1`, [id])
        .then(({ rows }) => rows);
};

exports.getLastUsers = function() {
    return db
        .query(
            `SELECT * FROM users ORDER BY id DESC LIMIT 3
`
        )
        .then(({ rows }) => rows);
};

exports.getMatchingUsers = function(val) {
    return db
        .query(`SELECT * FROM users WHERE first ILIKE $1 OR last ILIKE $1;`, [
            val + "%"
        ])
        .then(({ rows }) => rows);
};

exports.updatePass = function(password, email) {
    return db.query(
        `UPDATE users SET password=$1 WHERE email=$2 RETURNING id`,
        [password, email]
    );
};

exports.insertURL = function(filename, s3Url, id) {
    return db.query(
        `UPDATE users SET url=$1 WHERE id=$2
    RETURNING url, id`,
        [s3Url + filename, id]
    );
};

exports.insertBio = function(bio, id) {
    return db.query(
        `UPDATE users SET bio=$1 WHERE id=$2
    RETURNING bio, id`,
        [bio, id]
    );
};

exports.checkRelationship = function(userId, receiverId) {
    return db
        .query(
            `SELECT * FROM friendships
          WHERE (receiver_id = $1 AND sender_id = $2)
          OR (receiver_id = $2 AND sender_id = $1)`,
            [userId, receiverId]
        )
        .then(({ rows }) => rows);
};

exports.deleteRelationship = function(userId, receiverId) {
    return db.query(
        `DELETE FROM friendships
          WHERE (receiver_id = $1 AND sender_id = $2)
          OR (receiver_id = $2 AND sender_id = $1)`,
        [userId, receiverId]
    );
};

exports.insertRelationship = function(userId, receiverId) {
    return db
        .query(
            `INSERT INTO friendships (sender_id, receiver_id)
          VALUES ($1, $2)
          RETURNING id`,
            [userId, receiverId]
        )
        .then(({ rows }) => rows);
};

exports.updateRelationship = function(senderId, receiverId) {
    return db
        .query(
            `UPDATE friendships SET accepted=true WHERE (sender_id=$1 AND receiver_id=$2) OR (sender_id=$2 AND receiver_id=$1)
          RETURNING id, accepted`,
            [senderId, receiverId]
        )
        .then(({ rows }) => rows);
};

exports.manageFriendship = function(userId) {
    return db
        .query(
            `
      SELECT users.id, first, last, url, accepted
      FROM friendships
      JOIN users
      ON (accepted = false AND receiver_id = $1 AND sender_id = users.id)
      OR (accepted = true AND sender_id = $1 AND receiver_id = users.id)
      OR (accepted = true AND receiver_id = $1 AND sender_id = users.id)
`,
            [userId]
        )
        .then(({ rows }) => rows);
};

// ON (accepted = false AND sender_id = $1 AND receiver_id = users.id)

// ON (accepted = false AND receiver_id = $1 AND sender_id = users.id)

exports.getLastTenChatMessages = function() {
    return db.query(
        `SELECT users.first, users.last, users.url, messages.message_text, messages.created_at
        FROM users
        JOIN messages
        ON messages.sender_id = users.id
        ORDER BY messages.created_at DESC LIMIT 10`
    );
};
exports.getLastVideos = function() {
    return db.query(
        `SELECT users.first, users.last, users.url, videos.video, videos.created_at, videos.title, videos.description
        FROM users
        JOIN videos
        ON videos.sender_id = users.id
        ORDER BY videos.created_at DESC`
    );
};

exports.getLastTenPosts = function() {
    return db.query(
        `SELECT users.first, users.last, users.url, posts.post_text, posts.created_at, posts.receiver_id
        FROM users
        JOIN posts
        ON posts.sender_id = users.id
        ORDER BY posts.created_at DESC`
    );
};

exports.insertNewChatMessage = function(message, userId) {
    return db.query(
        `INSERT INTO messages (message_text, sender_id)
        VALUES ($1, $2)
        RETURNING created_at`,
        [message, userId]
    );
};
exports.insertNewPost = function(message, userId, receiverId) {
    return db.query(
        `INSERT INTO posts (post_text, sender_id, receiver_id)
        VALUES ($1, $2, $3)
        RETURNING created_at`,
        [message, userId, receiverId]
    );
};

exports.insertImage = function(filename, s3Url, id, description, receiverId) {
    return db.query(
        `INSERT INTO images (image, sender_id, description, receiver_id)
            VALUES ($1, $2, $3, $4)
            RETURNING *`,
        [s3Url + filename, id, description, receiverId]
    );
};

exports.getLastImages = function() {
    return db.query(
        `SELECT users.first, users.last, users.url, images.image, images.description, images.receiver_id, images.created_at
        FROM users
        JOIN images
        ON images.sender_id = users.id
        ORDER BY images.created_at DESC`
    );
};

exports.insertVideo = function(filename, s3Url, id, title, description) {
    return db.query(
        `INSERT INTO videos (video, sender_id, title, description)
            VALUES ($1, $2, $3, $4)
            RETURNING *`,
        [s3Url + filename, id, title, description]
    );
};

// exports.insertURL = function(username, title, description, filename, s3Url) {
//     return db.query(
//         `INSERT INTO images (username, title, description, url)
//     VALUES ($1, $2, $3, $4)
//     RETURNING *`,
//         [username, title, description, s3Url + filename]
//     );
// };

// exports.insertCode = function(email, code) {
//     return db.query(
//         `INSERT INTO password_reset_codes (email, code)
//       VALUES ($1, $2)
//       RETURNING id`,
//         [email, code]
//     );
// };

// -- INSERT INTO messages (message_text, sender_id) VALUES (
// --     'Welcome to Spiced and the Future! message no 1',
// --     5
// -- );

// exports.renderFullProfile = function(userId) {
//     return db.query(
//         `SELECT users.first, users.last, users.email, user_profiles.age, user_profiles.city, user_profiles.url
// FROM users
// LEFT JOIN user_profiles
//  ON user_profiles.user_id = users.id
//  WHERE users.id = $1`,
//         [userId]
//     );
// };

// `UPDATE friendships SET accepted=true WHERE sender_id=$1 AND receiver_id=$2 OR WHERE sender_id=$2 AND receiver_id=$1
// RETURNING id`,

// `UPDATE users SET bio=$1 WHERE id=$2
// RETURNING bio, id`,
// [bio, id]

// exports.updateNoPass = function(first, last, email, userId) {
//     return db.query(
//         `UPDATE users SET first=$1, last=$2, email=$3 WHERE id=$4`,
//         [first, last, email, userId]
//     );
// };

//SELECT * FROM my_table
// WHERE CURRENT_TIMESTAMP - created_at < INTERVAL '10 minutes';
