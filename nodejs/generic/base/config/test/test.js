const path = require('path');
const http = require('http');
var conf = require('../lib/config.js');

console.log('protocol=%s;nasip=%s,port=%s', conf.get('protocol'), conf.get('nasip'), conf.get('port')); // eslint-disable-line no-console
