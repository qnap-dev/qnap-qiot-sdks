#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#define BUTTON_PIN D1
#define LED_PIN D2

char* wifi_ssid = "TP-LINK_09ED";
char* wifi_password = "06188436";

char* mqtt_server = "172.17.28.48";
int mqtt_port = 21883;
char* mqtt_clientID = "ESP8266_1503489186";
char* mqtt_username = "7308624f-5630-48e6-9a82-26bb1754c5ff";
char* mqtt_password = "r:18962a95d258b34826bcc2812aada0ed";

char* mqtt_publish_topic = "qiot/things/admin/ESP8266/button";
char* mqtt_subscribe_topic = "qiot/things/admin/ESP8266/led";

WiFiClient espClient;
PubSubClient client(espClient);

void setup() {
  // initialize the LED pin as an output:
  pinMode(LED_PIN, OUTPUT);
  // initialize the pushbutton pin as an input:
  pinMode(BUTTON_PIN, INPUT_PULLUP);
  Serial.begin(115200);
  setup_wifi();
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);
}

void setup_wifi() {

  delay(10);
  // We start by connecting to a WiFi network
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(wifi_ssid);

  WiFi.begin(wifi_ssid, wifi_password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] ");
  for (int i = 0; i < length; i++) {
    Serial.print((char)payload[i]);
  }
  Serial.println();

  // Switch on the LED if an 1 was received as first character
  if ((char)payload[0] == '1') {
    digitalWrite(LED_PIN, HIGH);   // Turn the LED on 
  } else {
    digitalWrite(LED_PIN, LOW);  // Turn the LED off
  }

}

void reconnect() {
  // Loop until we're reconnected
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    // Attempt to connect
    if (client.connect(mqtt_clientID,mqtt_username,mqtt_password)) {
      Serial.println("connected");
      
      //Subscribe
      client.subscribe(mqtt_subscribe_topic);
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}

char msg[50];
int buttonState = 0;

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();
  if(!digitalRead(BUTTON_PIN) != buttonState){
    Serial.print(F("Publish message: "));
    String msg_a = "{\"value\":"+ String(buttonState) +"}";
    msg_a.toCharArray(msg, 50);
    Serial.println(msg);
    //Publish
    client.publish(mqtt_publish_topic, msg); 
    buttonState = !digitalRead(BUTTON_PIN);
  }
}
