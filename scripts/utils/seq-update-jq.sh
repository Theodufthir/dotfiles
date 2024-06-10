#!/bin/sh
seqFile="/tmp/eww-scripts-seq-update-jq-$1"

[ "$3" = "init" ] && (echo "$2" | tee $seqFile) && exit
touch $seqFile #in case not well initialized

flock $seqFile -c "echo \$(cat $seqFile | jq -c '$2') > $seqFile; eww update $1="'"$(cat '$seqFile')"'
