(async () => {
    try {
        const SysLogger = require('ain2');
        const config = require('../config.json')
        const mqtt = require('./mqttHandler')

        let mqttHandler = new mqtt.handler(config)
        let logger = console;

        // Logs to syslog if specified
        if (config.log.mode === "syslog") {
            logger = new SysLogger({tag: 'apc-mqtt'});
        }

        // Listen MQTT commands in the background
        await mqttHandler.listen()

        // Send sensor data each x period (defined in config)
        setInterval(function() {
            try {
                mqttHandler.publishStatistics()
            } catch (err) {
                process.exit()
                logger.error('error: apc-mqtt crashed! Is the MQTT broker running ?')
            }
        }, config.publish.period * 1000);
    } catch (e) {
        process.exit()
        console.error('error: apc-mqtt crashed! Is the MQTT broker running ?')
    }
})();