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
    return done(error, user[0])
  })
})

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  (request, email, plainTextPassword, done) => {
    Database.findUserByEmail(email, (error, user) => {
      if (!user) {
        return done(null, false, request.flash('signInError', 'User does not exist.'))
      } else {
        const isValid = User.validatePassword(plainTextPassword, user[0].salted_password)
        console.log(isValid)
        if (!isValid) {
          return done(null, false, request.flash('signInError', 'Invalid Password.'))
        } else {
          return done(null, user[0])
        }
      }
    })
  })
)

router.get('/:userId', (request, response) => {
  const { userId } = request.params
  
  Database.findUserById(userId, (error, member) => {
    Database.getReviewsByUser(userId, (error, reviews) => {
      response.render('profile', { member: member[0], reviews: reviews })
    })
  })
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
          response.redirect(`/users/${newUser[0].id}`)
        })
      })
    }
  })
})

router.post('/:userId/reviews/:reviewId/delete', (request, response) => {
  const { userId, reviewId } = request.params

  Database.deleteReview(reviewId, (error) => {
    if (error) {
      response.status(500).render('error', { error: error})
    } else {
      response.redirect(`/users/${userId}`)
    }
  })
})

module.exports = router
