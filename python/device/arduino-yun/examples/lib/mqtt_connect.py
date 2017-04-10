"""
 Copyright (c) QNAP Systems, Inc. All rights reserved.
"""

import sys
import paho.mqtt.client as mqtt
import json
import os


class Mqtt:

    mqtt_client = None
    mqtt_options = None
    resource_info = None
    callbacks = None

    def __init__(self):
        print "new mqtt protocal"

    def on_connect(self,client, userdata, flags, rc):
        print "connect ready"
        if(rc==0):
            print "connection ready"
            data={
                'client':client,
                'userdata':userdata,
                'flags':flags,
                'rc':rc
            }
            self.trigger("connect",data)

    def on_message(self,client, userdata, msg):
        data={
            'client':client,
            'userdata':userdata,
            'message': msg,
            'id':None
        }
        resources = self.resource_info['resources']
        for res in resources:
            if (msg.topic == str(res["topic"])):
                data['id']=res["resourceid"]
                break
        self.trigger("message",data)

    def read_resource(self, resfile, sslpath):
        """
        input jsonfile generated from QIoT Suite Lite and return connection option 
        :param resfile : generated from QIoT Suite Lite
        :param sslpath : certificate folder
        """
        with open(resfile, 'r') as f:
            data = f.read()
            self.resource_info = json.loads(data)
            try:
                options = {
                    'host': str(self.resource_info['host'][0]),
                    'port': int(self.resource_info['port']),
                    'username': str(self.resource_info['username']),
                    'password': str(self.resource_info['password']),
                    'clientId': str(self.resource_info['clientId']),
                    'ca':None,
                    'key':None,
                    'cert':None
                }
            except Exception as e:
                print "resource file error :"+ str(e.args)
                options=None
            try:
                arr_KEY = self.resource_info['privateCert'].split('/')
                if (len(arr_KEY) > 0) :
                    options['key'] = os.getcwd() + sslpath + arr_KEY[len(arr_KEY)-1]

                arr_CERT = self.resource_info['clientCert'].split('/')
                if (len(arr_CERT) > 0) :
                    options['cert'] = os.getcwd() + sslpath + arr_CERT[len(arr_CERT)-1]

                arr_CA = self.resource_info['caCert'].split('/')
                if (len(arr_CA) > 0) :
                    options['ca'] = os.getcwd() + sslpath + arr_CA[len(arr_CA)-1]
                    
                print "CLIENT_CERT path :" + str(options['cert'])
                print "PRIVATE_CERT exists or not :" + str(os.path.exists(options['key']))

            except Exception as e:
                print "No MQTT DATA:"+ str(e.args)
        self.mqtt_options = options
        f.close()
        return self.mqtt_options

    def connect(self, option):
        """
        connect to MQTT protocol
        :param option : connection option
        """
        if(option is None):
            print "connection option error" 
            sys.exit()
        self.mqtt_client = mqtt.Client(self.mqtt_options["clientId"])
        self.mqtt_client.on_connect = self.on_connect    
        self.mqtt_client.on_message = self.on_message
        if(self.mqtt_options["ca"]!=None and self.mqtt_options["cert"]!=None and self.mqtt_options["key"]!=None ):
            self.mqtt_client.tls_set(self.mqtt_options["ca"],  self.mqtt_options["cert"], self.mqtt_options["key"])
            self.mqtt_client.tls_insecure_set(True)
            print "Use MQTTS"
        else:
            print "Use MQTT"
        print "USER_NAME : " + self.mqtt_options["username"] + " USER_PASS : " + self.mqtt_options["password"]
        self.mqtt_client.username_pw_set(self.mqtt_options["username"], self.mqtt_options["password"])
        try:
            self.mqtt_client.connect(self.mqtt_options["host"], self.mqtt_options["port"], 60)
        except Exception as e:
            print "Error occurred while trying to connect to QIoT Suite broker. Reason : " + str(e.args)
            sys.exit(e)
        print "finish setup"
        self.mqtt_client.loop_start()
        
    def publish_by_id(self, resource_id, value):
        """
        publish message to QIoT Suite Lite application by resource id.
        :param resource_id : input resource id
        :param value : input message will publish
        """
        resources =self.resource_info['resources']
        for res in resources:
            if (resource_id == str(res["resourceid"])):
                vals = "{\"value\":" + str(value) + "}"
                print "NOW TOPIC_NAME :" + str(res["topic"]) + " MESSAGE : " + str(vals)
                self.mqtt_client.publish(str(res["topic"]), vals)

    def publish_by_topic(self, topic, value):
        """
        publish message to QIoT Suite Lite application by resource topic.
        :param resource_id : input resource topic
        :param value : input message will publish
        """
        self.mqtt_client.publish(topic, value)

    def subscribe_by_id(self, resource_id):
        """
        subscribe resource message by resource id
        :param resource_id : input resource id
        """
        resources = self.resource_info['resources']
        for res in resources:
            if (resource_id == str(res["resourceid"])):
                self.mqtt_client.subscribe(str(res["topic"]))
                print "add subscribe :" + str(res["topic"])

    def get_topic_by_id(self, resource_id):
        """
        get topic by resource topic
        :param resource_id : input resource id
        :return : resource topic
        """
        resources = self.resource_info['resources']
        for res in resources:
            if (resource_id == str(res["resourceid"])):
                return str(res["topic"])

    def on(self, event_name, callback):
        if self.callbacks is None:
            self.callbacks = {}

        if event_name not in self.callbacks:
            self.callbacks[event_name] = [callback]
        else:
            self.callbacks[event_name].append(callback)
    
    def trigger(self, event_name,data):
        if self.callbacks is not None and event_name in self.callbacks:
            for callback in self.callbacks[event_name]:
                callback(self,data)
