/**
 *   This sample code demo receive value from QIoT Suite Lite by MQTT protocol
 *   requirement:
 *   -- npm install
 *   run command: node mqtt-subscribe.js
 */

var qiot = require('./lib/qiot');

/**
 * Setup connection options
 */
var connection = new qiot(qiot.protocol.MQTT);
var connection_option = connection.readResource('./res/resourceinfo.json', './ssl/');
connection.connect(connection_option);
// subscribe when client ready
connection.on('connect', function(data) {
    // TODO: you could replace "temp" by any resource id set form QIoT Suite Lite
    connection.subscribeById("temp");
});

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