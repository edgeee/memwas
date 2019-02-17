const bodyParser = require('body-parser')
const corsMiddleware = require('restify-cors-middleware')
const morgan = require('morgan')
const restify = require('restify')
const validator = require('restify-joi-middleware')
const restifyErrors = require('restify-errors')
const logger = require('./utils/logger')
const config = require('./config')
const { registerRoutes } = require('./routes')

function start () {
  const server = restify.createServer({})

  server.use(restify.plugins.acceptParser(server.acceptable))
  server.use(morgan('dev'))
  server.use(bodyParser.urlencoded({ extended: true }))
  server.use(bodyParser.json())
  server.use(bodyParser.raw({ limit: '10 MB' }))
  server.use(restify.plugins.queryParser())
  server.use(restify.plugins.fullResponse())
  const cors = corsMiddleware({
    origins: ['*'],
    allowHeaders: ['Authorization']
  })
  server.pre(cors.preflight)
  server.use(cors.actual)

  // input validation using joi
  server.use(validator({
    joiOptions: {
      convert: true,
      allowUnknown: true,
      abortEarly: true
    },
    errorTransformer: (validationInput, joiError) => {
      const msgs = []
      joiError.details.forEach((e) => {
        let msg = `${e.message}`
        msg = msg.replace(/"/ig, "'")
        msgs.push(msg)
      })
      return new restifyErrors.BadRequestError(msgs.join('; '))
    },
    keysToValidate: ['params', 'body', 'query'],

    // change how errors are returned
    errorResponder: (transformedErr, req, res, next) => {
      res.send(400, transformedErr)
      return next()
    }
  }))

  server.listen(config.port, () => {
    registerRoutes(server)
    logger.info(`[gateway] Node version: ${process.version}`)
    logger.info(`[gateway] Starting ${process.env.NODE_ENV} server at ` +
             `${config.host}:${config.port}`)
    logger.info('[gateway] Quit server with CTRL-C')
  })
}

module.exports.start = start
