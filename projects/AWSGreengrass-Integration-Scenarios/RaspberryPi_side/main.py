# -*- coding: utf-8 -*-
import os
import time
import json
from lib import qiot

#ADD Image
import base64
from subprocess import call
#########################

###################################
#SET CAPTURE
def capture():
    call(["fswebcam", "-d","/dev/video0", "-r", "350x200", "--no-banner", "./Image.jpg"])
################################### 

"""
    Setup connection options
"""
connection = None
connection = qiot.connection(qiot.protocol.MQTT)
connection_options = connection.read_resource('./res/resourceinfo.json', '/ssl/')

"""
    Send data to QIoT Suite Lite.
"""
def on_message(event_trigger,data):
    message =json.loads(data["message"].payload)
    if(data['id']=='led'):
        print "------------------------"
        print str(message['value'])
        print "------------------------"

def on_connect(event_trigger,data):
    print "client ready"
    connection.subscribe_by_id("led")

connection.on("connect",on_connect)
connection.on("message",on_message)
connection.connect(connection_options)

while 1:
    capture()
    with open("Image.jpg", "rb") as image_file: 
        encoded_string = base64.b64encode(image_file.read())
    connection.publish_by_id("image", '"'+encoded_string+'"')
    time.sleep(5)
