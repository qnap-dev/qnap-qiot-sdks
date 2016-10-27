#include <ArduinoJson.h>
#include <YunClient.h>
#include <PubSubClient.h>
#include <DHT.h>
#include <Bridge.h>
#define MQTT_SERVER "192.168.198.121" //NAS mqtt broker IP
#define MQTT_CLIENTID "QIoT-Expo-YUN-US" // given a name at will
#define DHTTYPE DHT11   // DHT 11
#define dht_dpin A0 //relevant to D2
  
DHT dht(dht_dpin, DHTTYPE);

char data_hum[80];
char data_temp[80];
String humidity, temperature;

void callback(char* topic, byte* payload, unsigned int length) {
  // handle message arrived
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] ");
  for (int i=0;i<length;i++) {
    Serial.print((char)payload[i]);
  }
  Serial.println();

  if (Serial.available() > 0) {
    //todo
  }
}

YunClient yun;
PubSubClient mqttclient(MQTT_SERVER, 1883, callback, yun);

void setup()
{
Bridge.begin();
Serial.begin(9600);
Serial.println("Humidity and temperature\n\n");   
delay(1000);//Wait rest of 1000ms recommended delay before
//accessing sensor
dht.begin();
}

void reconnect() {
  // Loop until we're reconnected
  while (!mqttclient.connected()) {
    Serial.print("Attempting MQTT connection...");
    if (mqttclient.connect(MQTT_CLIENTID)) {
      Serial.println("connected");
    } else {
      Serial.print("failed, rc=");
      Serial.print(mqttclient.state());
      Serial.println(" try again in 5 seconds");
      // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}

void loop() {
   if (!mqttclient.connected()) {
    reconnect();
  } else {
     mqttclient.loop();
  }
      float h = dht.readHumidity();
      // Read temperature as Celsius (the default)
      float t = dht.readTemperature();
      humidity = String(h, 2);
      temperature = String(t, 2);   
      if (isnan(h) || isnan(t)) {    
      Serial.println("Failed to read from DHT sensor!");
      return;
       }  else {
       // publish
       String payload_Humidity = "{\"deviceId\":\"80682695\",\"sensorId\":\"1\",\"value\":" +  humidity + "}";
       String payload_Temperature = "{\"deviceId\":\"80682695\",\"sensorId\":\"2\",\"value\":" + temperature + "}";
       payload_Humidity.toCharArray(data_hum, (payload_Humidity.length() + 1));
       payload_Temperature.toCharArray(data_temp, (payload_Temperature.length() + 1));
       mqttclient.publish("com/qnap/IoT-Tech-Expo/humidity", data_hum);
       mqttclient.publish("com/qnap/IoT-Tech-Expo/temperature", data_temp);
     }
   delay(1000);
}// end loop()  
