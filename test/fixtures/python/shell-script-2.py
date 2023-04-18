#!/usr/bin/env python3
"""
The daemon responsible for changing the volume in response to a turn or press
of the volume knob.

The volume knob is a rotary encoder. It turns infinitely in either direction.
Turning it to the right will increase the volume; turning it to the left will
decrease the volume. The knob can also be pressed like a button in order to
turn muting on or off.

The knob uses two GPIO pins and we need some extra logic to decode it. The
button we can just treat like an ordinary button. Rather than poll
constantly, we use threads and interrupts to listen on all three pins in one
script.
"""

import os
import signal
import subprocess
import sys
import threading

from RPi import GPIO
from queue import Queue

DEBUG = os.environ.get('DEBUG') == '1'

# SETTINGS
# ========

# The two pins that the encoder uses (BCM numbering).
GPIO_A = 19
GPIO_B = 26

# The pin that the knob's button is hooked up to. If you have no button, set
# this to None.
GPIO_BUTTON = 13

# The minimum and maximum volumes, as percentages.
#
# The default max is less than 100 to prevent distortion. The default min is
# greater than zero because if your system is like mine, sound gets
# completely inaudible _long_ before 0%. If you've got a hardware amp or
# serious speakers or something, your results will vary.
VOLUME_MIN = 60
VOLUME_MAX = 96

# The amount you want one click of the knob to increase or decrease the
# volume. I don't think that non-integer values work here, but you're welcome
# to try.
VOLUME_INCREMENT = 1

# (END SETTINGS)
#


class RotaryEncoder():
    """
    A class to decode mechanical rotary encoder pulses.

    Ported to RPi.GPIO from the pigpio sample here:
    http://abyz.co.uk/rpi/pigpio/examples.html
    """

    def __init__(self, gpio_a, gpio_b, callback=None, gpio_button=None,
                 button_callback=None):
        self.last_gpio = None
        self.gpio_a = gpio_a
        self.gpio_b = gpio_b
        self.gpio_button = gpio_button

        self.callback = callback
        self.button_callback = button_callback

        self.lev_a = 0
        self.lev_b = 0

        GPIO.setmode(GPIO.BCM)
        GPIO.setup(self.gpio_a, GPIO.IN, pull_up_down=GPIO.PUD_UP)
        GPIO.setup(self.gpio_b, GPIO.IN, pull_up_down=GPIO.PUD_UP)

        GPIO.add_event_detect(self.gpio_a, GPIO.BOTH, self._callback)
        GPIO.add_event_detect(self.gpio_b, GPIO.BOTH, self._callback)

        if self.gpio_button:
            GPIO.setup(self.gpio_button, GPIO.IN, pull_up_down=GPIO.PUD_UP)
            GPIO.add_event_detect(self.gpio_button, GPIO.FALLING,
                                  self._button_callback, bouncetime=500)

    def destroy(self):
        GPIO.remove_event_detect(self.gpio_a)
        GPIO.remove_event_detect(self.gpio_b)
        GPIO.cleanup((self.gpio_a, self.gpio_b, self.gpio_button))

    def _button_callback(self, channel):
        self.button_callback(GPIO.input(channel))

    def _callback(self, channel):
        level = GPIO.input(channel)
        if (channel == self.gpio_a):
            self.lev_a = level
        else:
            self.lev_b = level

        if level != 1:
            return

        # When both inputs are at 1, we'll fire a callback. If A was the most
        # recent pin set high, it'll be forward, and if B was the most recent
        # pin set high, it'll be reverse.
        if (channel != self.last_gpio):  # (debounce)
            self.last_gpio = channel
            if channel == self.gpio_a and self.lev_b == 1:
                self.callback(1)
            elif channel == self.gpio_b and self.lev_a == 1:
                self.callback(-1)


class VolumeError(Exception):
    pass


class Volume:
    INCREMENT = VOLUME_INCREMENT
    MIN = VOLUME_MIN
    MAX = VOLUME_MAX

    def __init__(self):
        # Set an initial value for last volume in case we're muted when we
        # start.
        self.last_volume = self.MIN
        self._sync()

    def up(self):
        """Turn the volume up by one increment."""
        return self._change(self.INCREMENT)

    def down(self):
        """Turn the volume down by one increment."""
        return self._change(-self.INCREMENT)

    def _change(self, delta):
        v = self.volume + delta
        if v < self.MIN:
            v = self.MIN
        if v > self.MAX:
            v = self.MAX
        return self.set_volume(v)

    def set_volume(self, v):
        self.volume = v
        output = self._amixer("set 'PCM' unmute {}%".format(v))
        self._sync(output)
        debug("Volume: {}".format(self.status()))
        return self.volume

    def toggle(self):
        """
        Changes the volume to muted or unmuted (whichever is the
        opposite of its current state).
        """
        if self.is_muted:
            output = self._amixer("set 'PCM' unmute")
        else:
            # We're about to mute ourselves. We should remember the last volume
            # value we had so we can restore it later.
            self.last_volume = self.volume
            output = self._amixer("set 'PCM' mute")

        self._sync(output)

        if not self.is_muted:
            # We've just unmuted ourselves, so we should restore whatever
            # volume we had previously.
            self.set_volume(self.last_volume)

        debug("Volume: {}".format(self.status()))
        return self.is_muted

    def status(self):
        """Returns a description of the current volume level and mute state."""
        if self.is_muted:
            return "{}% (muted)".format(self.volume)
        return "{}%".format(self.volume)

    # Asks the system for its current volume in order to synchronize it with
    # this class's state.
    def _sync(self, output=None):
        # Any `amixer` command will return the same status output, so other
        # methods can optionally pass in the output from a call they made to
        # `amixer` in order to save us the trouble.
        if output is None:
            output = self._amixer("get 'PCM'")

        # Inspect the output with some simple string parsing. We forgo
        # regular expressions here because we'll be hitting this code path
        # quite a bit and we want it to be as fast as possible.
        lines = output.readlines()

        # We only care about the last line of output.
        last = lines[-1].decode('utf-8')

        # The volume and mute state are both in the last line, each one
        # surrounded by brackets. So we'll start from different ends of the
        # line to find them.
        i1 = last.rindex('[') + 1
        i2 = last.rindex(']')

        self.is_muted = last[i1:i2] == 'off'

        i1 = last.index('[') + 1
        i2 = last.index('%')

        # In between these two will be the percentage value.
        pct = last[i1:i2]
        self.volume = int(pct)

    # Shell out to `amixer` to set/get volume.
    def _amixer(self, cmd):
        p = subprocess.Popen("amixer {}".format(cmd), shell=True,
                             stdout=subprocess.PIPE)
        status = p.wait()
        if status != 0:
            raise VolumeError("Unknown error")
            sys.exit(0)

        return p.stdout


if __name__ == "__main__":

    queue = Queue()
    event = threading.Event()

    def debug(str):
        if not DEBUG:
            return
        print(str)

    # Runs in the main thread to handle the work assigned to us by the
    # callbacks.
    def consume_queue():
        # If we fall behind and have to process many queue entries at once,
        # we can catch up by only calling `amixer` once at the end.
        while not queue.empty():
            delta = queue.get()
            if delta == 0:
                v.toggle()
            elif delta == 1:
                v.up()
            elif delta == -1:
                v.down()

    # on_turn and on_press run in the background thread. We want them to do
    # as little work as possible, so all they do is enqueue the volume delta.
    def on_turn(delta):
        queue.put(delta)
        event.set()

    def on_press(value):
        # We'll use a value of 0 to signal that the main thread should toggle
        # its mute state.
        queue.put(0)
        event.set()

    def on_exit(a, b):
        print("Exiting...")
        encoder.destroy()
        sys.exit(0)

    debug("Knob using pins {} and {}".format(GPIO_A, GPIO_B))

    if (GPIO_BUTTON is not None):
        debug("Knob button using pin {}".format(GPIO_BUTTON))

    v = Volume()
    debug("Initial volume: {}".format(v.volume))

    encoder = RotaryEncoder(
        GPIO_A,
        GPIO_B,
        gpio_button=GPIO_BUTTON,
        callback=on_turn,
        button_callback=on_press
    )
    signal.signal(signal.SIGINT, on_exit)

    while True:
        # This is the best way I could come up with to ensure that this
        # script runs indefinitely without wasting CPU by polling. The main
        # thread will block quietly while waiting for the event to get
        # flagged. When the knob is turned we 're able to respond immediately,
        # but when it's not being turned we're not looping at all.
        #
        # The 1200-second (20 minute) timeout is a hack. For some reason, if
        # I don't specify a timeout, I'm unable to get the SIGINT handler
        # above to work properly. But if there is a timeout set, even if it's
        # a very long timeout, then Ctrl-C works as intended. No idea why.
        event.wait(1200)

        # If we're here because a callback told us to wake up, we should
        # consume whatever messages are in the queue. If we're here because
        # there were 20 minutes of inactivity, no problem; we'll just consume
        # an empty queue and go right back to sleep.
        consume_queue()
        event.clear()
