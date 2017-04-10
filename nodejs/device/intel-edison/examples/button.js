/**
 *   This sample code demo button state send to QIoT Suite Lite by MQTT protocol
 *   requirement:
 *   -- npm install 
 *   run command: node button.js
 */

var qiot = require('./lib/qiot');
var m = require('mraa');
var pre_button_state;

/**
 * Setup Gpio
 * set pin2 is INPUT pin 
 */
var button_pin = 2;
var button_sensor = new m.Gpio(button_pin); //setup digital read on pin 2
button_sensor.dir(m.DIR_IN); //set the gpio direction to ignput

/**
 * Setup connection options
 */
var connection = new qiot(qiot.protocol.MQTT);
var connection_option = connection.readResource('./res/resourceinfo.json', './ssl/');

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
        console.log("senosr read:" + button_sensor.read());
        if (pre_button_state != button_sensor.read()) {
            // TODO: you could replace "button" by any resource id set form QIoT Suite Lite
            connection.publishById("button", button_sensor.read());
            pre_button_state = button_sensor.read();
            // or publish by resource topic
            // TODO: you could replace "qiot/things/admin/edison/button" by any Topic form QIoT Suite Lite like following
            // connection.publishByTopic("qiot/things/admin/edison/button", getRandomInt(0, 50));
        }
    }, 1000);
});
connection.connect(connection_option);