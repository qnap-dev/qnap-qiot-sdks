import time
import random
import json
from lib import qiot

"""
	This sample code demo receive value from QIoT Suite Lite by HTTPS protocol
	requirement:
	-- opkg update
	-- opkg install distribute
	-- opkg install python-openssl
	-- easy_install pip
	-- pip install requests
	run command: python https_get.py
"""

"""
	Setup connection options
"""
connection = qiot.connection(qiot.protocol.HTTPS)
connection_options = connection.read_resource('./res/resourceinfo.json')
connection.set_cacert(False) #CA Certificate

"""
	Receive data of QIoT Suite Lite.
"""
def on_message(event_trigger,data):
	message =json.loads(data["message"])
	if(data['id']=='temp'):
		print "temp : " + str(message['value'])
    	print "------------------------"

connection.on("message",on_message)


while 1:
    connection.subscribe_by_id("temp")
    time.sleep(1)