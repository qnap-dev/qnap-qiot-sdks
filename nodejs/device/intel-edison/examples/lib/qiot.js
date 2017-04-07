/**
 * Copyright (c) QNAP Systems, Inc. All rights reserved.
*/

var mqttProtocol = require('./mqtt-connect');
var httpProtocol = require('./http-connect');
var httpsProtocol = require('./https-connect');
var coapProtocol = require('./coap-connect');

const PROTOCOL_TYPE = {
    MQTT: "MQTT",
    HTTP: "HTTP",
    HTTPS: "HTTPS",
    COAP: "COAP"
}

/**
 * define connect protocol
 * @param {(PROTOCOL_TYPE)} type  type of protocol
 */
var createConnection = function(type) {
    var connection;
    switch (type) {
        case PROTOCOL_TYPE.MQTT:
            connection = new mqttProtocol();
            break;
        case PROTOCOL_TYPE.HTTP:
            connection = new httpProtocol();
            break;
        case PROTOCOL_TYPE.HTTPS:
            connection = new httpsProtocol();
            break;
        case PROTOCOL_TYPE.COAP:
            connection = new coapProtocol();
            break;
        default:
            console.log("Not Support protocol");
            break;
    }
    return connection;
}

module.exports = createConnection;
module.exports.protocol = PROTOCOL_TYPE;