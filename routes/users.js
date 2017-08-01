const express = require('express')
const router = express.Router()
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  //find user by id - promise
  .then((user) => {
    return done(null)
  })
})

passport.use(new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    },
    (request, email, plainTextPassword, done) => {

    }
  )
)

router.get('/:userId', (request, response) => {
  const { userId } = request.body
  response.render('profile')
})

router.post('/sign_in', (request, response) => {
  passport.authenticate('local', {
    successRedirect: `/users/${user.id}`,
    failureRedirect: '/sign_in'
  })
})

router.post('/sign_up', (request, response) => {
  const { name, email, password } = request.body

})

module.exports = router
