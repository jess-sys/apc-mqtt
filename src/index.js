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
        mqttHandler.listen()

        // Send sensor data each x period (defined in config)
        setInterval(async function () {
            try {
                logger.log('info: Getting sensor data')
                mqttHandler.publishStatistics()
            } catch (err) {
                logger.error('error: apc-mqtt crashed! Is the MQTT broker running ?')
                process.exit()
            }
        }, config.publish.period * 1000);
    } catch (e) {
        process.exit()
        console.error('error: apc-mqtt crashed! Is the MQTT broker running ?')
    }
})();