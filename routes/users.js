const express = require('express')
const router = express.Router()
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const Database = require('../database')
const User = require('./utils/utils')

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((userId, done) => {
  Database.findUserById(userId, (error, user) => {
    return done(error, user)
  })
})

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  (request, email, plainTextPassword, done) => {
    Database.findUserByEmail(email, (error, user) => {
      console.log('passport local: ', user);
      if (!user) {
        return done(null, false, request.flash('signInError', 'User does not exist.'))
      } else {
        const isValid = User.validatePassword(plainTextPassword, user.salted_password)
        console.log(isValid)
        if (!isValid) {
          return done(null, false, request.flash('signInError', 'Invalid Password.'))
        } else {
          console.log('logging in')
          return done(null, user)
        }
      }
    })
  })
)

router.get('/:userId', (request, response) => {
  const { userId } = request.params
  response.render('profile')
})

router.post('/sign_in',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/sign_in',
    failureFlash: true
  })
)

router.post('/sign_up', (request, response) => {
  const { name, email, password } = request.body
  Database.findUserByEmail(email, (error, user) => {
    if (user) {
      request.flash('signUpError', 'User already exists.')
      response.redirect('/sign_up')
    } else {
      User.createNewUser(name, email, password, (newUser) => {
        passport.authenticate('local')
        (request, response, () => {
          response.redirect(`/users/${newUser.id}`)
        })
      })
    }
  })
})

module.exports = router
