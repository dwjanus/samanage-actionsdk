'use strict';

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _samanageSdkHandler = require('./samanage-sdk-handler.js');

var _samanageSdkHandler2 = _interopRequireDefault(_samanageSdkHandler);

var _config = require('./config.js');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var app = (0, _express2['default'])();
var port = process.env.port || process.env.PORT || (0, _config2['default'])('PORT') || 8080;
if (!port) {
  console.log('Error: Port not specified in environment');
  process.exit(1);
}
app.set('port', port);
app.use(_bodyParser2['default'].urlencoded({ extended: true }));
app.use(_bodyParser2['default'].json());
app.use(_express2['default']['static'](_path2['default'].join(__dirname, '../public')));

app.get('/', function (request, response) {
  response.sendFile('index.html');
});

app.post('/actions', function (request, response) {
  console.log('** Webhook Received **');
  console.log('Request headers: ' + String(_util2['default'].inspect(request.headers)));
  console.log('Request body:\n' + String(_util2['default'].inspect(request.body)));
  console.log('\nMessages:\n' + String(_util2['default'].inspect(request.body.result.fulfillment.messages)));
  (0, _samanageSdkHandler2['default'])(request, response);
});

var server = app.listen(app.get('port'), function () {
  console.log('App listening on port %s', server.address().port);
  console.log('Press Ctrl+C to quit');
});