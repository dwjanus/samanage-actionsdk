'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _map = require('babel-runtime/core-js/map');

var _map2 = _interopRequireDefault(_map);

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _samanageApi = require('./samanage-api.js');

var _samanageApi2 = _interopRequireDefault(_samanageApi);

var _config = require('./config.js');

var _config2 = _interopRequireDefault(_config);

var _https = require('https');

var _https2 = _interopRequireDefault(_https);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var options = (0, _config2['default'])('SAMANAGE_OPTIONS');
var ActionsSdkApp = require('actions-on-google').ActionsSdkApp;

// consts for intent map
var GOOGLE_ASSISTANT_WELCOME = 'input.welcome';
var SINGLE_RETURN_NO_CONTEXT = 'singleReturn.noContext';
var GET_LATEST = 'getLatest';

var welcomeIntent = function welcomeIntent(assistant) {
  console.log('** inside welcome case **');
  assistant.ask('What can I do for you? If you are not totally sure what to do, just say: I need help');
};

var singleReturnNCIntent = function singleReturnNCIntent(assistant, cb) {
  console.log('** inside single return [nc] case **');
  var type = assistant.getArgument('record-type');
  var recordType = type;
  if (!_lodash2['default'].endsWith(recordType, 's')) recordType += 's';
  var caseNumber = assistant.getArgument('caseNumber');
  var returnType = assistant.getArgument('return-type');
  return _samanageApi2['default'].singleReturn(caseNumber, returnType, recordType).then(function (record) {
    console.log('--> record ' + String(_util2['default'].inspect(record.number)) + ' retrieved');
    var text = 'I\'m sorry, I was unable to retrieve any information on that ' + String(recordType);
    if (record !== 'none' || null || undefined) text = 'The ' + String(returnType) + ' of ' + String(type) + ' ' + String(caseNumber) + ' is ' + String(record[returnType]);
    return cb(null, text);
  })['catch'](function (err) {
    return cb(err, null);
  });
};

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

exports['default'] = function (request, response) {
  console.log('** inside assistant function **');
  var assistant = new ActionsSdkApp({ request: request, response: response });

  var actionMap = new _map2['default']();
  actionMap.set(assistant.StandardIntents.MAIN, welcomeIntent);
  actionMap.set(assistant.StandardIntents.SINGLE_RETURN_NO_CONTEXT, singleReturnNCIntent);
  assistant.handleRequest(actionMap);

  // let action = actionMap.get(assistant.getIntent())
  // console.log(`action: ${util.inspect(action)}`)
  // let promisedAction = Promise.promisify(action)
  // promisedAction(assistant).then((result) => {
  //   console.log(`--> promisedAction\nResult:\n${util.inspect(result)}`)
  //   assistant.tell(result)
  // })
};