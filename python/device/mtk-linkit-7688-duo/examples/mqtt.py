# -*- coding: utf-8 -*-
import random
import time
from lib import qiot

"""
	This sample code demo random number value send to QIoT Suite 
	requirement:
	-- opkg update
	-- opkg install distribute
	-- opkg install python-openssl
	-- easy_install pip
	-- pip install paho-mqtt
	run command: python mqtt.py
"""

"""
	Setup connection options
"""
connection = None
connection = qiot.connection(qiot.protocol.MQTT)
connection_options = connection.read_resource('./res/resourceinfo.json', '/ssl/')

"""
	Send data to QIoT Suite Lite.
"""
def on_connect(event_trigger,data):
    print "client ready"


connection.on("connect",on_connect)
connection.connect(connection_options)

while 1:
    """
        about ./res/resourceinfo.json
        {
          ~
          "resources": [
            {
                ...
                "resourceid": "temp",
                "topic": "qiot/things/admin/abccccc/temp",
                ...
             }
          ]
        }
        TODO: you could replace "temp" by any resource id set form QIoT Suite Lite
    """
    connection.publish_by_id("temp", str(random.randint(0, 41)))
    """
        or publish by resource topic
        TODO: you could replace "qiot/things/admin/edison/temp" by any Topic form QIoT Suite Lite like following
        connection.publishByTopic("qiot/things/admin/edison/temp", getRandomInt(0, 50));
    """
    time.sleep(1)
