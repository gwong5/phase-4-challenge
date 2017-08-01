const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const passport = require('passport')
const flash = require('connect-flash')
const database = require('./database')
const albums = require('./routes/albums')
const users = require('./routes/users')
const app = express()

require('ejs')
app.set('view engine', 'ejs');

app.use(session({
  secret: process.env.SECRET || 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 24 * 60 * 60 * 1000 }
}))

app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))

app.use((request, response, next) => {
  const { user } = request
  response.locals.user = user
  next()
})

app.get('/', (request, response) => {
  database.getAlbums((error, albums) => {
    if (error) {
      response.status(500).render('error', { error: error })
    } else {
      response.render('index', { albums: albums })
    }
  })
})

app.get('/sign_out', (request, response) => {
  request.logout()
  response.redirect('/')
})

app.use('/users', users)
app.use('/albums', albums)

app.use((request, response, next) => {
  const { user } = request
  if (user) {
    response.redirect(`/users/${user.id}`)
  } else {
    next()
  }
})

app.get('/sign_up', (request, response) => {
  response.render('sign_up', { signUpError: request.flash('signUpError') })
})

app.get('/sign_in', (request, response) => {
  response.render('sign_in', { signInError: request.flash('signInError') })
})

app.use((request, response) => {
  response.status(404).render('not_found')
})

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}...`)
})
