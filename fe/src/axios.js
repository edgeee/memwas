import axios from 'axios'

const PRODUCTION_BASE_URL = 'http://api.memwas.com'
const DEV_BASE_URL = 'http://127.0.0.1:8000'

export default axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? PRODUCTION_BASE_URL : DEV_BASE_URL
})
