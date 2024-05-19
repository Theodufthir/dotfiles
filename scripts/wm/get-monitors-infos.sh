#!/bin/sh
args=$([ -z "$1" ] && echo "." || echo "$1")

hyprctl monitors -j | jq -c "$args"
