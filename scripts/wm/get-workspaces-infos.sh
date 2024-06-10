#!/bin/sh
args=$([ -z "$1" ] && echo "." || echo "$1")

hyprctl workspaces -j | jq -c "$args"
