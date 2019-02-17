const Busboy = require('busboy')
const albums = require('../modules/albums')
const photos = require('../modules/photos')
const $v = require('./$v.rules')

const postCreateAlbum = (req, res, next) => {
  albums
    .create({ name: req.body.name })
    .then((created) => {
      res.send(201)
    })
    .catch(next)
}

const getListAlbums = (req, res, next) => {
  const config = {
    limit: req.query.limit,
    offset: req.query.offset
  }

  albums.list(config)
    .then((result) => {
      res.send(result)
    })
    .catch(next)
}

const getListPhotos = (req, res, next) => {
  const config = {
    limit: req.query.limit,
    offset: req.query.offset
  }

  photos.list(req.query.album_id, config)
    .then((result) => {
      res.send(result)
    })
    .catch(next)
}

const postIndexPhoto = (req, res, next) => {
  const buffer = req.body

  // TODO: accept content-type image/* instead of the generic application/octet-stream
  // TODO: index multiple files at once
  const albumId = req.query.album_id
  photos.saveAndIndex({ imageBuf: buffer, albumId })
  res.send({success: true })
}

const postSearchPhoto = (req, res, next) => {
  const buffer = req.body

  // TODO: accept content-type image/* instead of the generic application/octet-stream
  photos.search(buffer).then(result => {
    res.send(result)
  })
}

function registerRoutes (server) {
  server.post({ path: '/albums', validation: $v.createAlbum }, postCreateAlbum)
  server.get({ path: '/albums', validation: $v.listAlbums }, getListAlbums)
  server.get({ path: '/photos', validation: $v.listPhotos }, getListPhotos)
  server.post({ path: '/photos', validation: $v.indexPhoto }, postIndexPhoto)
  server.post({ path: '/photos/search' }, postSearchPhoto)
}

module.exports.registerRoutes = registerRoutes
