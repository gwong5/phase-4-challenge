const express = require('express')
const router = express.Router()

router.get('/:albumID', (request, response) => {
  const albumID = request.params.albumID

  database.getAlbumsByID(albumID, (error, albums) => {
    if (error) {
      response.status(500).render('error', { error: error })
    } else {
      const album = albums
      response.render('album', { album: album })
    }
  })
})

module.exports = router
