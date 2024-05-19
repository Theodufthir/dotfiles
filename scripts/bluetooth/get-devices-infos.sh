#!/bin/sh
here=$(dirname "$(realpath "$0")")
args=$([ -z "$1" ] && echo "." || echo "$1")

macs=$(bluetoothctl devices | sed -rn 's/Device ([0-9A-F:]+) .*/\1/p')

results=""
for mac in $macs; do
    infos=$(bluetoothctl info "$mac" \
	| grep -v 'UUID' \
	| sed -r 's/"Battery Percentage": "0x.. \(([0-9]+)\)"/"BatteryPercent": \1/' \
	| $here/pseudoyml-to-json.sh)
    results="$results, { \"Mac\": \"$mac\" $infos }"
done
echo "[$results]" | sed -r 's/^\[,/\[/' | jq -c "$args"
