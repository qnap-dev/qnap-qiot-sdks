#include <DHT.h>
#include <Bridge.h>

#define DHTPIN 2     // what digital pin we're connected to 2

#define DHTTYPE DHT11   // DHT 11
DHT dht(DHTPIN, DHTTYPE);

unsigned long timer;
unsigned long counter = 0L;

void setup() {
  Serial.begin(9600);

  Bridge.begin();
  dht.begin();
}

void loop() {
  float h = dht.readHumidity();
  float t = dht.readTemperature();

  if (millis() - timer > 200) {
        timer = millis();
        Bridge.put("temperature", String(t));
        Serial.println("temperature :" + String(t));
        Bridge.put("humidity", String(h));
        Serial.println("humidity : " + String(h));
    }
}
