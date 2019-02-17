const mongoose = require('mongoose')

const albumSchema = mongoose.Schema({
  name: String,
  slug: String
})

module.exports = {
  Album: mongoose.model('Album', albumSchema)
}
