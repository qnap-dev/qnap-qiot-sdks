/**
 *   This sample code demo random number value send to QIoT Suite Lite by MQTT protocol
 *   requirement:
 *   -- npm install 
 *   run command: node mqtt.js
 */

var qiot = require('./lib/qiot');

/**
 * Setup connection options
 */
var connection = new qiot(qiot.protocol.MQTT);
var connection_option = connection.readResource('./res/resourceinfo.json', './ssl/');

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Send data to QIoT Suite Lite.
 * content of ./res/resourceinfo.json
 * {
 *     ...
 *     "resources": [
 *         {
 *              ...
 *              "resourceid": "temp",
 *              "topic": "qiot/things/admin/abccccc/temp",
 *              ...
 *          }
 *      ]
 *  }
 */
connection.on('connect', function(data) {
    setInterval(function() { 

        // TODO: you could replace "temp" by any resource id set form QIoT Suite Lite
        connection.publishById("temp", getRandomInt(0, 50));

        // or publish by resource topic
        // TODO: you could replace "qiot/things/admin/edison/temp" by any Topic form QIoT Suite Lite like following
        // connection.publishByTopic("qiot/things/admin/edison/temp", getRandomInt(0, 50));
    }, 1000);
});

connection.connect(connection_option);