#!/bin/sh

activeMonitor=$(hyprctl activeworkspace -j | jq '.monitorID')
{ read cx; read cy; } < <(hyprctl cursorpos -j | jq '.x, .y')
{ read mx; read my; read scale; } < <(hyprctl monitors -j | jq ".[] | select(.id == $activeMonitor) | .x, .y, .scale")

scale=$(echo "$scale" | sed -rn 's/^([0-9]+).*/\1/p')
xScaled=$((cx - mx))
yScaled=$((cy - my))
x=$((xScaled * scale))
y=$((yScaled * scale))

echo '{ "x": '$x', "y": '$y', "xScaled": '$xScaled', "yScaled": '$yScaled' }' | jq "$1"
