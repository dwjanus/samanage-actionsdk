import util from 'util'
import _ from 'lodash'
// import Promise from 'bluebird'
import samanage from './samanage-api.js'

const ActionsSdkApp = require('actions-on-google').ActionsSdkApp

// const getLatestIntent = (assistant, cb) => {
//   console.log('** inside get latest case **')
//   let recordType = assistant.getArgument('record-type')
//   if (!_.endsWith(recordType, 's')) recordType += 's'
//   return samanage.getLatest(recordType).then((record) => {
//     console.log(`--> record ${util.inspect(record)} retrieved`)
//     let text = `I'm sorry, I was unable to retrieve any information on that ${recordType}`
//     if (record !== 'none' || null || undefined) text = `The latest ${recordType} is ${record.number}, ${record.name}.
//       Would you like more information on that?`
//     console.log(`text output: ${text}`)
//     return cb(null, text)
//   })
//   .catch((err) => {
//     return cb(err, null)
//   })
// }

export default ((request, response) => {
  console.log('** inside assistant function **')
  const app = new ActionsSdkApp({ request, response })

  const welcomeIntent = (app) => {
    const inputPrompt = app.buildInputPrompt(false, 'Whats good fam! I heard ya loud n clear!')
    app.ask(inputPrompt)
  }

  const singleReturnNCIntent = (app) => {
    const inputPrompt = app.buildInputPrompt(false, 'Eyyy I heard your request for that too')
    app.ask(inputPrompt)
  }

  const actionMap = new Map()
  actionMap.set(app.StandardIntents.MAIN, welcomeIntent)
  actionMap.set('com.actions.SINGLE_RETURN_NO_CONTEXT', singleReturnNCIntent)
  app.handleRequest(actionMap)

  // let action = actionMap.get(assistant.getIntent())
  // console.log(`action: ${util.inspect(action)}`)
  // let promisedAction = Promise.promisify(action)
  // promisedAction(assistant).then((result) => {
  //   console.log(`--> promisedAction\nResult:\n${util.inspect(result)}`)
  //   assistant.tell(result)
  // })
})
