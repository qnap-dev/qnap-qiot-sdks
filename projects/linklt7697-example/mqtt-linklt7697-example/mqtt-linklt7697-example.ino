#include <LWiFi.h>
#include <PubSubClient.h>

#define WIFI_SSID "TP-LINK_EXAMPLE"
#define WIFI_PASSWORD "abcd1234"

#define QIOT_SERVER_IP "172.17.28.81"
#define QIOT_SERVER_PORT 21883
#define QIOT_USERNAME "ed136f62-d2e1-4b26-ab96-267b8179f150"
#define QIOT_PASSWORD "r:12de65181a01ae238fdac907b630d965"
#define QIOT_CLIENT_ID "linklt7697_1531706161"
#define QIOT_TOPIC "qiot/things/admin/linklt7697/temp"

int status = WL_IDLE_STATUS;
WiFiClient client;
PubSubClient upload(client);

void reconnect()
{
  // Loop until we're reconnected
  while (!upload.connected())
  {
    Serial.print("Attempting MQTT connection...");
    // Attempt to connect
    if (upload.connect(QIOT_CLIENT_ID, QIOT_USERNAME, QIOT_PASSWORD))
    {
      Serial.println("connected");
    }
    else
    {
      Serial.print("failed, rc=");
      Serial.print(upload.state());
      Serial.println(" try again in 5 seconds");
      // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}

void setup()
{
  Serial.begin(9600);

  // attempt to connect to Wifi network:
  while (status != WL_CONNECTED)
  {
    Serial.print("Attempting to connect to SSID: ");
    Serial.println(WIFI_SSID);
    // Connect to WPA/WPA2 network. Change this line if using open or WEP network:
    status = WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  }
  Serial.println("Connected to wifi");
  printWifiStatus();

  // if analog input pin 0 is unconnected, random analog
  // noise will cause the call to randomSeed() to generate
  // different seed numbers each time the sketch runs.
  // randomSeed() will then shuffle the random function.
  randomSeed(analogRead(0));

  upload.setServer(QIOT_SERVER_IP, QIOT_SERVER_PORT);
  delay(1500);
}

void loop()
{
  if (!upload.connected())
  {
    reconnect();
  }
  else
  {
    // get a random number from 1 to 100
    long randNumber = random(100) + 1;
    String payload = "{\"value\":" + String(randNumber) + "}";
    // publish to QIoT Server
    if (upload.publish(QIOT_TOPIC, payload.c_str()))
    {
      Serial.println("Message => " + payload + " has been sent to " + QIOT_SERVER_IP + ".");
    }
    delay(100);
  }

  upload.loop();
  delay(2000);
}

void printWifiStatus()
{
  // print the SSID of the network you're attached to:
  Serial.print("SSID: ");
  Serial.println(WiFi.SSID());

  // print your WiFi shield's IP address:
  IPAddress ip = WiFi.localIP();
  Serial.print("IP Address: ");
  Serial.println(ip);

  // print the received signal strength:
  long rssi = WiFi.RSSI();
  Serial.print("signal strength (RSSI):");
  Serial.print(rssi);
  Serial.println(" dBm");
}
