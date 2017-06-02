# -*- coding: utf-8 -*-
import time
import sys
from lib import qiot

sys.path.insert(0, '/usr/lib/python2.7/bridge/') 
from bridgeclient import BridgeClient as bridgeclient

bridge_client = bridgeclient()

"""
	This sample code demo button send to QIoT Suite 
	requirement:
	-- opkg update
	-- opkg install distribute
	-- opkg install python-openssl
	-- easy_install pip
	-- pip install paho-mqtt

    configure the system to allow various Bridge related services to run,command as follow 
	-- uci set yunbridge.config.disabled=’0’
	-- uci commit
	-- reboot
	run command: python button.py
"""

"""
	Setup connection options
"""
connection = None
connection = qiot.connection(qiot.protocol.MQTT)
connection_options = connection.read_resource('./res/resourceinfo.json', '/ssl/')
connection.connect(connection_options)

"""
	Send sensor's data to QIoT Suite Lite by Resourcetype.
"""
while True:	
	button_state = bridge_client.get("button")
	connection.publish_by_id("button", str(button_state))
	time.sleep(1)
