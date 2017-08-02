const express = require('express')
const router = express.Router()
const Database = require('../database')

router.get('/:albumId', (request, response) => {
  const { albumId } = request.params

  Database.getAlbumByID(albumId, (error, album) => {
    if (error) {
      response.status(500).render('error', { error: error })
    } else {
      Database.getReviewsByAlbum(albumId, (error, reviews) => {
        if (error) {
          response.status(500).render('error', { error: error })
        } else {
          response.render('album', { album: album[0], reviews: reviews })
        }
      })
    }
  })
})

router.route('/:albumId/new_review')
  .get((request, response) => {
    const { albumId } = request.params

    Database.getAlbumByID(albumId, (error, album) => {
      if (error) {
        response.status(500).render('error', { error: error})
      } else {
        response.render('new_review', { album: album[0] })
      }
    })
  })

  .post((request, response) => {
    const { albumId } = request.params
    const { reviewBody } = request.body
    const { user } = request
    
    Database.addNewReview(albumId, user.id, reviewBody, (error) => {
      if (error) {
        response.status(500).render('error', { error: error })
      } else {
        response.redirect(`/albums/${albumId}`)
      }
    })
  })

module.exports = router
