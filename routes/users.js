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
  Database.findUserById(userId, (user) => {
    if (user) {
      return done(null)
    }
  })
})

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  (request, email, plainTextPassword, done) => {
    console.log('is this even working')
    Database.findUserByEmail(email, (error, user) => {
      console.log('passport local: ', user);
      if (!user) {
        return done(null, false, request.flash('signInError', 'User does not exist.'))
      } else {
        User.validatePassword(plainTextPassword, user.salted_password)
          .then((isValid) => {
            if (!isValid) {
              return done(null, false, request.flash('signInError', 'Invalid Password.'))
            }
            return done(null, user)
          })
        }
      })
    }
  )
)

router.get('/:userId', (request, response) => {
  const { userId } = request.params
  response.render('profile')
})

router.post('/sign_in', (request, response) => {
  console.log('blasdf')
  passport.authenticate('local', {
    successRedirect: `/`,
    failureRedirect: '/sign_in',
    failurFlash: true
  })
})

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
