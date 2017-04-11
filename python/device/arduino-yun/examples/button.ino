#include <Bridge.h>

const int buttonPin = 2;     // the number of the pushbutton pin
const int ledPin =  13;      // the number of the LED pin
int buttonState = 0;  
int prebuttonState = 0; 

void setup() {
  Serial.begin(9600);
  Bridge.begin();
  pinMode(ledPin, OUTPUT);
  pinMode(buttonPin, INPUT);
}

void loop() {
  buttonState = digitalRead(buttonPin);
  if (buttonState == HIGH) {
    // turn LED on:
    digitalWrite(ledPin, HIGH);
  } else {
    // turn LED off:
    digitalWrite(ledPin, LOW);
    Bridge.put("button", "false");

  }
  // when button state change 
  if(prebuttonState != buttonState){
    Bridge.put("button",String(buttonState));
    Serial.println("button : " + String(buttonState));
  }
  prebuttonState = buttonState;
}
