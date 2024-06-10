#!/bin/sh
args=$([ -z "$1" ] && echo "." || echo "$1")

{ read vLeft; read mLeft; read vRight; read mRight; } < <(amixer sget Master | sed -rn 's/.*\[([0-9]+)%[^o]*(on|off).*/\1\n\2/p')
[ "$mRight" = "on" ] && mRight="false" || mRight="true"
[ "$mLeft" = "on" ] && mLeft="false" || mLeft="true"
echo '{"volume":{"left":'$vLeft',"right":'$vRight'},"muted":{"left":'$mLeft',"right":'$mRight'}}' | jq "$args"
