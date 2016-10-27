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
var fs = require('fs');

//declare the path which cert infos locate.
var KEY = fs.readFileSync('3424412016-07-11_07-23-21_privatekey.pem');
var CERT = fs.readFileSync('3424412016-07-11_07-23-21_certificate.pem');
var TRUSTED_CA_LIST = fs.readFileSync('ca-crt.pem');


//declare mqtt broker host & port infos
var PORT = 4883;
var HOST = '172.17.28.137';

//for mqtt options, define mqtts options here
var mqttoptions = {
  cmd: 'connect'
  , clean: true // or false
  , clientId: 'my-device'
  , keepalive: 0 ,// seconds, 0 is the default, can be any positive number
  protocolId: 'MQIsdp',
  protocolVersion: 3,
  protocol: 'mqtts',
  port: PORT,
  host: HOST,
  keyPath: KEY,
  certPath: CERT,
  rejectUnauthorized : false, 
  //The CA list will be used to determine if server is authorized
  ca: TRUSTED_CA_LIST
};

// List of Sensor Libraries used from node-grovepi
var TemperatureSensor = GrovePi.sensors.TemperatureAnalog;

// Please declare below mqtt url and port as per your settings
var client = mqtt.connect(options);
var publishTopic = 'PI226';
var SubscribeTopic = 'PI226returns';

// Define LED mapping on Grove pi port
var LedSense = GrovePi.sensors.LedBarDigital;
var redLed = new LedSense(2);
var greenLed = new LedSense(3)

// Initialize Pins and LEDs
var tempratureSensor = new TemperatureSensor(0);


// dashboard Initialization

var blessed = require('blessed')
    , contrib = require('blessed-contrib')

var screen = blessed.screen()

var grid = new contrib.grid({rows: 12, cols: 12, screen: screen})


//pub-sub-error log panel setup
var publog = grid.set(2, 0, 10, 4, contrib.log,
    { fg: "green"
        , selectedFg: "green"
        , label: 'Publish Message'})

var sublog = grid.set(2, 4, 10, 4, contrib.log,
    { fg: "green"
        , selectedFg: "green"
        , label: 'Subscribe Message'
        , tags: true})

var errorlog = grid.set(2, 8, 10, 4, contrib.log,
    { fg: "red"
        , selectedFg: "red"
        , label: 'Error Message'})

//set publog data
function showpublog(msg) {
    publog.log('The degree is ' + msg)
    screen.render()
}

//set sublog data
function showsublog(msg) {
    sublog.log(msg)
    screen.render()
}

//set errorlog data
function showerrorlog(msg) {
    errorlog.log(msg)
    screen.render()
}

// qnap logo setup at
var pic = grid.set(0, 0, 2, 4, contrib.picture,
    { file: './qnap_logo.png'
        , cols: 70
        , onReady: ready})

function ready() {screen.render()}


//Button
var buttonform = blessed.form({
    parent: screen,
    keys: true,
    left: '87%',
    top: '5%',
    width: 30,
    height: 4,
    bg: 'green',
    content: '{black-fg}{bold}Enable your sensor{/bold}{/black-fg}',
    tags:true
});

var submit = blessed.button({
    parent: buttonform,
    mouse: true,
    keys: true,
    shrink: true,
    padding: {
        left: 1,
        right: 1
    },
    left: 10,
    top: 2,
    shrink: true,
    name: 'start',
    content: 'Start',
    style: {
        bg: 'blue',
        focus: {
            bg: 'red'
        },
        hover: {
            bg: 'red'
        }
    }
});

var cancel = blessed.button({
    parent: buttonform,
    mouse: true,
    keys: true,
    shrink: true,
    padding: {
        left: 1,
        right: 1
    },
    left: 20,
    top: 2,
    shrink: true,
    name: 'cancel',
    content: 'Cancel',
    style: {
        bg: 'blue',
        focus: {
            bg: 'red'
        },
        hover: {
            bg: 'red'
        }
    }
});

submit.on('press', function() {
    buttonform.submit();
});

cancel.on('press', function() {
    buttonform.reset();
});

buttonform.on('submit', function(data) {
    buttonform.setContent('{black-fg}{bold}Started.{/bold}{/black-fg}');
    screen.render();
    //var client = mqtt.connect('mqtt://192.168.0.124:32792');
    //board.init();
});

buttonform.on('reset', function(data) {
    buttonform.setContent('{red-fg}{bold}Canceled.{/bold}{/red-fg}');
    screen.render();
    client.close();
    board.close();
});


//list
var list = blessed.list({
    parent: screen,
    align: 'center',
    mouse: true,
    keys: true,
    vi: true,
    width: '20%',
    height: 'shrink',
    //border: 'line',
    top: 0,
    //bottom: 2,
    left: '34%',
    style: {
        fg: 'blue',
        bg: 'white',
        selected: {
            bg: 'green'
        }
    },
    items: [
        'Raspberry',
        'Intel Edison',
        'Linkit 7688 DUO'
    ]
});
list.select(0);

list.on('select', function(item) {
    console.log(item.getText());
    //screen.destroy();
});

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
                    //showpublog on dash
                    showpublog(res);

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

                 switch (message.toString().trim().toLowerCase()){
                     case "off":
                         //showpublog on dash
                         showsublog('The temperature is normal and green led is turnning on.');

                         // Define tempsersor data and LED display
                         greenLed.write(1);
                         redLed.write(0);
                         break;
                     case "on":
                         //showpublog on dash
                         showsublog('{red-fg}The temperature is too high and red led is turnning on.{/red-fg}');

                         // Define tempsersor data and LED display
                         greenLed.write(0);
                         redLed.write(1);
                         break;
                     default:
                         showerrorlog('Unknown temperature status.');
                 }
             });
        }
    }
})

//initialize dashboard
list.focus();
screen.render();

//initialize board
board.init();

screen.key(['escape', 'q', 'C-c'], function(ch, key) {
    return process.exit(0);
});

//start
process.on('SIGINT', function () {
    console.log('ending')
    screen.destroy()
    board.close()
    process.removeAllListeners()
    process.exit()
    if (typeof err != 'undefined')
        console.log(err)
});
