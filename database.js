const pg = require('pg')

const dbName = 'vinyl'
const connectionString = process.env.DATABASE_URL || `postgres://localhost:5432/${dbName}`
const client = new pg.Client(connectionString)

client.connect()

// Query helper function
const query = function(sql, variables, callback){
  console.log('QUERY ->', sql.replace(/[\n\s]+/g, ' '), variables)

  client.query(sql, variables, function(error, result){
    if (error) {
      console.log('QUERY <- !!ERROR!!')
      console.error(error)
      callback(error)
    } else {
      console.log('QUERY <-', JSON.stringify(result.rows))
      callback(error, result.rows)
    }
  })
}

const getAlbums = function (callback) {
  query("SELECT * FROM albums", [], callback)
}

const getAlbumByID = function (albumId, callback) {
  query("SELECT * FROM albums WHERE id = $1", [albumId], callback)
}

const getReviews = function (callback) {
  query("SELECT * FROM reviews ORDER BY id DESC LIMIT 3", [], callback)
}

const getRecentReviews = function (callback) {
  query("SELECT reviews.id AS review_id, reviews.review_body AS review_body, reviews.review_created AS creation_date, users.id AS reviewer_id, users.name AS reviewer, albums.id AS album_id, albums.title AS album_title, albums.artist AS album_artist FROM reviews JOIN users ON users.id = user_id JOIN albums ON albums.id = album_id ORDER BY review_id DESC LIMIT 3", [], callback)
}

const getReviewsByAlbum = function (albumId, callback) {
  query("SELECT users.name AS reviewer, users.id AS reviewer_id, reviews.id AS review_id, reviews.review_body, reviews.review_created AS creation_date FROM users JOIN reviews ON user_id = users.id JOIN albums ON album_id = $1 GROUP BY users.name, users. id, reviews.id, reviews.review_body, reviews.review_created", [albumId], callback)
}

const getReviewsByUser = function (userId, callback) {
  query("SELECT albums.id AS album_id, albums.title AS album_title, albums.artist AS album_artist, reviews.id AS review_id, reviews.review_created AS creation_date, reviews.review_body AS review_body FROM albums JOIN reviews ON reviews.album_id = albums.id WHERE reviews.user_id = $1 GROUP BY albums.id, albums.title, albums.artist, reviews.id, reviews.review_created, reviews.review_body ORDER BY reviews.id DESC", [userId], callback)
}

const addNewReview = function (albumId, userId, reviewBody, callback) {
  query("INSERT INTO reviews (album_id, user_id, review_body) VALUES ($1, $2, $3)", [albumId, userId, reviewBody], callback)
}

const deleteReview = function (reviewId, callback) {
  query("DELETE FROM reviews WHERE id = $1", [reviewId], callback)
}

const findUserById = function (userId, callback) {
  query("SELECT * FROM users WHERE id = $1", [userId], callback)
}

const findUserByEmail = function (email, callback) {
  query("SELECT * FROM users WHERE email ~* $1", [email], callback)
}

const createUser = function (name, email, saltedPassword, callback) {
  query("INSERT INTO users (name, email, salted_password) VALUES ($1, $2, $3) RETURNING id", [name, email, saltedPassword], callback)
}

module.exports = {
  addNewReview,
  createUser,
  deleteReview,
  findUserByEmail,
  findUserById,
  getAlbums,
  getAlbumByID,
  getReviews,
  getRecentReviews,
  getReviewsByUser,
  getReviewsByAlbum
}
