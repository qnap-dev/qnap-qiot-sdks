# -*- coding: utf-8 -*-
import os
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
	-- pip install requests    
	run command: python http.py
"""

"""
	Setup connection options
"""
connection = qiot.connection(qiot.protocol.HTTP)
connection_options = connection.read_resource('./res/resourceinfo.json')

"""
    Send data to QIoT Suite Lite.
"""
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
