const sizeof = require('image-size')
const mongoose = require('mongoose')
const uuidv4 = require('uuid/v4')
const uuidToHex = require('uuid-to-hex')
const fileType = require('file-type')
const {
  upload,
  generateThumbnail,
  indexFaces,
  searchFacesByImage
} = require('./util')
const { Photo } = require('./models')

/**
 * Saves and indexes the faces in the provided image.
 * @param {Object} options
 * @param {Buffer} options.imageBuf - The image data
 * @param { String } options.albumId - The album to index this photo under.
 * @return {Promise}
 */
module.exports.saveAndIndex = async ({ imageBuf, albumId } = {}) => {
  const meta = fileType(imageBuf) || {}
  const key = uuidToHex(uuidv4())
  const ext = meta.ext ? '.' + meta.ext : ''
  const photoKey = `${key}${ext}`
  const thumbnailKey = `${key}_thumb.${meta.ext}`
  const thumbnailBuffer = await generateThumbnail(imageBuf, thumbnailKey)

  // Upload both thumbnail and actual images concurrently.
  const [photo, thumbnail] = await Promise.all([
    upload({ body: imageBuf, contentType: meta.contentType, key: photoKey }),
    upload({ body: thumbnailBuffer, contentType: meta.contentType, key: thumbnailKey })
  ])

  // Use the image key as the ExternalImageId to AWS Rekognition
  const externalImageId = mongoose.Types.ObjectId().toString()
  await indexFaces({
    externalImageId,
    s3: {
      bucket: photo.bucket,
      key: photo.key
    }
  })

  const photoDimensions = await sizeof(imageBuf)
  const newPhoto = new Photo({
    _id: externalImageId,
    thumbnail_url: thumbnail.location,
    photo_url: photo.location,
    album: albumId,
    photo_dimensions: {
      w: photoDimensions.width,
      h: photoDimensions.height
    }
  })
  return newPhoto.save()
}

/**
 * Lists all photos in a specified album.
 * @param {string} albumId - The album ID
 * @param {Object} config
 * @param {number} config.offset
 * @param {number} config.limit
 * @return {Promise}
 */
module.exports.list = (albumId, config) => {
  return Photo.findAndCount({ album: albumId }, {
    populate: 'Album',
    limit: config.limit,
    offset: config.offset
  })
}


/**
 * Returns a list of photos that has any of the faces in the input photo in them.
 * 
 * @param {Buffer} imageBuf
 * @return {Promise}
 */
module.exports.search = async (imageBuf) => {
  const matchedIds = await searchFacesByImage(imageBuf)
  const res = await Photo.find({
    '_id': { $in: matchedIds.map(mongoose.Types.ObjectId) }
  })
  .exec()

  return { items: res }
}

/**
 * Returns the thumbnail for the specified album.
 * @param {string} albumId
 * @return {Promise<string>}
 */
module.exports.getAlbumThumbnail = async (albumId) => {
  const album = await Photo.findOne({ album: albumId }, 'thumbnail_url').exec()
  return album && album.thumbnail_url || null
}