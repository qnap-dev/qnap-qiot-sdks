#!/bin/sh

cd /share/Public
mkdir qiotdebug
export qiotlog="./qiotdebug/qiotdebug.log"
echo ' ========== qiot-mongo ========== ' >> $qiotlog
system-docker logs qiot-mongo >> $qiotlog
echo ' ========== qiot-webportal ========== ' >> $qiotlog
system-docker logs qiot-webportal >> $qiotlog
echo ' ========== qiot-kong ========== ' >> $qiotlog
system-docker logs qiot-kong >> $qiotlog
echo ' ========== qiot-dmm ========== ' >> $qiotlog
system-docker logs qiot-dmm >> $qiotlog
echo ' ==========  qiot-parse ========== ' >> $qiotlog
system-docker logs  qiot-parse >> $qiotlog
echo ' ========== qiot-ponte ========== ' >> $qiotlog
system-docker logs qiot-ponte >> $qiotlog
echo ' ========== kong-database ========== ' >> $qiotlog
system-docker logs kong-database >> $qiotlog
echo ' ========== qiot-redis ========== ' >> $qiotlog
system-docker logs qiot-redis >> $qiotlog
echo ' ========== qiot-node-red ========== ' >> $qiotlog
system-docker logs qiot-node-red >> $qiotlog
echo ' ========== qiot-deploy ========== ' >> $qiotlog
system-docker logs qiot-deploy >> $qiotlog

if [ -n "$(getcfg qiot Install_Path -f /etc/config/qpkg.conf -d "")" ]; then
    qpkgpath=$(getcfg qiot Install_Path -f /etc/config/qpkg.conf -d "")
    echo $qpkgpath
    cp -r $qpkgpath/iot/qrule ./qiotdebug
fi
tar cvf ./qiotdebug.tar ./qiotdebug
rm -rf ./qiotdebug