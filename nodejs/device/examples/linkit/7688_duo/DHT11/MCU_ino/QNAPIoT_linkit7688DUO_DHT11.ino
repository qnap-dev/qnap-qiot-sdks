#include <ArduinoJson.h>

#include <DHT.h>

#define DHTPIN 12     // what digital pin we're connected to

#define DHTTYPE DHT11   // DHT 11
DHT dht(DHTPIN, DHTTYPE);

unsigned long timer;
unsigned long counter = 0L;

void setup() {
  Serial.begin(9600);
  Serial1.begin(57600);
  Serial.println("DHT11 test!");

  dht.begin();
}

void loop() {
  float h = dht.readHumidity();
  float t = dht.readTemperature();
//  float f = dht.readTemperature(true);
//
//  // Check if any reads failed and exit early (to try again).
//  if (isnan(h) || isnan(t) || isnan(f)) {
//    Serial.println("Failed to read from DHT sensor!");
//    return;
//  }
//  
//  float hif = dht.computeHeatIndex(f, h);
//  float hic = dht.computeHeatIndex(t, h, false);

  if (millis() - timer > 200) {
        timer = millis();

        //json
        StaticJsonBuffer<200> jsonBuffer;
        
        JsonObject& root = jsonBuffer.createObject();
        root["temperature"] = String(t);
        root["humidity"] = String(h);

        root.printTo(Serial1);
        root.prettyPrintTo(Serial);
        Serial1.print("\r\n");

            }
}
