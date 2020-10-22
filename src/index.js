(async () => {
    try {
        const SysLogger = require('ain2');
        const config = require('../config.json')
        const mqtt = require('./mqttHandler')
        let mqttHandler = new mqtt.handler(config)
        let logger = console;

        if (config.log.mode === "syslog") {
            logger = new SysLogger({tag: 'apc-mqtt'});
        }

        await mqttHandler.listen()
        setInterval(function() {
            try {
                mqttHandler.publishStatistics()
            } catch (err) {
                process.exit()
                logger.error('error: apc-mqtt crashed! Is the MQTT broker running ?')
            }
        }, 5 * 1000);
    } catch (e) {
        process.exit()
        console.error('error: apc-mqtt crashed! Is the MQTT broker running ?')
    }
})();