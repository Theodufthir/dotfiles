#!/bin/sh

baseDir=$(dirname $0)
mainBattery=$($baseDir/getMainBattery.sh)
$baseDir/getParamValue.sh $mainBattery 'time to empty'
