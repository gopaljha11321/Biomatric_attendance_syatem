#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>
#include <Adafruit_Fingerprint.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
SoftwareSerial mySerial(D5, D6);//(Yellow, Green)
#define SCREEN_WIDTH 128 // OLED display width, in pixels
#define SCREEN_HEIGHT 64 // OLED display height, in pixels
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);
Adafruit_Fingerprint finger = Adafruit_Fingerprint(&mySerial);
const char* ssid = "Smart_room";
const char* password = "freekanhihae";
String serverName = "http://192.168.0.101:3000/set";
unsigned long lastTime = 0;
unsigned long timerDelay = 5000;

void setup() {
  Serial.begin(115200); 
   if(!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) { // Address 0x3D for 128x64
    Serial.println(F("SSD1306 allocation failed"));
    for(;;);
  }
  delay(2000);
  display.clearDisplay();
   display.setTextSize(2);
  display.setTextColor(WHITE);
  WiFi.begin(ssid, password);
  display.setCursor(0, 0);
  display.println("Connecting");
  int a=0;
  while(WiFi.status() != WL_CONNECTED) {
    delay(500);
    display.setCursor(a, 35);
  display.println(".");
  display.display();
  a+=5;
  }
  display.clearDisplay();
   display.setCursor(0, 0);
   display.setTextSize(1);
  display.println("Connected to WiFi network with IP Address: ");
  display.setTextSize(2);
  display.setCursor(0, 30);
  display.println(WiFi.localIP());
  display.display();
   finger.begin(57600);
   display.clearDisplay();
   display.setCursor(0, 20);
   display.setTextSize(1);
  if (finger.verifyPassword())
  {
    Serial.println("Found Successfully");
    display.println("Found Successfully");
    display.display();
    delay(1500);
   
  } else
  {
    Serial.println("Fingerprint sensor   not found!!!");
    display.println("Fingerprint sensor   not found!!!");
    display.display();
    while (1)
    {
      delay(1);
    }
  }
}
void send_data(int num)
{
  display.clearDisplay();
   display.setTextSize(2);
  display.setTextColor(WHITE);
   if ((millis() - lastTime) > timerDelay) {
    //Check WiFi connection status
    if(WiFi.status()== WL_CONNECTED){
      WiFiClient client;
      HTTPClient http;
      String serverPath = serverName + "?name=ram&no="+num;
      http.begin(client, serverPath.c_str());
      int httpResponseCode = http.GET();
      
      if (httpResponseCode>0) {
        Serial.print("HTTP Response code: ");
        String payload = http.getString();
        Serial.println(payload);
         display.setCursor(0, 0);
        display.println("   "+payload);
        display.display();
        delay(4000);
      }
      else {
        Serial.print("Error code: ");
        Serial.println(httpResponseCode);
        display.setCursor(0, 20);
        display.println("Server    down");
        display.display();
        delay(3000);
      }
      http.end();
    }
    else {
      Serial.println("WiFi Disconnected");
       display.setCursor(0, 20);
       display.println("WiFi Disconnected");
       display.display();
    }
    lastTime = millis();
  }
  
}

void loop() {
  display.clearDisplay();
  display.setTextSize(2);
  display.setTextColor(WHITE);
  display.setCursor(0, 10);
  display.println("Place Your   Finger");
  display.display();
   int fingerprintID = getFingerprintID();
if(fingerprintID>-1)
{
  display.clearDisplay();
  display.setCursor(25, 20);
  display.println("Done");
  display.display();
  send_data(fingerprintID);
}
delay(50);
}
int getFingerprintID()
{
  uint8_t p = finger.getImage();
  if (p != FINGERPRINT_OK)  return -1;

  p = finger.image2Tz();
  if (p != FINGERPRINT_OK)  return -1;

  p = finger.fingerFastSearch();
  if (p != FINGERPRINT_OK)  return -1;

  return finger.fingerID;
}
