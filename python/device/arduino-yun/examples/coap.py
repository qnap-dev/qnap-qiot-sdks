# -*- coding: utf-8 -*-
import os
import random
import time
import signal
import sys
from lib import qiot

"""
	This sample code demo random number value send to QIoT Suite 
	requirement:
	-- opkg update
	-- opkg install distribute
	-- opkg install python-openssl
	-- easy_install pip
	-- pip install coapthon
	run command: python coap.py
"""

"""
	Setup connection options
"""
connection = qiot.connection(qiot.protocol.COAP)
connection_options = connection.read_resource('./res/resourceinfo.json')

"""
	Send data to QIoT Suite Lite.
"""
connection.connect(connection_options)

def signal_handler(signal, frame):
        print('You pressed Ctrl+C!')
        connection.stop()
        sys.exit(0)
signal.signal(signal.SIGINT, signal_handler)

while True:
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
    time.sleep(1)
    """
        or publish by resource topic
        TODO: you could replace "qiot/things/admin/edison/temp" by any Topic form QIoT Suite Lite like following
        connection.publishByTopic("qiot/things/admin/edison/temp", getRandomInt(0, 50));
    """
