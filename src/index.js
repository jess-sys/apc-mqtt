const config = require('../config.json')
const mqtt = require('./mqttHandler')

let mqttHandler = new mqtt.handler(config)

mqttHandler.listen()