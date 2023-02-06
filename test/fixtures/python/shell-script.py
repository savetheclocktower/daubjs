#!/usr/bin/env python3

# This is a Python implementation of the script from mausberrycircuits.com.
# It appears to be using a blunt tactic of monitoring the GPIO port (polling
# every second from a bash script). Unless I'm crazy, it's better to use
# interrupts here.
#
# The purpose of this script is to shut down the system gracefully when a
# button is pressed. This, combined with the Mausberry Circuits add-on switch,
# allows for safe startup and shutdown of the Raspberry Pi with the push of a
# button. It runs as a daemon on startup.

import os
import signal
import sys

from RPi import GPIO

# The lead marked OUT.
PIN_OUT = 23
# The lead marked IN.
PIN_IN  = 24

def on_exit(signum, stack):
  GPIO.cleanup()
  sys.exit(1)

signal.signal(signal.SIGINT, on_exit)

GPIO.setmode(GPIO.BCM)

# The lead labeled OUT is setup as IN — it's output from the power switch,
# but it's input to us, and vice-versa.
GPIO.setup(PIN_OUT, GPIO.IN, pull_up_down=GPIO.PUD_UP)
GPIO.setup(PIN_IN,  GPIO.OUT)

GPIO.output(PIN_IN, GPIO.HIGH)

# The script will wait here until the shutdown event gets flagged by the
# callback thread. That way we don't waste CPU by polling at an interval.
print("Waiting...")
GPIO.wait_for_edge(PIN_OUT, GPIO.FALLING)

#
# If we get this far, the switch has been set to OFF. Power down the system
# gracefully.
#

# Clean up GPIO just in case.
GPIO.cleanup()

# Use this stub file to keep track of the last shutdown.
os.system("touch '/home/pi/last_poweroff'")

print("Powering off!")
os.system('sudo poweroff')
