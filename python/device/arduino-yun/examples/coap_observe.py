import time
import os
import random
import json
import signal
import sys
from lib import qiot
"""
	This sample code demo receive value from QIoT Suite Lite by CoAP protocol
	requirement:
	-- opkg update
	-- opkg install distribute
	-- opkg install python-openssl
	-- easy_install pip
	-- pip install coapthon
	run command: python coap_observe.py
"""

"""
	Setup connection options
"""
connection = qiot.connection(qiot.protocol.COAP)
connection_options = connection.read_resource('./res/resourceinfo.json')

"""
	Receive data of QIoT Suite Lite.
"""
def on_message(event_trigger,data):
	message =json.loads(data["message"])
	if data['id']=='temp':
		print "temp : " + str(message['value'])
		print "------------------------"

connection.on("message",on_message)
connection.connect(connection_options)
connection.subscribe_by_id("temp")

def signal_handler(signal, frame):
        print('You pressed Ctrl+C!')
        connection.stop()
        
signal.signal(signal.SIGINT, signal_handler)

while 1:
	time.sleep(1)
