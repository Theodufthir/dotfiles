#!/bin/sh

bluetoothctl $(bluetoothctl info "$1" | grep -q 'Connected: yes' && echo 'disconnect' || echo 'connect') "$1"
