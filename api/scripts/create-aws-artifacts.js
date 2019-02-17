#!/usr/bin/env node
const path = require('path')

const AWS = require('aws-sdk')
const dotenv = require('dotenv')
dotenv.config({ path: path.resolve('./', '.env') })

const config = require('../app/config')
const logger = require('../app/utils/logger')

const createS3Buckets = () => {
  const S3 = new AWS.S3(config.aws.config)
  S3.createBucket({ Bucket: config.aws.s3Bucket }, function (err, data) {
    if (err) {
      logger.error(err.message)
    } else {
      logger.info(data)
    }
  })
}

const createRekognitionIndex = () => {
  const Rekognition = new AWS.Rekognition(config.aws.config)
  Rekognition.createCollection({ CollectionId: config.aws.rekognitionFaceIndex }, function (err, data) {
    // Only log if the error was anything other than the index being already in existence.
    if (err && !err.message.includes('already exists')) {
      logger.error(err.message)
    } else {
      logger.info(data)
    }
  })
}

createS3Buckets()
createRekognitionIndex()