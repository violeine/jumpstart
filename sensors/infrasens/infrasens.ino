/*
 * Kết nối:
 *          CB              Arduino
 *          Vin               5V
 *          SCL               SCL
 *          SDA               SDA 
 *          GND               GND
 *          
 * Nạp code mở Serial Monitor, chọn No line ending, baud 9600
 */

#include <Adafruit_MLX90614.h>
#include <ArduinoJson.h>
#include <ESP8266WiFi.h>
#include <ArduinoWebsockets.h>

Adafruit_MLX90614 mlx = Adafruit_MLX90614();
const char* ssid = "viola2.4"; //Enter SSID
const char* password = "0357095092"; //Enter Password
// websocket lan
const char* websockets_server = "bemac.lan"; // raspberry pi network
const uint16_t port=3001; //server adress and port
//WEBSOCKET 
using namespace websockets;

WebsocketsClient client; 

void onEventsCallback(WebsocketsEvent event, String data) {
    if(event == WebsocketsEvent::ConnectionOpened) {
        Serial.println("Connnection Opened");
        //rain module
        client.send("Reg:Rain");
        //fire module
        client.send("Reg:Fire");
    } else if(event == WebsocketsEvent::ConnectionClosed) {
        Serial.println("Connnection Closed");
        
    } else if(event == WebsocketsEvent::GotPing) {
        Serial.println("Got a Ping!");
    
    } else if(event == WebsocketsEvent::GotPong) {
        Serial.println("Got a Pong!");
    }
}
void onMessageCallback(WebsocketsMessage message) {
    String data=message.data();
    if (data == "get-temp") {
      client.send(printCmd("Fire:Ambient:",mlx.readAmbientTempC()));
      client.send(printCmd("Fire:Object:",mlx.readObjectTempC()));
    } 
    if (data== "get-rain") {sendRain();}
    Serial.println(data);
   
}
void setup() {
    WiFi.mode(WIFI_STA); //station not access point
    Serial.begin(115200);
    WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED){
    //waiting for connect;
     Serial.print(".");
     delay(500);
  }
  client.onEvent(onEventsCallback);
  client.onMessage(onMessageCallback);
  bool connected=client.connect(websockets_server,port,"/ws");
   Serial.println(connected);
  mlx.begin();  
}
int d=3000;
unsigned long mytime=millis();
String printCmd(String c, double a){
  String result = c + a;
  return result;
  }
  
void sendRain(){
  String rain=digitalRead(13) ? "no" : "yes";
  client.send("Rain:isRain?:" + rain);
  }
  
void loop() {
  if (client.available()) {
    client.poll();
      if (millis()- mytime >= d) {
      Serial.println("ting");
      mytime=millis();
      client.send(printCmd("Fire:Ambient:",mlx.readAmbientTempC()));
      client.send(printCmd("Fire:Object:",mlx.readObjectTempC()));
      sendRain();
     Serial.println("rain temp");
      Serial.print(analogRead(A0));
      Serial.print("  ");
      Serial.println(digitalRead(13));
      }}
  else client.connect(websockets_server,port,"/ws");
  

}
