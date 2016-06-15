var GrovePi = require('node-grovepi').GrovePi
var Commands = GrovePi.commands
var Board = GrovePi.board


var AccelerationI2cSensor = GrovePi.sensors.AccelerationI2C;
var UltrasonicDigitalSensor = GrovePi.sensors.UltrasonicDigital;
var AirQualityAnalogSensor = GrovePi.sensors.AirQualityAnalog;
var DHTDigitalSensor = GrovePi.sensors.DHTDigital;
var LightAnalogSensor = GrovePi.sensors.LightAnalog;
var TemperatureSensor = GrovePi.sensors.TemperatureAnalog;
var LedSense = GrovePi.sensors.LedBarDigital;


function start(){
    board = new Board({
    debug: true,
    onError: function(err) {
      console.log('Something wrong just happened.')
      console.log(err)
    },
    onInit: function(res) {
	if (res) {
        console.log('GrovePi Version :: ' + board.version())

	  var digitalSensor = new DHTDigitalSensor(2,'','c');
	  digitalSensor.on('change', function(res) {
	      if (res!=''){

		  console.log('Sent:'+JSON.stringify({'temperature':res[0],'humidity':res[1],'heatindex':res[2]}));
	      }
              
          })
	  digitalSensor.watch();
      }
    }})
	
    board.init();
}


function onExit(err) {

    console.log('ending')
    board.close();
    process.removeAllListeners()
    process.exit();
    if (typeof err != 'undefined')
	console.log(err)
}

start()
// catches ctrl+c event
process.on('SIGINT', onExit)
