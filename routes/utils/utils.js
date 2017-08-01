const bcrypt = require('bcrypt')
const database = require('../../database')

const salt = bcrypt.genSaltSync(10)
const makeSaltedPassword = (plainTextPassword) =>
  bcrypt.hashSync(plainTextPassword, salt)

const validatePassword = (plainTextPassword, saltedPassword) =>
  bcrypt.compare(plainTextPassword, saltedPassword)

const createNewUser = (name, email, plainTextPassword, callback) => {
  const saltedPassword = makeSaltedPassword(plainTextPassword)
  database.createUser(name, email, saltedPassword, (error, userId) => {
    callback(userId)
  })
}

module.exports = {
  createNewUser,
  validatePassword
}
