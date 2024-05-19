#!/bin/sh

upower -i "$1" | grep "$2" | sed -r 's/^\s*'"$2"':\s*(.*)\s*$/\1/'
