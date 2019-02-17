// Borrowed from here: https://github.com/edwardhotchkiss/mongoose-findAndCount

/**
 * @param {Object} [query={}]
 * @param {Object} [options={}]
 * @param {Object|String} [options.select]
 * @param {Object|String} [options.sort]
 * @param {Array|Object|String} [options.populate]
 * @param {Boolean} [options.lean=false]
 * @param {Number} [options.offset=0] - Use offset to set skip position
 * @param {Number} [options.limit=10]
 * @param {Function} [callback]
 * @returns {Promise}
 */

function findAndCount (query, options, callback) {
  query = query || {}
  options = Object.assign({}, findAndCount.options, options)
  let select = options.select
  let sort = options.sort
  let populate = options.populate
  let lean = options.lean || false
  let limit = options.limit ? options.limit : 10
  let offset, skip, promises
  if (options.offset) {
    offset = options.offset
    skip = offset
  }
  if (limit) {
    let docsQuery = this.find(query)
      .select(select)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(lean)
    if (populate) {
      [].concat(populate).forEach((item) => {
        docsQuery.populate(item)
      })
    }
    promises = {
      docs: docsQuery.exec(),
      count: this.countDocuments(query).exec()
    }
  }
  promises = Object.keys(promises).map((x) => promises[x])
  return Promise.all(promises).then(([docs, count]) => {
    let result = {
      items: docs,
      total: count,
      limit: limit
    }
    if (offset !== undefined) {
      result.offset = offset
    }
    if (typeof callback === 'function') {
      return callback(null, result)
    }
    return Promise.resolve(result)
  })
}

/**
 * @param {Schema} schema
 */
module.exports.findAndCount = function (schema) {
  schema.statics.findAndCount = findAndCount
}

/**
 * @param {Object} schema
 * @param {Object} options
 */
module.exports.setOptions = function (schema) {
  const options = {
    timestamps: true,
    minimize: false,
    strict: true,
    strictQuery: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret.__v
        delete ret._id
      }
    }
  }

  for (let opt in options) {
    if (options.hasOwnProperty(opt)) {
      schema.set(opt, options[opt])
    }
  }
}
