const config = Object.create(null)

config.port = process.env.SERVER_PORT || 3000
config.host = process.env.SERVER_HOST || 'http://127.0.0.1'
config.database_url = process.env.DATABASE_URL
config.thumbnail = {
  width: 256,
  height: 256
}

config.aws = {
  config: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
  },
  s3Bucket: process.env.AWS_S3_BUCKET,
  rekognitionFaceIndex: process.env.AWS_REKOGNITON_FACE_INDEX
}

module.exports = config
