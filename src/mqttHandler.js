const mqtt = require('mqtt')
const SysLogger = require('ain2');
const config = require('../config.json')
const apc = require('./apcHandler')

let logger = console;

if (config.log.mode === "syslog") {
    logger = new SysLogger({tag: 'apc-mqtt'});
}

class Message {
    constructor(manageTopic) {
        this.manageTopic = manageTopic
    }
    parse(topic, message) {
        // Error handling
        if (topic !== this.manageTopic) { return }
        let parsedMessage = JSON.parse(message)
        if (!("bypassMode" in parsedMessage) || typeof parsedMessage.bypassMode !== "boolean") { return }

        // Create new APC Command
        let ApcHandler = new apc.ApcHandler()

        // If !bypass, program APC EEPROM
        if (parsedMessage.bypassMode === false)
            ApcHandler.setSensitivityHigh()

        // If bypass, program APC EEPROM
        else if (parsedMessage.bypassMode === true)
            ApcHandler.setSensitivityLow()

        this.log(topic, message, parsedMessage.bypassMode)
    }
    log(topic, message, state) {
        logger.log("info: Valid MQTT setting received (bypassMode: " + state + ")")
    }
}

class Handler {
    constructor(config) {
        // import props
        this.monitoringTopic = config.mqtt.monitoringTopicPrefix
        this.manageTopic = config.mqtt.manageTopicPrefix
        this.address = config.mqtt.brokerAddress
        this.port = config.mqtt.brokerPort

        logger.log(`info: Connecting to MQTT (mqtt://${this.address}:${this.port})`)
    }
    listen() {
        let client  = mqtt.connect(`mqtt://${this.address}:${this.port}`)
        let address = this.address
        let port = this.port
        let manageTopic = this.manageTopic + "/set"
        let availabilityTopic = this.monitoringTopic + "/available"

        // On connection, send availability
        client.on('connect', function () {
            client.subscribe(manageTopic, function (err) {
                if (!err) {
                    client.publish(availabilityTopic, JSON.stringify({bypassMode: true}))
                    logger.log(`info: Connecting to MQTT (mqtt://${address}:${port})... OK`)
                    logger.log(`info: Listening for messages (on ${manageTopic})`)
                }
            })
        })

        // On message, parse it
        client.on('message', function (topic, message) {
            let newMessage = new Message(manageTopic)
            newMessage.parse(topic, message)
        })
    }
}

module.exports = {
    'handler': Handler
}