/**
 * Copyright (c) QNAP Systems, Inc. All rights reserved.
*/

var coap = require('coap');
var fs = require('fs');
var util = require('util');
var EventEmitter = require('events').EventEmitter;

var coapConnect = function coapConnect() {
    this.coapoptions = null;
    this.resourceinfo = null;

    this.readResource = readResource;
    this.publishById = publishById;
    this.publishByTopic = publishByTopic;
    this.subscribeById = subscribeById;
    this.getTopicById = getTopicById;

    EventEmitter.call(this);
}
util.inherits(coapConnect, EventEmitter);

/**
 * input jsonfile generated from QIoT Suite Lite and return connection option 
 * @param {(JSON)} jsonfile -generated from QIoT Suite Lite 
 * @returns {(Object)} -coap connection option
 */
var readResource = function readResource(jsonfile) {
    var coapoptions = {
        method: 'PUT',
        observe: false,
        confirmable: true,
    };

    // read resourceinfo json file
    var data = fs.readFileSync(jsonfile, 'utf8');
    data = JSON.parse(data);
    this.resourceinfo = data;
    coapoptions.clientId = data.clientId;
    coapoptions.port = data.port;
    coapoptions.host = data.host[0];
    coapoptions.query = "r=" + data.r + "&t=" + data.t;

    this.coapoptions = coapoptions;
    return coapoptions;
}

/**
 * publish message to QIoT Suite Lite application by resource id.
 * @param {(String)} resource_id -input resource id
 * @param {(String)} value -input message will publish
 */
var publishById = function publishById(resource_id, value) {
    if (this.resourceinfo == null) {
        console.log("please assign 'this.resourceinfo' a JSON data generated form QIot");
        return;
    }
    for (var i = 0; i < this.resourceinfo.resources.length; i++) {
        var sensor = this.resourceinfo.resources[i];
        if (resource_id == sensor["resourceid"]) {
            var jsonVal = JSON.stringify({
                value: value
            });

            var options = {};
            options.clientId = this.coapoptions.clientId;
            options.port = this.coapoptions.port;
            options.host = this.coapoptions.host;
            options.query = this.coapoptions.query;
            options.pathname = sensor["topic"];
            options.method = 'PUT';

            var req = coap.request(options).end(jsonVal);
            req.on('response', function(res) {
                res.pipe(process.stdout);
                if (res.code == "2.04") { //Success Code Handler
                    console.log(" send message to [coap://" + options.host + ":" + options.port + '/' + options.pathname + ", value = " + jsonVal);
                } else { //Error Code Handler
                    console.log(" send message to [coap://" + options.host + ":" + options.port + '/' + options.pathname + ", value = " + jsonVal);
                    console.log("Error Code:  " + res.code);
                }
            })
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
    });

    var options = {};
    options.clientId = this.coapoptions.clientId;
    options.port = this.coapoptions.port;
    options.host = this.coapoptions.host;
    options.query = this.coapoptions.query;
    options.pathname = topic;
    options.method = 'PUT';

    var req = coap.request(options).end(jsonVal);
    req.on('response', function(res) {
        res.pipe(process.stdout);
        if (res.code == "2.04") //Success Code Handler
            console.log(" send message to [coap://" + options.host + ":" + options.port + '/' + options.pathname + ", value = " + jsonVal);
        else //Error Code Handler
            console.log("Error Code:  " + res.code);
    })
}

/**
 * subscribe resource message by resource id
 * @param {(String)} resource_id -input resource id
 */
var subscribeById = function subscribeById(resource_id) {
    var self = this;
    if (this.resourceinfo == null) {
        console.log("please assign 'this.resourceinfo' a JSON data generate form QIot");
        return;
    }
    for (var i = 0; i < this.resourceinfo.resources.length; i++) {
        var sensor = this.resourceinfo.resources[i];
        if (resource_id == sensor["resourceid"]) {

            var options = {};
            options.clientId = this.coapoptions.clientId;
            options.port = this.coapoptions.port;
            options.host = this.coapoptions.host;
            options.query = this.coapoptions.query;
            options.pathname = sensor["topic"];
            options.method = 'GET';
            options.observe = true;
            var topic = sensor["topic"];
            var id = resource_id;
            var connection_options = options;

            var request = coap.request(connection_options)
            request.on('response', function(response) {
                var body = '';
                response.on('data', function(chunk) {
                    try {
                        var data = {
                            'topic': topic,
                            'id': id,
                            'message': JSON.parse(chunk)
                        };
                        self.emit("message", data);
                    } catch (e) {
                        console.log(e);
                    }
                });
            }).end();
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

module.exports = coapConnect;