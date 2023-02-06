#include <ESP8266WebServer.h>

ESP8266WebServer server(80);

static const char HELLO_WORLD[] PROGMEM = {
  "<!DOCTYPE html>"
  "<html><head>"
  "<title>Hello world!</title>"
  "</head><body>"
  "Hello world!"
  "</body></html>"
};

char tempJsonString[101];

void setup() {
  server.on("/", HTTP_GET, []() {
    // Send a string from PROGMEM.
    server.sendContent_P(HELLO_WORLD);
  });

  server.on("/settings/get", []() {
    int someValue = getSomeValue(); // [pretend this is real]
    sprintf(tempJsonString, "{ \"foo\": %d }", someValue);
    server.send(200, "application/json", tempJsonString);
  });

  server.begin();
}

void loop() {
  server.handleClient();
}
