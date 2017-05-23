import util from 'util'
import express from 'express'
import bodyParser from 'body-parser'
import path from 'path'
import samanageAssistant from './samanage-sdk-handler.js'
import config from './config.js'

const app = express()
const port = process.env.port || process.env.PORT || config('PORT') || 8080
if (!port) {
  console.log('Error: Port not specified in environment')
  process.exit(1)
}
app.set('port', port)
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, '../public')))

app.get('/', (request, response) => {
  response.sendFile('index.html')
})

app.post('/actions', (request, response) => {
  console.log('** Webhook Received **')
  console.log(`Request headers: ${util.inspect(request.headers)}`)
  console.log(`Request body:\n${util.inspect(request.body)}`)
  console.log(`\nMessages:\n${util.inspect(request.body.result.fulfillment.messages)}`)
  samanageAssistant(request, response)
})

const server = app.listen(app.get('port'), () => {
  console.log('App listening on port %s', server.address().port)
  console.log('Press Ctrl+C to quit')
})

exports.samanage = (req, res) => {
  samanageAssistant(req, res)
}
