const path = require('path');
const http = require('http');
const convict = require('convict');
var conf;
var defaultconf = convict({
  env: {
    doc: "The applicaton environment.",
    format: ["production", "development", "test"],
    default: "development",
    env: "NODE_ENV"
  }
}).loadFile(path.join(__dirname, 'default.json')).validate();

var env = defaultconf.get('env');
if (env != ''){
conf = convict({
  protocol: {
    doc: 'The protocol to bind.',
    format: ["mqtt", "http", "coap"],
    default: 'mqtt'
  },
  ip: {
    doc: 'The IP Address to bind.',
    format: 'ipaddress',
    default: '127.0.0.1',
    env: 'IP_ADDRESS'
  },
  port: {
    doc: 'The port to bind.',
    format: 'int',
    default: 0,
    env: 'PORT'
  }
}).loadFile(path.join(__dirname, env + '.json')).validate();
}
else{
  console.log('Please give an env value in default.json');
}

module.exports = conf;
