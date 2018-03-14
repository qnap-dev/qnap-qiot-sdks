"""
 Copyright (c) QNAP Systems, Inc. All rights reserved.
"""

def connection(type):
    client = None
    if type == protocol.MQTT:
        from lib import mqtt_connect
        client = mqtt_connect.Mqtt()
    elif type == protocol.HTTP:
        from lib import http_connect
        client = http_connect.Http()
    elif type == protocol.HTTPS:
        from lib import https_connect
        client = https_connect.Https()
    elif type == protocol.COAP:
        from lib import coap_connect
        client = coap_connect.Coap()
    return client

class protocol:
    MQTT = "MQTT"
    HTTP = "HTTP"
    HTTPS = "HTTPS"
    COAP = "COAP"
    def __init__(self):
        print 'define protocol'
