#!/usr/bin/env bash

## Check if we have sudo rights
if [ "$EUID" -ne 0 ]
  then echo "This script must be run as root. Exiting"
  exit
fi

## Check if node is installed
if command -v node > /dev/null
  then true
  else
    echo "Package node is not installed. Exiting"
    exit
fi

## Check if yarn is installed
if command -v yarn > /dev/null
  then true
  else
    echo "Package yarn is not installed. Exiting"
    exit
fi

## Prepare a clean directory in /opt with needed files
mkdir /opt/apc-mqtt
cp src /opt/apc-mqtt -R
cp package.json config.json /opt/apc-mqtt

## Copy systemd file
cp apc-mqtt.service /etc/systemd/system/apc-mqtt.service

## Install dependencies
cd /opt/apc-mqtt || echo "Problem with /opt/apc-mqtt directory. Exiting"
yarn

## Enable and start service
systemctl daemon-reload
systemctl enable apc-mqtt
systemctl start apc-mqtt
systemctl status apc-mqtt

