# apc-mqtt

Manage your (quite old ?) APC SmartUPS SC 1000 via MQTT !

## Getting started 

Edit the config.json file to specify your own MQTT settings.

```json
{
  "mqtt": {
    "monitoringTopicPrefix": "apc/monitor",
    "manageTopicPrefix": "apc/manage",
    "brokerAddress": "172.30.42.120",
    "brokerPort": "1883"
  },
  "log": {
    "mode": "console"
  },
  "publish": {
    "period": 60
  },
  "commands": {
    "setHigh": "echo '5\n4\nH\nq\nq\n' | /sbin/apctest",
    "setLow": "echo '5\n4\nL\nq\nq\n' | /sbin/apctest",
    "getSensorData": "echo '1\nq\n' | /sbin/apctest"
  }
}
```

Note : `/availability`and `/set` will be appended to the topics.

Note : Supported logging modes are `console` and `syslog`. Publish period is in seconds.

#### Install as a service (optional)

This script will install the service file, copy the project to /opt, install dependencies
and enable (and start) the service for you.

```bash
sudo ./install_service.sh
```

## TODO

- TLS Support for MQTT
- Advanced logging (levels)

## Credits

Thanks to https://networkupstools.org/protocols/apcsmart.html for providing the APC Smart commands reference!
