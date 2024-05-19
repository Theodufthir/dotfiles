#/bin/sh

saveData=""
while true; do
    newData=$($1)
    [ "$saveData" != "$newData" ] && echo "$newData" && saveData="$newData"
    sleep "$2"
done
