var GrovePi = require('node-grovepi').GrovePi
var Commands = GrovePi.commands
var Board = GrovePi.board
var mqtt    = require('mqtt')



var AccelerationI2cSensor = GrovePi.sensors.AccelerationI2C;
var UltrasonicDigitalSensor = GrovePi.sensors.UltrasonicDigital;
var AirQualityAnalogSensor = GrovePi.sensors.AirQualityAnalog;
var DHTDigitalSensor = GrovePi.sensors.DHTDigital;
var LightAnalogSensor = GrovePi.sensors.LightAnalog;
var TemperatureSensor = GrovePi.sensors.TemperatureAnalog;
var LedSense = GrovePi.sensors.LedBarDigital;
var client  = mqtt.connect('mqtt://172.17.29.186:1234');


function start(){
    console.log('starting')
    board = new Board({
    debug: true,
    onError: function(err) {
      console.log('Something wrong just happened')
      console.log(err)
    },
    onInit: function(res) {
	if (res) {
        console.log('GrovePi Version :: ' + board.version())

	  var digitalSensor = new DHTDigitalSensor(2,'','c');
	  digitalSensor.on('change', function(res) {
	      if (res!=''){

		  console.log('Sent:'+JSON.stringify({'temperature':res[0],'humidity':res[1],'heatindex':res[2]}));
		  client.publish('PI226', JSON.stringify({'temperature':res[0],'humidity':res[1],'heatindex':res[2]}));

	      }
              
          })
	  digitalSensor.watch();

	    var redLed = new LedSense(7);
	    var greenLed = new LedSense(8);
	    var blueLed = new LedSense(4);

	    redLed.write(0);
	    greenLed.write(0);
	    blueLed.write(1);
	    
	  client.on('connect', function () {
	      client.subscribe('PI226returns');
	  });

	  client.on('message', function (topic, message) {

	      console.log('Received:' + message.toString());

	      if(JSON.parse(message.toString()).alarm=='off'){
		 
		  greenLed.write(1);
		  redLed.write(0);
	      }
	      else{
		 
		  greenLed.write(0);
		  redLed.write(1);
		  
	      }
	  });
      }

	
    }
    })
    


    board.init();
}


function onExit(err) {

    
    var redLed = new LedSense(7);
    var greenLed = new LedSense(8);
    var blueLed = new LedSense(4);

    console.log('ending')
    redLed.write(0);
    greenLed.write(0);
    blueLed.write(0);
    board.close()
    process.removeAllListeners()
    process.exit()
    if (typeof err != 'undefined')
	console.log(err)
}

start()
// catches ctrl+c event
process.on('SIGINT', onExit)
