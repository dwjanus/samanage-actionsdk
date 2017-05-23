import util from 'util'
import _ from 'lodash'
import Promise from 'bluebird'
import samanage from './samanage-api.js'
import config from './config.js'
import https from 'https'

const options = config('SAMANAGE_OPTIONS')
const ActionsSdkApp = require('actions-on-google').ActionsSdkApp

// consts for intent map
const GOOGLE_ASSISTANT_WELCOME = 'input.welcome'
const SINGLE_RETURN_NO_CONTEXT = 'singleReturn.noContext'
const GET_LATEST = 'getLatest'

const welcomeIntent = (assistant) => {
  console.log('** inside welcome case **')
  assistant.ask('What can I do for you? If you are not totally sure what to do, just say: I need help')
}


const singleReturnNCIntent = (assistant, cb) => {
  console.log('** inside single return [nc] case **')
  let type = assistant.getArgument('record-type')
  let recordType = type
  if (!_.endsWith(recordType, 's')) recordType += 's'
  const caseNumber = assistant.getArgument('caseNumber')
  const returnType = assistant.getArgument('return-type')
  return samanage.singleReturn(caseNumber, returnType, recordType).then((record) => {
    console.log(`--> record ${util.inspect(record.number)} retrieved`)
    let text = `I'm sorry, I was unable to retrieve any information on that ${recordType}`
    if (record !== 'none' || null || undefined) text = `The ${returnType} of ${type} ${caseNumber} is ${record[returnType]}`
    return cb(null, text)
  })
  .catch((err) => {
    return cb(err, null)
  })
}

// const getLatestIntent = (assistant, cb) => {
//   console.log('** inside get latest case **')
//   let recordType = assistant.getArgument('record-type')
//   if (!_.endsWith(recordType, 's')) recordType += 's'
//   return samanage.getLatest(recordType).then((record) => {
//     console.log(`--> record ${util.inspect(record)} retrieved`)
//     let text = `I'm sorry, I was unable to retrieve any information on that ${recordType}`
//     if (record !== 'none' || null || undefined) text = `The latest ${recordType} is ${record.number}, ${record.name}. Would you like more information on that?`
//     console.log(`text output: ${text}`)
//     return cb(null, text)
//   })
//   .catch((err) => {
//     return cb(err, null)
//   })
// }

export default ((request, response) => {
  console.log('** inside assistant function **')
  const assistant = new ActionsSdkApp({ request, response })

  let actionMap = new Map()
  actionMap.set(assistant.StandardIntents.MAIN, welcomeIntent)
  actionMap.set(assistant.StandardIntents.SINGLE_RETURN_NO_CONTEXT, singleReturnNCIntent)
  assistant.handleRequest(actionMap)

  // let action = actionMap.get(assistant.getIntent())
  // console.log(`action: ${util.inspect(action)}`)
  // let promisedAction = Promise.promisify(action)
  // promisedAction(assistant).then((result) => {
  //   console.log(`--> promisedAction\nResult:\n${util.inspect(result)}`)
  //   assistant.tell(result)
  // })
})
