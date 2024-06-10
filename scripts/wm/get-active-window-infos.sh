#!/bin/sh
args=$([ -z "$1" ] && echo "." || echo "$1")

hyprctl activewindow -j | jq -c "$args"
