#!/bin/sh
here=$(dirname "$(realpath "$0")")
args=$([ -z "$1" ] && echo "." || echo "$1")

$here/get-devices-infos.sh "$args"
while read; do
    $here/get-devices-infos.sh "$args"
done < <(nmcli device monitor)
