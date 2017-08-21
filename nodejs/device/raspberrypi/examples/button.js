/**
 * * This sample code demo botton value send to QIoT Suite Lite by MQTT protocol
 *   requirement:
 *   -- npm install 
 *   run command: node button.js
 */

var qiot = require('./lib/qiot');
var cp = require('child_process');

var gpioCommand = 'gpio read 7'; // button pin 7
var value = 0;
var pre_button_state = 0;

/**
 * Setup connection options
 */
var connection = new qiot(qiot.protocol.MQTT);
var connection_option = connection.readResource('./res/resourceinfo.json', './ssl/');
connection.connect(connection_option);

/**
 * Send sensor's data to QIoT Suite Lite.
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
    // detect button state every 1000 msec and publish when button state change
    setInterval(function() {
        cp.exec(gpioCommand, function(err, stdout, stderr) {
            value = parseInt(stdout);
        });
        console.log("senosr read:" + value);
        if (pre_button_state != value) {
            // TODO: you could replace "button" by any resource id set form QIoT Suite Lite
            connection.publishById("button", value);
            pre_button_state = value;
            // or publish by resource topic
            // TODO: you could replace "qiot/things/admin/rasberrypi/button" by any Topic form QIoT Suite Lite like following
            // connection.publishByTopic("qiot/things/admin/rasberrypi/button", getRandomInt(0, 50));
        }
    }, 1000);
});
connection.connect(connection_option);
