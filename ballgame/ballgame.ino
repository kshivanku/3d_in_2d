const int buttonPin = 2;
const int restartPin = 7;
const int redledPin =4; // the pin that the LED is attached to
const int greenledPin = 8; // the pin that the LED is attached to
int incomingByte; // a variable to read incoming serial data into
void setup() {
  // configure the serial connection:
  Serial.begin(9600);
  pinMode(buttonPin, INPUT);
  pinMode(restartPin, INPUT);
  pinMode(redledPin, OUTPUT);
  pinMode(greenledPin, OUTPUT); // initialize the LED pin as an output
  }
void loop() {
  if (Serial.available() > 0) { // see if there’s incoming serial data
  // read the X axis:
    int sensorValue = analogRead(A0);
    // print the results:
    Serial.print(sensorValue);
    Serial.print(“,”);
    // read the y axis:
    sensorValue = analogRead(A1);
    // print the results:
    Serial.print(sensorValue);
    Serial.print(“,”);
    // read the z axis:
    sensorValue = analogRead(A2);
    // print the results:
    Serial.print(sensorValue);
    Serial.print(“,”);
    //if the button is pressed
    sensorValue = digitalRead(buttonPin);
    Serial.print(sensorValue);
    Serial.print(“,”);
    sensorValue = digitalRead(restartPin);
    Serial.println(sensorValue);
    incomingByte = Serial.read(); // read it
    if (incomingByte == ‘H’) { // if it’s a capital H (ASCII 72),
      digitalWrite(redledPin, HIGH); // turn on red the LED
      digitalWrite(greenledPin,LOW); // green LED
    }
    if (incomingByte == ‘L’) { // if it’s an L (ASCII 76)
      digitalWrite(redledPin, LOW); // turn off red the LED
      digitalWrite(greenledPin, HIGH); // green LED
    }
  }
}
