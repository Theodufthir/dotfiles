#!/bin/sh
args=$([ -z "$1" ] && echo "." || echo "$1")

hyprctl clients -j | jq -c "$args"
