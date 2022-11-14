#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>
#include <Adafruit_Fingerprint.h>
SoftwareSerial mySerial(D3, D4);
Adafruit_Fingerprint finger = Adafruit_Fingerprint(&mySerial);
const char* ssid = "Smart_room";
const char* password = "freekanhihae";
String serverName = "http://192.168.0.102:3000/set";
unsigned long lastTime = 0;
unsigned long timerDelay = 5000;

void setup() {
  Serial.begin(115200); 

  WiFi.begin(ssid, password);
  Serial.println("Connecting");
  while(WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("Connected to WiFi network with IP Address: ");
  Serial.println(WiFi.localIP());
   finger.begin(57600);

  if (finger.verifyPassword())
  {
    Serial.println("Found Successfully");
    delay(1500);
   
  } else
  {
    Serial.println("Fingerprint sensor not found!!!");
    while (1)
    {
      delay(1);
    }
  }
  
}
void send_data(int num)
{
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
        Serial.println(httpResponseCode);
        String payload = http.getString();
        Serial.println(payload);
        delay(4000);
      }
      else {
        Serial.print("Error code: ");
        Serial.println(httpResponseCode);
      }
      http.end();
    }
    else {
      Serial.println("WiFi Disconnected");
    }
    lastTime = millis();
  }
  
}

void loop() {
  
   int fingerprintID = getFingerprintID();
if(fingerprintID>-1)
{
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
