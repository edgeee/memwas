const AWS = require('aws-sdk')
const gm = require('gm')
const config = require('../../config')

const S3 = new AWS.S3(config.aws.config)
const Rekognition = new AWS.Rekognition(config.aws.config)

/**
 * Uploads a photo to a cloud service.
 * @param {Object} params
 * @param {Buffer} params.body - Object data
 * @param {string} params.key
 * @param {string} params.contentType
 * @return {Promise}
 */
module.exports.upload = (params) => {
  const payload = {
    ACL: 'public-read',
    Body: params.body,
    ContentType: params.ContentType,
    Bucket: config.aws.s3Bucket,
    Key: params.key
  }
  return new Promise((resolve, reject) => {
    S3.upload(payload, function (err, data) {
      if (err) { reject(err) } else {
        resolve({
          key: data.Key,
          bucket: data.Bucket,
          location: data.Location
        })
      }
    })
  })
}

/**
 * Generates thumbnail from the given image.
 * @param {Buffer} imageBuffer
 */
module.exports.generateThumbnail = (imageBuffer, filename) => {
  const width = config.thumbnail.width
  const height = config.thumbnail.height
  return new Promise((resolve, reject) => {
    gm(imageBuffer, filename)
      .resize(width, height, '^')
      .gravity('Center')
      .crop(width, height)
      .toBuffer(function (err, buf) {
        if (err) { reject(err) } else {
          resolve(buf)
        }
      })
  })
}

/**
 * Indexes the faces in the provided image data.
 * @param {Object} params
 * @param {string} params.externalImageId,
 * @param {Object} params.S3
 * @param {string} params.s3.bucket
 * @param {string} params.s3.key
 * @return {Promise}
 */
module.exports.indexFaces = (params) => {
  const payload = {
    CollectionId: config.aws.rekognitionFaceIndex,
    ExternalImageId: params.externalImageId,
    Image: {
      S3Object: {
        Bucket: params.s3.bucket,
        Name: params.s3.key
      }
    }
  }
  return new Promise((resolve, reject) => {
    Rekognition.indexFaces(payload, function (err, data) {
      if (err) { reject(err) } else {
        resolve(data)
      }
    })
  })
}

/**
 * ...
 */
module.exports.searchFacesByImage = (imageBuf) => {
  const params = {
    CollectionId: config.aws.rekognitionFaceIndex,
    Image: {
      Bytes: imageBuf
    }
  }

  return new Promise((resolve, reject) => {
    Rekognition.searchFacesByImage(params, function (err, data) {
      if (err) { reject(err) } 
      else {
        const ids = data['FaceMatches'].map((match) => match['Face']['ExternalImageId'])
        resolve(ids)
      }
    })
  })
}