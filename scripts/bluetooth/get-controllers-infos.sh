#!/bin/sh
here=$(dirname "$(realpath "$0")")
args=$([ -z "$1" ] && echo "." || echo "$1")

macs=$(bluetoothctl list | sed -rn 's/Controller ([0-9A-F:]+) .*/\1/p')

results=""
for mac in $macs; do
    infos=$(bluetoothctl show "$mac" \
	| $here/pseudoyml-to-json.sh)
    results="$results, { \"Mac\": \"$mac\" $infos }"
done
echo "[$results]" | sed -r 's/^\[,/\[/' | jq -c "$args"
