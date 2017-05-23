'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var ENV = process.env.NODE_ENV || 'development';

if (ENV == 'development') _dotenv2['default'].load();

var config = {
  ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  PROXY_URI: process.env.PROXY_URI,
  SAMANAGE_OPTIONS: {
    host: 'api.samanage.com',
    path: '',
    method: 'GET',
    headers: { 'accept': 'application/vnd.samanage.v1.3+json', 'Content-Type': 'application/json' },
    auth: process.env.SAMANAGE_UN + ':' + process.env.SAMANAGE_PW
  }
};

exports['default'] = function (key) {
  if (!key) return config;
  return config[key];
};