# apc-mqtt

Manage your (quite old ?) APC SmartUPS SC 1000 via MQTT !

## Getting started 

Edit the config.json file to specify your own MQTT settings.

```json
{
  "mqtt": {
    "monitoringTopicPrefix": "apc/monitor",
    "manageTopicPrefix": "apc/manage",
    "brokerAddress": "127.0.0.1",
    "brokerPort": "1883"
  },
  "log": {
    "mode": "console"
  }
}
```

Note : `/availability`and `/set` will be appended to the topics.

Note : supported logging modes are `console` and `syslog`.

#### Install dependencies
```bash
yarn
```

#### Install as a service (optional)
```bash
bash install_service.sh
```

## TODO

- TLS Support for MQTT
- Advanced logging (levels)
