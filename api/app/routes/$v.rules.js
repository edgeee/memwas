const Joi = require('joi')

const MAX_ITEM_SIZE_PER_REQUEST = 25

module.exports = {
  createAlbum: {
    schema: Joi.object().keys({
      body: Joi.object().keys({
        name: Joi.string().required()
      }).required()
    })
  },

  listAlbums: {
    schema: Joi.object().keys({
      query: Joi.object().keys({
        offset: Joi.number().min(0).optional().default(0),
        limit: Joi.number().optional().default(MAX_ITEM_SIZE_PER_REQUEST)
      }).required()
    })
  },

  listPhotos: {
    schema: Joi.object().keys({
      query: Joi.object().keys({
        offset: Joi.number().min(0).optional().default(0),
        limit: Joi.number().optional().default(MAX_ITEM_SIZE_PER_REQUEST),
        album_id: Joi.string().required()
      }).required()
    })
  },

  indexPhoto: {
    schema: Joi.object().keys({
      query: Joi.object().keys({
        album_id: Joi.string().required()
      }).required()
    })
  }
}
