const { Album } = require('./models')
const { list, getAlbumThumbnail } = require('../photos')

/**
 * Creates a new album.
 * @param {Object} info
 * @param {string} info.name - Name of the album.
 */
module.exports.create = (info) => {
  const newAlbum = new Album(info)
  return newAlbum.save()
}

/**
 * Retrieves a section of the albums currently present.
 * @param {Object} config
 * @param {number} config.limit - The maxsize of items to retrieve.
 * @param {number} config.offset - The offset into the collectio to start
 *  retrieval from.
 */
module.exports.list = async (config) => {
  const res = await Album.findAndCount({}, {
    offset: config.offset,
    limit: config.limit
  })

  // TODO: make this more efficient. It currently fetches each album thumbnail
  // independently. This would be inefficient when we are to return lots of albums
  // at once. A fix would be to retrieve all the thumbnails in one network round-trip.
  res.items = res.items.map(item => item.toJSON())
  res.items = await Promise.all(res.items.map(async (item) => {
    item.thumbnail_url = await getAlbumThumbnail(item.id)
    return item
  }))
  return res
}
