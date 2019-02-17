const mongoose = require('mongoose')

const photoSchema = mongoose.Schema({
  thumbnail_url: String,
  photo_url: String,
  album: { type: mongoose.Schema.Types.ObjectId, ref: 'Album' },
  photo_dimensions: {
    w: Number,
    h: Number
  },
  external_image_id: String
})

module.exports = {
  Photo: mongoose.model('Photo', photoSchema)
}
