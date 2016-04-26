/*
 **Hardware Requirements**
 Raspberry Pi
 Grove Pi
 Temperature Sensor
 2 LEDs (RG)

 **Software Requirements**
 Node.js (ver 4.X+)

 **Node Libraries**
 node-grovepi
 mqtt
 */

var GrovePi = require('node-grovepi').GrovePi
var Commands = GrovePi.commands
var Board = GrovePi.board
var mqtt = require('mqtt')

// List of Sensor Libraries used from node-grovepi
var AccelerationI2cSensor = GrovePi.sensors.AccelerationI2C;
var UltrasonicDigitalSensor = GrovePi.sensors.UltrasonicDigital;
var AirQualityAnalogSensor = GrovePi.sensors.AirQualityAnalog;
var DHTDigitalSensor = GrovePi.sensors.DHTDigital;
var LightAnalogSensor = GrovePi.sensors.LightAnalog;
var ChainableRGBLedDigitalSensor = GrovePi.sensors.ChainableRGBLedDigitalSensor;
var IRReceiverSensor = GrovePi.sensors.IRReceiverSensor;
var FourDigitDigigtalSensor = GrovePi.sensors.FourDigitDigitalSensor;

// This example shows you how to define LED & temperature sensor mapping on Grove pi port
var TemperatureSensor = GrovePi.sensors.TemperatureAnalog;
var LedSense = GrovePi.sensors.LedBarDigital;

// Please declare below mqtt url and port as per your settings
var client = mqtt.connect('mqtt://[your_ip_or_dns]:[your_port]');
var publishTopic = '[your_topic]';
var SubscribeTopic = '[your_topic]';
//e.g. PI226 for publisher, PI226returns for subscriber , make sure those are defined in your QIoT container service(Node-RED)as well.
// var client = mqtt.connect('mqtt://192.168.0.124:32792');
// var publishTopic = 'PI226';
// var SubscribeTopic = 'PI226returns';


//red led on D2
var redLed = new LedSense(2);
//green led on D3
var greenLed = new LedSense(3)

// Temperature sensor on A0
var tempratureSensor = new TemperatureSensor(0);


board = new Board({
    debug: true,
    onError: function (err) {
        console.log('Something wrong just happened')
        console.log(err)
    },
    onInit: function (res) {
        if (res) {
            console.log('GrovePi Version :: ' + board.version())

            // Capture the data from Light Sensor
            tempratureSensor.on('change', function (res) {
                if (res != '') {
                    console.log({'The degree is ': res});

                    // Publish data to MQTT topic is "PI226"
                    client.publish(publishTopic, JSON.stringify({'Temp': res}));
                
				}
			});
            tempratureSensor.watch();

             client.on('connect', function () {
                 // Subscribe ponte to the topic
                 client.subscribe(SubscribeTopic);
             });
			
			 // Get MQTT data topic is "PI226returns"
             client.on('message', function (topic, message) {
				 // Define tempsersor data and LED display 
                 if (message.toString() == 'off') {
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
    console.log('Device stopped.')
    board.close()
    process.removeAllListeners()
    process.exit()
    if (typeof err != 'undefined')
        console.log(err)
});
