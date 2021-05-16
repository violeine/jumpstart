

/*
 * Kết nối:
 *          VCC      -----      5V (Arduino)
 *          OUT      -----      3 (Arduino)
 *          GND      -----      GND (Arduino)
 */

void setup() 
{
  Serial.begin(9600);
}

void loop() 
{
  Serial.println(digitalRead(3));
}
