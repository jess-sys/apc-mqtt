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

        logger.log('info: Starting apc-mqtt')

        await mqttHandler.listen()
        setInterval(function() {
            try {
                fiheifoh
            } catch (err) {
                logger.error('error: apc-mqtt crashed! Is the MQTT broker running ?')
            }
        }, 5 * 1000);
    } catch (e) {
        // Deal with the fact the chain failed
    }
})();