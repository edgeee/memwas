require('dotenv').config()

const db = require('./app/database')
const logger = require('./app/utils/logger')
const server = require('./app/server')

const run = () => {
  logger.info('Connecting to database..')
  db.connect().then(() => {
    logger.info('Database connection successful.')
    server.start()
  })
}

run()
