#!/bin/sh
args=$([ -z "$1" ] && echo "." || echo "$1")

hyprctl activeworkspace -j | jq -c "$args"
