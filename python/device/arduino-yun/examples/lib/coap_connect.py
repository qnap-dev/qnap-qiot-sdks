"""
 Copyright (c) QNAP Systems, Inc. All rights reserved.
"""

from coapthon.client.helperclient import HelperClient
import json
import threading

class Coap:

    coap_client = None
    coap_options = None
    resource_info = None
    callbacks=None
    subscribe_client=[]

    def __init__(self):
        print "new coap protocal"
    def read_resource(self,resfile):
       
        """
        this function will input resource JSON file generated from QIot and connect to device
        :param resfile:json content generated from QIot
        :param sslpath:path put device certificate generated from QIot
        :return: device connection
        """
        global resource_info, coap_options
        with open(resfile, 'r') as f:
            data = f.read()
            resource_info = json.loads(data)
            coap_options = {
                'host' : str(resource_info['host'][0]),
                'port' : int(resource_info['port']),
                'query' : str("?r=" + resource_info['r'] + "&t=" + resource_info['t']),
                'client_id' : str(resource_info['clientId'])
            }
        f.close()

        print "HOST : " + str(coap_options['host'])
        print "PORT : " + str(coap_options['port'])

        print "QUERY : " + str(coap_options['query'])
        print "finish setup"

        return coap_options
    
    def connect(self,option):
        global coap_client
        coap_client = HelperClient(server=(option['host'], option['port']))

    def stop(self):
        global coap_client
        print('close client!!!')
        print "client num ="+str(len(self.subscribe_client))
        for client in self.subscribe_client:
            print "item ="
            client.stop()
            client.close()
        coap_client.stop()
        coap_client.close()

    def publish_by_id(self,resource_id, value):
        """
        this function will send message by resource id
        :param id_name:resource id name
        :param value:message
        """
        global coap_client
        resources = resource_info['resources']
        for res in resources:
            if (resource_id == str(res["resourceid"])) :
                try:
                    path = str(res["topic"]) + str(coap_options['query'])
                    print path
                    response = coap_client.put(path, json.dumps({'value': value}))
                    print "NOW TOPIC_NAME :" + str(res["topic"]) + " MESSAGE : " + str(value)
                except Exception, error:
                    print error

    def publish_by_topic(self,topic, value):
        """
        this function will send message by resource id
        :param id_name:resource id name
        :param value:message
        """
        global coap_client
        try:
            path = str(topic) + str(coap_options['query'])
            response = coap_client.put(path, json.dumps({'value': value}))
            print "NOW TOPIC_NAME :" + str(topic) + " MESSAGE : " + str(value)
        except Exception, error:
            print error

    def subscribe_by_id(self,resource_id):
        """
        this function scbscribe message from resource by resource id
        :param id_name:resource id name
        """
        global coap_client
        resources = resource_info['resources']
        for res in resources:
            if (resource_id == str(res["resourceid"])) :
                try:
                    path = str(res["topic"]) + str(coap_options['query'])
                    print path
                    def on_message(observer_json_data):
                            data={
                                'id':resource_id,
                                'message':observer_json_data.payload
                            }
                            self.trigger("message",data)
                    s_client= HelperClient(server=(coap_options['host'], coap_options['port']))      
                    self.subscribe_client.append(s_client)
                    s_client.observe(path,on_message)
                except Exception, error:
                    print "subscribe error"
                    print error
                    coap_client.observe(path,None)

    def get_topic_by_id(self, resource_id):
        """
        get topic by resource topic
        :param resource_id : input resource id
        :return : resource topic
        """
        resources = resource_info['resources']
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