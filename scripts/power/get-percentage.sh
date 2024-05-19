#!/bin/sh

baseDir=$(dirname $0)
mainBattery=$($baseDir/getMainBattery.sh)
$baseDir/getParamValue.sh $mainBattery 'percentage' | sed -r 's/([0-9]+)%/\1/'
