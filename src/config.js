import dotenv from 'dotenv'
const ENV = process.env.NODE_ENV || 'development'

if (ENV == 'development') dotenv.load()

const config = {
  ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  PROXY_URI: process.env.PROXY_URI,
  SAMANAGE_OPTIONS: {
    host: 'api.samanage.com',
    path: '',
    method: 'GET',
    headers: { 'accept' : 'application/vnd.samanage.v1.3+json', 'Content-Type' : 'application/json' },
    auth: process.env.SAMANAGE_UN + ':' + process.env.SAMANAGE_PW
  }
}

export default (key) => {
  if (!key) return config
  return config[key]
}
