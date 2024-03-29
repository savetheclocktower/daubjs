// GENERAL CONFIG
// ==============

#define BAUD_RATE 115200
#define DEBUG 1

#define HOST "laundry-spy"

#ifndef FOO
#error "What!"
#endif


// WASHER/DRYER CONFIG
// ===================

// Vibration threshold necessary to change from IDLE to MAYBE_ON. You might
// need to adjust these values depending on how much your washer and dryer
// vibrate.
#define WASHER_THRESHOLD 1.00
#define DRYER_THRESHOLD  1.00

// How long a machine needs to spend (in ms) in each of the MAYBE states until
// we move it to the next state. These should always be more than 3000ms.
#define TIME_UNTIL_ON   30000  // 30 seconds
#define TIME_UNTIL_DONE 300000 // 5 minutes


// WIFI CONFIG
// ===========

#define WLAN_SSID "your-ssid-goes-here"
#define WLAN_PASS "your-password-goes-here"


// MQTT CONFIG
// ===========

#define MQTT_SERVER "999.999.999.999"
#define MQTT_SERVER_PORT 1883
#define MQTT_USERNAME "your-mqtt-server-username"
#define MQTT_PASSWORD "your-mqtt-server-password"
#define MQTT_CONN_KEEPALIVE 300

#include <math.h>
#include <ESP8266WiFi.h>
#include <ESP8266mDNS.h>
#include <PubSubClient.h>
#include <ArduinoOTA.h>
#include <SimpleTimer.h>
#include <WiFiUdp.h>
#include <SparkFunLIS3DH.h>


// The I2C addresses of the accelerometers. It doesn't matter which plug
// goes into which port, since they have unique IDs.
#define ACCEL_I2C_ADDRESS_WASHER 0x19
#define ACCEL_I2C_ADDRESS_DRYER  0x18

void accel_setup(LIS3DH accel) {
  accel.settings.accelSampleRate = 50;
  accel.settings.accelRange      = 2;
  accel.settings.adcEnabled      = 1;
  accel.settings.tempEnabled     = 0;
  accel.settings.xAccelEnabled   = 1;
  accel.settings.yAccelEnabled   = 1;
  accel.settings.zAccelEnabled   = 1;

  accel.begin();
}

// MQTT
// ====

const char WASHER_FEED[]       = HOST "/washer/state";
const char DRYER_FEED[]        = HOST "/dryer/state";
const char WASHER_FORCE_FEED[] = HOST "/washer/force";
const char DRYER_FORCE_FEED[]  = HOST "/dryer/force";

// Temporary string to hold values that we're publishing via MQTT.
char tempStateValue[2];

PubSubClient mqtt;

void MQTT_connect() {
  Serial.println("Connecting to MQTT...");

  mqtt.setServer(MQTT_SERVER, MQTT_SERVER_PORT);

  bool connected = false;
  while (!connected) {
    connected = mqtt.connect(HOST, MQTT_USERNAME, MQTT_PASSWORD);
    if (!connected) {
      Serial.println("Couldn't connect to MQTT. Retrying in 10 seconds...");
      mqtt.disconnect();
      delay(10000);
    }
  }

  Serial.println("MQTT connected!");
}

void MQTT_handle() {
  if (!mqtt.connected()) {
    MQTT_connect();
  }
  mqtt.loop();
}

// OTA UPDATES
// ===========

void OTA_setup() {
  ArduinoOTA.setHostname(HOST);
  ArduinoOTA.onStart([]() {
    Serial.println("OTA: Start");
  });
  ArduinoOTA.onEnd([]() {
    Serial.println("OTA: End");
  });
  ArduinoOTA.onProgress([](unsigned int progress, unsigned int total) {
    Serial.printf("Progress: %u%%\r", (progress / (total / 100)));
  });
  ArduinoOTA.onError([](ota_error_t error) {
    Serial.printf("OTA: Error[%u]: ", error);
    if      (error == OTA_AUTH_ERROR)    Serial.println("Auth Failed");
    else if (error == OTA_BEGIN_ERROR)   Serial.println("Begin Failed");
    else if (error == OTA_CONNECT_ERROR) Serial.println("Connect Failed");
    else if (error == OTA_RECEIVE_ERROR) Serial.println("Receive Failed");
    else if (error == OTA_END_ERROR)     Serial.println("End Failed");
  });
  ArduinoOTA.begin();
}

void OTA_handle() {
  ArduinoOTA.handle();
}

SimpleTimer timer;

enum ApplianceState {
  // Nothing is happening.
  IDLE,

  // We had a vibration event. We think the appliance may be on, but we're
  // not sure yet.
  MAYBE_ON,

  // Enough vibration has happened in a short time that we're ready to
  // proclaim that the appliance is on.
  ON,

  // It stopped moving. Maybe it's done?
  MAYBE_DONE,

  // It's been silent for long enough that we're sure it's done.
  DONE
};

class Appliance {
  private:
    LIS3DH accel;

    // Last time that we were in the idle state.
    long lastIdleTime = 0;

    // Last time that the force exceeded our threshold, regardless of state.
    long lastActiveTime;

    // The change in acceleration across all three axes since our initial
    // reading.
    float force = 0.0;

    // The force threshold above which we should move the machine from IDLE to
    // MAYBE_ON.
    float threshold;

    // The initial readings we got for acceleration along each axis.
    float initialX;
    float initialY;
    float initialZ;

    // The most recent acceleration values along each axis.
    float lastX;
    float lastY;
    float lastZ;

    void readAccelerometer() {
      float total = 0;

      lastX = accel.readFloatAccelX();
      lastY = accel.readFloatAccelY();
      lastZ = accel.readFloatAccelZ();

      total += fabs(lastX - initialX);
      total += fabs(lastY - initialY);
      total += fabs(lastZ - initialZ);

      force = total;
    }

  public:
    // The appliance we're dealing with (either "Washer" or "Dryer").
    String name;

    // The feed we're publishing our state to.
    String feedName;

    // The feed we're publishing force values to.
    String feedForceName;

    ApplianceState state;

    Appliance (String n, LIS3DH a, float t, String fn, String ffn) : accel(a) {
      name = n;
      threshold = t;

      state = IDLE;
      feedName = fn;
      feedForceName = ffn;

      lastActiveTime = millis() - 5000;
      accel_setup(accel);

      // Take readings at startup.
      initialX = accel.readFloatAccelX();
      initialY = accel.readFloatAccelY();
      initialZ = accel.readFloatAccelZ();
    }

    void update () {
      readAccelerometer();
      long now = millis();

      if (force > threshold) {
        lastActiveTime = now;
      }

      // "Recently" active means our force exceeded the threshold at least once
      // within the last three seconds.
      bool wasRecentlyActive = (now - lastActiveTime) < 3000;

      // This is the logic that navigates us through the state machine.
      // There's IDLE, ON, and DONE, which are obvious. The MAYBE_ON and
      // MAYBE_DONE states are the only ones from which we can move either
      // forward or backward. Once we go to ON, there's no way to go back
      // to IDLE.
      switch (state) {
        case IDLE:
          if (wasRecentlyActive) {
            // Whenever there's so much as a twitch, we switch to the MAYBE_ON
            // state.
            setState(MAYBE_ON);
          } else {
            lastIdleTime = now;
          }
          break;
        case MAYBE_ON:
          if (wasRecentlyActive) {
            // How long have we been active?
            if (now > (lastIdleTime + TIME_UNTIL_ON)) {
              // Long enough that this is not a false alarm.
              setState(ON);
            } else {
              // Let's wait a bit longer before we act.
            }
          } else {
            // We're not active, meaning there's been no vibration for a few
            // seconds. False alarm!
            setState(IDLE);
          }
          break;
        case ON:
          if (wasRecentlyActive) {
            // We expect to be vibrating and we are. All is well. Do nothing.
          } else {
            // We stopped vibrating. Are we off? Switch to MAYBE_DONE so we can
            // figure it out.
            setState(MAYBE_DONE);
          }
          break;
        case MAYBE_DONE:
          if (wasRecentlyActive) {
            // We thought we were done, but we're vibrating now. False alarm!
            // Go back to ON.
            setState(ON);
          } else if (now > (lastActiveTime + TIME_UNTIL_DONE)) {
            // We've been idle for long enough that we're certain that the
            // cycle has stopped.
            setState(DONE);
          }
          break;
        case DONE:
          // Once we get to DONE, there's nothing to do except go back to the
          // initial IDLE state.
          setState(IDLE);
          break;
      }
    }

    bool publishForce () {
      // Arduino's sprintf doesn't support floats.
      bool published = mqtt.publish(
        feedForceName.c_str(),
        String(force).c_str()
      );

      if (!published) {
        Serial.print(name);
        Serial.print(" couldn't publish force: ");
        Serial.println(force);
      }

      return published;
    }

    bool publishState () {
      sprintf(tempStateValue, "%d", state);

      bool published = mqtt.publish(
        feedName.c_str(),
        tempStateValue,
        true
      );

      if (!published) {
        Serial.print(name);
        Serial.print(" couldn't publish state: ");
        Serial.println(tempStateValue);
      }

      return published;
    }

    void setState(ApplianceState s) {
      state = s;
      publishState();
    }
};

LIS3DH accelWasher(I2C_MODE, ACCEL_I2C_ADDRESS_WASHER);
LIS3DH accelDryer(I2C_MODE, ACCEL_I2C_ADDRESS_DRYER);

Appliance washer(
  "Washer",
  accelWasher,
  WASHER_THRESHOLD,
  WASHER_FEED,
  WASHER_FORCE_FEED
);

Appliance dryer(
  "Dryer",
  accelDryer,
  DRYER_THRESHOLD,
  DRYER_FEED,
  DRYER_FORCE_FEED
);

bool shouldPublishState = false;
void schedulePublishState() {
  shouldPublishState = true;
}

void publishState() {
  washer.publishState();
  dryer.publishState();
}

bool shouldPublishForce = false;
void schedulePublishForce() {
  shouldPublishForce = true;
}

void publishForce() {
  washer.publishForce();
  dryer.publishForce();
}


void setup() {
  Serial.begin(BAUD_RATE);
  delay(10);

  WiFi.mode(WIFI_STA);
  WiFi.begin(WLAN_SSID, WLAN_PASS);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println();
  Serial.println("WiFi connected!");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());

  // Publish to the MQTT feed every five minutes whether we've got a new state
  // or not.
  timer.setInterval(300000, schedulePublishState);

  // Publish the most recent force reading every so often. This is useful for
  // determining a good threshold.
  timer.setInterval(2000, schedulePublishForce);

  OTA_setup();

  Serial.println("Ready!");
}

void loop() {
  timer.run();

  if (shouldPublishState) {
    publishState();
    shouldPublishState = false;
  }

  if (shouldPublishForce) {
    publishForce();
    shouldPublishForce = false;
  }

  washer.update();
  dryer.update();

  OTA_handle();

  delay(50);
}
