/**
 *   This sample code demo receive value from QIoT Suite Lite by CoAP protocol
 *   requirement:
 *   -- npm install
 *   run command: node coap-observe.js
 */

var qiot = require('./lib/qiot');

/**
 * Setup connection options
 */
var connection = new qiot(qiot.protocol.COAP);
var connection_option = connection.readResource('./res/resourceinfo.json');

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** 
 * Receive data of QIoT Suite Lite.
 */
connection.on('message', function(data) {
    switch (data.id) {
        case "temp":
            console.log("------------------------")
            console.log("temp : " + data.message.value);
            console.log("------------------------")
            break;
        default:
            break;
    }
});

/**
 * Subscribe data coming from QIoT Suite Lite.
 */
// TODO:you could replace "temp" by any resource id set form QIoT Suite Lite
connection.subscribeById("temp");