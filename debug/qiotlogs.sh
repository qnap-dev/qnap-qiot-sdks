#!/bin/sh

if [ -z "$(getcfg qiot Install_Path -f /etc/config/qpkg.conf -d "")" ]; then
    echo "QIoT installed path not found"
    exit 2
fi

QPKG_PATH=$(getcfg qiot Install_Path -f /etc/config/qpkg.conf -d "")
echo "QPKG_PATH: ${QPKG_PATH}"
cd /share/Public
rm -rf qiotdebug && mkdir qiotdebug

service="qiot-parse"
echo " ========== $service ========== "
mkdir -p qiotdebug/$service/log
cp -r $QPKG_PATH/supervisord/log/$service/* qiotdebug/$service/log/
cp -r $QPKG_PATH/qiot-umm/logs/* qiotdebug/$service/log/


service="qiot-ponte"
echo " ========== $service ========== "
mkdir -p qiotdebug/$service/log
cp -r $QPKG_PATH/supervisord/log/$service/* qiotdebug/$service/log/

service="qiot-kong"
echo " ========== $service ========== "
mkdir -p qiotdebug/$service/log
cp -r $QPKG_PATH/supervisord/log/$service/* qiotdebug/$service/log/
cp -r $QPKG_PATH/iot/kong/* qiotdebug/$service/log/

service="qiot-node-red"
echo " ========== $service ========== "
mkdir -p qiotdebug/$service/log
mkdir -p qiotdebug/$service/config
cp -r $QPKG_PATH/supervisord/log/$service/* qiotdebug/$service/log/
cp -r $QPKG_PATH/iot/qrule/log/* qiotdebug/$service/log/
cp -r $QPKG_PATH/qiot-node-red/config/supervisor/* qiotdebug/$service/config/

service="qiot-deploy"
echo " ========== $service ========== "
mkdir -p qiotdebug/$service/log
cp -r $QPKG_PATH/supervisord/log/$service/* qiotdebug/$service/log/
cp -r $QPKG_PATH/qiot-deploy/log/* qiotdebug/$service/log/

service="qiot-dmm"
echo " ========== $service ========== "
mkdir -p qiotdebug/$service/log
cp -r $QPKG_PATH/supervisord/log/$service/* qiotdebug/$service/log/
cp -r $QPKG_PATH/iot/cert/logs/* qiotdebug/$service/log/

service="qiot-redis"
echo " ========== $service ========== "
mkdir -p qiotdebug/$service/log
cp -r $QPKG_PATH/supervisord/log/$service/* qiotdebug/$service/log/

service="kong-database"
echo " ========== $service ========== "
mkdir -p qiotdebug/$service/log
cp -r $QPKG_PATH/supervisord/log/$service/* qiotdebug/$service/log/

service="qiot-mongo"
echo " ========== $service ========== "
mkdir -p qiotdebug/$service/log
cp -r $QPKG_PATH/supervisord/log/$service/* qiotdebug/$service/log/

service="qiot-webportal"
echo " ========== $service ========== "
mkdir -p qiotdebug/$service/log
cp -r $QPKG_PATH/supervisord/log/$service/* qiotdebug/$service/log/

service="qiot-watchdog"
echo " ========== $service ========== "
mkdir -p qiotdebug/$service/log
cp $QPKG_PATH/install.log qiotdebug/$service/log/
cp $QPKG_PATH/iot/watchdog.log qiotdebug/$service/log/

set -e
tar cvf ./qiotdebug.tar ./qiotdebug > /dev/null
rm -rf ./qiotdebug
echo "Debug package path: $(readlink -f ./qiotdebug.tar)"
