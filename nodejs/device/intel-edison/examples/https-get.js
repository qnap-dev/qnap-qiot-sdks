/**
 *   This sample code demo receive value from QIoT Suite Lite by HTTP protocol
 *   requirement:
 *   -- npm install
 *   run command: node https-get.js
 */

var qiot = require('./lib/qiot');

/**
 * Setup connection options
 */
var connection = new qiot(qiot.protocol.HTTPS);
var connection_option = connection.readResource('./res/resourceinfo.json');

/**
 * Receive data of QIoT Suite Lite.
 */
connection.on('message', function(data) {
    switch (data.id) {
        case "temp":
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