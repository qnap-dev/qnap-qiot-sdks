/**
 * Copyright (c) QNAP Systems, Inc. All rights reserved.
*/

var mqtt = require('mqtt');
var fs = require('fs');
var util = require('util');
var EventEmitter = require('events').EventEmitter;

var mqttConnect = function mqttConnect() {
    this.mqttclient = null;
    this.mqttoptions = null;
    this.resourceinfo = null;

    this.readResource = readResource;
    this.connect = connect;
    this.publishById = publishById;
    this.publishByTopic = publishByTopic;
    this.subscribeById = subscribeById;
    this.getTopicById = getTopicById;

    EventEmitter.call(this);
}
util.inherits(mqttConnect, EventEmitter);

/**
 * input jsonfile generated from QIoT Suite Lite and return connection option 
 * @param {(JSON)} jsonfile -generated from QIoT Suite Lite 
 * @param {(String)} sslPatch -certificate folder
 * @returns {(Object)} -mqtt connection option
 */
var readResource = function readResource(jsonfile, sslPatch) {
    var mqttoptions = {
        clean: true,
        protocol: 'mqtt',
        rejectUnauthorized: true,
        checkServerIdentity: function(host, cert) {
            return undefined;
        }
    };

    // read resourceinfo json file
    var data = fs.readFileSync(jsonfile, 'utf8');
    data = JSON.parse(data);
    this.resourceinfo = data;
    mqttoptions.clientId = data.clientId;
    mqttoptions.port = data.port;
    mqttoptions.host = data.host[0];
    mqttoptions.username = data.username;
    mqttoptions.password = data.password;

    // mqtts
    if (data.privateCert) {
        var key;
        var cert;
        var trusted_ca_list;
        var key_o = data.privateCert;
        var arr_KEY = key_o.split("/");
        if (typeof arr_KEY !== "undefined") {
            if (arr_KEY.length > 0) {
                var index = arr_KEY.length;
                key = fs.readFileSync(sslPatch + arr_KEY[index - 1].toString().trim());
                console.log("privatekey full path = " + arr_KEY[index - 1].toString().trim());
            }
        }
        var ca_o = data.caCert;
        var arr_CA = ca_o.split("/");
        if (typeof arr_CA !== "undefined") {
            if (arr_CA.length > 0) {
                var index = arr_CA.length;
                trusted_ca_list = fs.readFileSync(sslPatch + arr_CA[index - 1].toString().trim());
            }
        }
        var cert_o = data.clientCert;
        var arr_CERT = cert_o.split("/");
        if (typeof arr_CERT !== "undefined") {
            if (arr_CERT.length > 0) {
                var index = arr_CERT.length;
                cert = fs.readFileSync(sslPatch + arr_CERT[index - 1].toString().trim());
            }
        }
        mqttoptions.key = key;
        mqttoptions.cert = cert;
        mqttoptions.ca = trusted_ca_list;
        mqttoptions.protocol = 'mqtts';
    }
    this.mqttoptions = mqttoptions;
    return mqttoptions;
}

/**
 * connect to MQTT protocol
 * @param {(Object)} option -connection option  
 */
var connect = function connect(option) {
    console.log("ready to conneciton:");
    var self = this;
    this.mqttclient = mqtt.connect(option);
    this.mqttclient.on('connect', function() {
        self.emit('connect');
    });
    this.mqttclient.on('error', function(err) {
        console.log("=========================================");
        console.log("something wrong with mqtt service, err reason: " + err);
        console.log("=========================================");
        self.mqttclient = null;
    });
    this.mqttclient.on('message', function(topic, message) {
        var id = null;
        for (var i = 0; i < self.resourceinfo.resources.length; i++) {
            var sensor = self.resourceinfo.resources[i];
            if (topic == sensor["topic"]) {
                id = sensor["resourceid"];
                break;
            }
        }
        var data = {
            'topic': topic,
            'id': id,
            'message': JSON.parse(message.toString())
        };
        self.emit("message", data);
    });
}


/**
 * publish message to QIoT Suite Lite application by resource id.
 * @param {(String)} resource_id -input resource id
 * @param {(String)} value -input message will publish
 */
var publishById = function publishById(resource_id, value) {
    if (this.mqttclient == null) {
        console.log("please connect mqtt server");
        return;
    }
    if (this.resourceinfo == null) {
        console.log("please assign 'this.resourceinfo' a JSON data generate form QIot");
        return;
    }
    for (var i = 0; i < this.resourceinfo.resources.length; i++) {
        var sensor = this.resourceinfo.resources[i];
        if (resource_id == sensor["resourceid"]) {
            var jsonVal = JSON.stringify({
                value: value
            }, {
                retain: true
            });
            this.mqttclient.publish(sensor["topic"], jsonVal);
            console.log(" send message to [mqtt(s)://" + this.mqttoptions.host + ":" + this.mqttoptions.port + "], topic_Pub = " + sensor["topic"] + ", value = " + jsonVal);
        }
    }
}

/**
 * publish message to QIoT Suite Lite application by resource topic.
 * @param {(String)} topic -input resource topic
 * @param {(String)} value -input message will publish
 */
var publishByTopic = function publishByTopic(topic, value) {
    var jsonVal = JSON.stringify({
        value: value
    }, {
        retain: true
    });
    this.mqttclient.publish(topic, jsonVal);
    console.log(" send message to [mqtt(s)://" + this.mqttoptions.host + ":" + this.mqttoptions.port + "], topic_Pub = " + topic + ", value = " + jsonVal);
}

/**
 * subscribe resource message by resource id
 * @param {(String)} resource_id -input resource id
 */
var subscribeById = function subscribeById(resource_id) {
    if (this.mqttclient == null) {
        console.log("please connect mqtt server");
        return;
    }
    if (this.resourceinfo == null) {
        console.log("please assign 'this.resourceinfo' a JSON data generate form QIot");
        return;
    }
    for (var i = 0; i < this.resourceinfo.resources.length; i++) {
        var sensor = this.resourceinfo.resources[i];
        if (resource_id == sensor["resourceid"]) {
            this.mqttclient.subscribe(sensor["topic"]);
            console.log("add subscribe :" + sensor["topic"]);
        }
    }
}

/**
 * get topic by resource topic
 * @param {(String)} resource_id -input resource id
 * @returns {(String)} -retrun resource topic
 */
var getTopicById = function(resource_id) {
    if (this.resourceinfo == null) {
        console.log("please assign 'this.resourceinfo' a JSON data generate form QIot");
        return;
    }
    for (var i = 0; i < this.resourceinfo.resources.length; i++) {
        var sensor = this.resourceinfo.resources[i];
        if (resource_id == sensor["resourceid"]) {
            return sensor["topic"];
        }
    }
}

module.exports = mqttConnect;