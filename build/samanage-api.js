'use strict';

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _https = require('https');

var _https2 = _interopRequireDefault(_https);

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

var _config = require('./config.js');

var _config2 = _interopRequireDefault(_config);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var samanage = (0, _config2['default'])('SAMANAGE_OPTIONS'); // headers for samanage https requests

// this will be broken out into the intents file
var singleReturn = function singleReturn(number, returnType, recordType) {
  console.log('--> singleReturn called');
  var page = 1;
  var options = samanage;
  options.path = '/' + String(recordType) + '.json?=&per_page=100&page=' + page;
  return new _bluebird2['default'](function (resolve, reject) {
    var request = getSingleObject(options).then(function (result) {
      var filtered = _lodash2['default'].filter(result, function (o) {
        return o.number == number;
      });
      return resolve(filtered[0]);
    })['catch'](function (err) {
      return reject(err);
    });
  });
};

var getLatest = function getLatest(recordType) {
  var options = samanage;
  options.path = '/' + String(recordType) + '.json?=&per_page=1&page=1';
  return new _bluebird2['default'](function (resolve, reject) {
    return getSingleObject(options).then(function (result) {
      if (_lodash2['default'].isArray(result)) return resolve(result[0]);else return resolve(result);
    })['catch'](function (err) {
      return reject(err);
    });
  });
};

// this will remain as part of the http library
var getSingleObject = _bluebird2['default'].method(function (options) {
  console.log('--> getSingleObjectByNumber called for:\n' + String(_util2['default'].inspect(options)));
  return new _bluebird2['default'](function (resolve, reject) {
    var parsed = void 0;
    var req = _https2['default'].request(options, function (res) {
      res.setEncoding('utf8');
      console.log('--> got response: ' + String(_util2['default'].inspect(res.statusCode)));
      var body = '';

      res.on('data', function (chunk) {
        body += chunk;
      });

      res.on('end', function () {
        console.log('--> response end');
        parsed = JSON.parse(body);
        if (_lodash2['default'].isEmpty(parsed)) parsed = 'none';
        return resolve(parsed);
      });
    });

    req.on('error', function (e) {
      return reject(e);
    });

    req.end();
  });
});

module.exports = { singleReturn: singleReturn, getLatest: getLatest };