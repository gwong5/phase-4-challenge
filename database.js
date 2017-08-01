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
      if (result.rows.length > 1) {
        console.log('QUERY <-', JSON.stringify(result.rows))
        callback(error, result.rows)
      } else {
        console.log('QUERY <-', JSON.stringify(result.rows[0]))
        callback(error, result.rows[0])
      }
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
  query("SELECT * FROM reviews ORDER BY review_created DESC LIMIT 3", [], callback)
}

const getReviewsByAlbum = function (albumId, callback) {
  query("SELECT * FROM reviews WHERE album_id = $1 ORDER BY review_created DESC", [albumId], callback)
}

const getReviewsByUser = function (albumId, userId, callback) {
  query("SELECT * FROM reviews WHERE  album_id = $1 AND user_id = $2", [albumId, userId], callback)
}

const addNewReview = function (albumId, userId, reviewBody) {
  query("INSERT INTO reviews (album_id, user_id, review_body) VALUES ($1, $2, $3)", [albumId, userId, reviewBody], callback)
}

const deleteReview = function (reviewId) {
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
  getReviewsByUser,
  getReviewsByAlbum
}
