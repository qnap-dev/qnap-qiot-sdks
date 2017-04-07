/**
 * Copyright (c) QNAP Systems, Inc. All rights reserved.
*/

var http = require('http');
var fs = require('fs');
var util = require('util');
var EventEmitter = require('events').EventEmitter;

var httpConnect = function httpConnect() {
    this.httpoptions = null;
    this.resourceinfo = null;

    this.readResource = readResource;
    this.publishById = publishById;
    this.publishByTopic = publishByTopic;
    this.subscribeById = subscribeById;
    this.getTopicById = getTopicById;

    this.subscribeList = [];
    setInterval(getMessage.bind(this), 1000);
    EventEmitter.call(this);
}
util.inherits(httpConnect, EventEmitter);

/**
 * input jsonfile generated from QIoT Suite Lite and return connection option 
 * @param {(JSON)} jsonfile -generated from QIoT Suite Lite 
 * @returns {(Object)} -http connection option
 */
var readResource = function readResource(jsonfile) {
    var httpoptions = {
        method: 'POST',
    };

    // read resourceinfo json file
    var data = fs.readFileSync(jsonfile, 'utf8');
    data = JSON.parse(data);
    this.resourceinfo = data;
    httpoptions.clientId = data.clientId;
    httpoptions.port = data.port;
    httpoptions.hostname = data.host[0];
    httpoptions.headers = {
        'Content-Type': 'application/json',
        'Access-Token': data.accesstoken,
        'Requesterid': data.requesterid
    };
    this.httpoptions = httpoptions;
    return httpoptions;
}

/**
 * publish message to QIoT Suite Lite application by resource id.
 * @param {(String)} resource_id -input resource id
 * @param {(String)} value -input message will publish
 */
var publishById = function publishById(resource_id, value) {
    if (this.resourceinfo == null) {
        console.log("please assign 'this.resourceinfo' a JSON data generate form QIot");
        return;
    }

    for (var i = 0; i < this.resourceinfo.resources.length; i++) {
        var sensor = this.resourceinfo.resources[i];
        if (resource_id == sensor["resourceid"]) {
            var jsonVal = JSON.stringify({
                value: value
            });

            var options = {};
            options.clientId = this.httpoptions.clientId;
            options.port = this.httpoptions.port;
            options.hostname = this.httpoptions.hostname;
            options.headers = this.httpoptions.headers;
            options.path = '/resources/' + sensor["topic"];
            options.method = 'PUT';

            var req = http.request(options, function(httpRes) {
                var buffers = [];
                httpRes.on('data', function(chunk) {
                    buffers.push(chunk);
                });
            }).on('error', function(err) {
                console.log('error ' + err);
            });
            req.write(jsonVal);
            console.log(" send message to [http://" + options.hostname + ":" + options.port + options.path + ", value = " + jsonVal);
            req.end();
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
    options.clientId = this.httpoptions.clientId;
    options.port = this.httpoptions.port;
    options.hostname = this.httpoptions.hostname;
    options.headers = this.httpoptions.headers;
    options.path = '/resources/' + topic;
    options.method = 'PUT';

    var req = http.request(options, function(httpRes) {
        var buffers = [];
        httpRes.on('data', function(chunk) {
            buffers.push(chunk);
        });
    }).on('error', function(err) {
        console.log('error ' + err);
    });
    req.write(jsonVal);
    console.log(" send message to [http://" + options.hostname + ":" + options.port + options.path + ", value = " + jsonVal);
    req.end();
}


/**
 * subscribe resource message by resource id
 * @param {(String)} resource_id -input resource id
 */
var subscribeById = function subscribeById(resource_id) {
    if (this.resourceinfo == null) {
        console.log("please assign 'this.resourceinfo' a JSON data generate form QIot");
        return;
    }
    for (var i = 0; i < this.resourceinfo.resources.length; i++) {
        var sensor = this.resourceinfo.resources[i];
        if (resource_id == sensor["resourceid"]) {
            var options = {};
            options.clientId = this.httpoptions.clientId;
            options.port = this.httpoptions.port;
            options.hostname = this.httpoptions.hostname;
            options.headers = this.httpoptions.headers;
            options.path = '/resources/' + sensor["topic"];
            options.method = 'GET';
            var data = {
                "topic": sensor["topic"],
                "id": resource_id,
                "connection_options": options
            }
            this.subscribeList.push(data);
        }
    }
}


/**
 * interval send request to get message
 */
var getMessage = function getMessage() {
    var self = this;
    this.subscribeList.forEach(function(subscribe_data) {
        var request = http.request(subscribe_data.connection_options);
        request.on('response', function(response) {
            var body = '';
            response.on('data', function(chunk) {
                body += chunk;
            });
            response.on('end', function() {
                try {
                    if (body != "Not found" || body != "") {
                        var data = {
                            'topic': subscribe_data.topic,
                            'id': subscribe_data.id,
                            'message': JSON.parse(body)
                        };
                        self.emit("message", data);
                    }
                } catch (e) {
                    console.log("ERROR" + e);
                }
            });
        });
        request.end(); // start the request
    })
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

module.exports = httpConnect;