const mongoose = require('mongoose')
const config = require('../config')
const plugins = require('./plugins')

mongoose.plugin(plugins.findAndCount)
mongoose.plugin(plugins.setOptions)

module.exports.connect = function connect () {
  const options = {
    useNewUrlParser: true
  }
  return mongoose.connect(config.database_url, options)
}
