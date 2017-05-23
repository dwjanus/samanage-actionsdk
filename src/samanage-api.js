import _ from 'lodash'
import https from 'https'
import util from 'util'
import config from './config.js'
import Promise from 'bluebird'

const samanage = config('SAMANAGE_OPTIONS') // headers for samanage https requests

// this will be broken out into the intents file
const singleReturn = (number, returnType, recordType) => {
  console.log('--> singleReturn called')
  let page = 1
  let options = samanage
  options.path = `/${recordType}.json?=&per_page=100&page=${page}`
  return new Promise((resolve, reject) => {
    const request = getSingleObject(options).then((result) => {
      const filtered = _.filter(result, (o) => { return o.number == number })
      return resolve(filtered[0])
    })
    .catch((err) => {
      return reject(err)
    })
  })
}

const getLatest = (recordType) => {
  let options = samanage
  options.path = `/${recordType}.json?=&per_page=1&page=1`
  return new Promise((resolve, reject) => {
    return getSingleObject(options).then((result) => {
      if (_.isArray(result)) return resolve(result[0])
      else return resolve(result)
    })
    .catch((err) => {
      return reject(err)
    })
  })
}

// this will remain as part of the http library
const getSingleObject = Promise.method((options) => {
  console.log(`--> getSingleObjectByNumber called for:\n${util.inspect(options)}`)
  return new Promise((resolve, reject) => {
    let parsed
    const req = https.request(options, (res) => {
      res.setEncoding('utf8')
      console.log(`--> got response: ${util.inspect(res.statusCode)}`)
      let body = ''

      res.on('data', (chunk) => {
        body += chunk
      })

      res.on('end', () => {
        console.log('--> response end')
        parsed = JSON.parse(body)
        if (_.isEmpty(parsed)) parsed = 'none'
        return resolve(parsed)
      })
    })

    req.on('error', (e) => {
      return reject(e)
    })

    req.end()
  })
})

module.exports = { singleReturn, getLatest }
