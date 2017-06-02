import os
import random
import time
import json
from lib import qiot

"""
	This sample code demo receive value from QIoT Suite Lite by MQTT(S) protocol  
	requirement:
	-- opkg update
	-- opkg install distribute
	-- opkg install python-openssl
	-- easy_install pip
	-- pip install paho-mqtt
	run command: python mqtt_subscribe.py
"""

"""
	Setup connection options
"""
connection = None
connection = qiot.connection(qiot.protocol.MQTT)
connection_options = connection.read_resource('./res/resourceinfo.json', '/ssl/')

"""
	Receive data of QIoT Suite Lite.
"""
def on_message(event_trigger,data):
	message =json.loads(data["message"].payload)
	if(data['id']=='temp'):
		print "temp : " + str(message['value'])
    	print "------------------------"

def on_connect(event_trigger,data):
	print "client ready"
	connection.subscribe_by_id("temp")


connection.on("connect",on_connect)
connection.on("message",on_message)
connection.connect(connection_options)

while 1:
	pass