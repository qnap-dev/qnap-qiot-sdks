/*
 
 This script is used to take light sensor data and publish it to the mqtt client and it raises
 an alarm when the value goes beyond certain threshold.
 
 **Hardware Requirements**
 Raspberry Pi
 Grove Pi
 LED Digital Sensor
 
 **Software Requirements**
 Node (ver 4.X+)
 
 **Node Libraries**
 node-grovepi
 mqtt
 
 
 **Assumptions**
 Please connect Light Ananlog sensor to Analog port A0 on Grove kit or set environment variable ANALOGINPUT_LIGHTSENSOR to desired pin number.
 Please connect Red Led to D7 on Grove Pi or set environment variable REDLED_PORT to desired pin number.
 Please connect Green Led to D8 on Grove Pi or set environment variable GREENLED_PORT to desired pin number.
 Please connect Blue Led to D4 on Grove Pi or set environment variable BLUELED_PORT to desired pin number.
 
 */

var GrovePi = require('node-grovepi').GrovePi;
var Commands = GrovePi.commands
var Board = GrovePi.board
var mqtt = require('mqtt');


// List of Sensor Libraries used from node-grovepi
var LightAnalogSensor = GrovePi.sensors.LightAnalog;
var LedSense = GrovePi.sensors.LedBarDigital;
//Please declare below mqtt url and port as per your settings
var client = mqtt.connect('mqtt://[your_ip_or_dns]:[your_port]');
var publishTopic = '[your_topic]';
var SubscribeTopic = '[your_topic]';

var inputPin = process.env.ANALOGINPUT_LIGHTSENSOR || 0;
var redLedPort = process.env.REDLED_PORT || 7;
var greenLedPort = process.env.GREENLED_PORT || 8;
var blueLedPort = process.env.BLUELED_PORT || 4;


//function start(){
board = new Board({
    debug: true,
    onError: function (err) {
        console.log('Something wrong just happened')
        console.log(err)
    },
    onInit: function (res) {
        if (res) {
            console.log('GrovePi Version :: ' + board.version())
            // Initialize Pins and LEDs 
            var lightSensor = new LightAnalogSensor(inputPin);
            var redLed = new LedSense(redLedPort);
            var greenLed = new LedSense(greenLedPort);
            var blueLed = new LedSense(blueLedPort);

            redLed.write(0);
            greenLed.write(0);
            blueLed.write(1);

            // Capture the data from Light Sensor
            lightSensor.on('change', function (res) {
                if (res != '') {
                    console.log({'light': res});
                    // Publish data to MQTT client to topic PI226
                    client.publish(publishTopic, JSON.stringify({'light': res}));
                }
            });

            lightSensor.watch();

            client.on('connect', function () {
                // Subscribe to the topic
                client.subscribe(SubscribeTopic);
            });

            client.on('message', function (topic, message) {
                // Raise alarm when you get response
                console.log('Received:' + message.toString());
                if (JSON.parse(message.toString()).alarm == 'off') {
                    greenLed.write(1);
                    redLed.write(0);
                } else {
                    greenLed.write(0);
                    redLed.write(1);
                }
            });
        }
    }
})
board.init();
process.on('SIGINT', function () {
    var greenLed = new LedSense(greenLedPort);
    var redLed = new LedSense(redLedPort);
    var blueLed = new LedSense(blueLedPort);
    console.log('ending')
    redLed.write(0);
    greenLed.write(0);
    blueLed.write(0);
    board.close()
    process.removeAllListeners()
    process.exit()
    if (typeof err != 'undefined')
        console.log(err)
});
