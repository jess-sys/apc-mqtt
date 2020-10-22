const { exec } = require("child_process");
const SysLogger = require('ain2');
const config = require('../config.json')

let logger = console;

if (config.log.mode === "syslog") {
    logger = new SysLogger({tag: 'apc-mqtt'});
}

class ApcHandler {
    constructor(props) {
        this.props = props
    }

    cmd(command) {
        exec(command, (error, stdout, stderr) => {
            if (stderr) {
                this.error(`stderr: ${stderr}`);
            }
        });
    }

    // Set UPS sensitivity to LOW via serial commands
    setSensitivityLow() {
        this.cmd("echo '5\n4\nL\nq\nq\n' | /sbin/apctest")
        this.log("info: Set sensitivity to LOW")
    }

    // Set UPS sensitivity to HIGH via serial commands
    setSensitivityHigh() {
        this.cmd("echo '5\n4\nH\nq\nq\n' | /sbin/apctest")
        this.log("info: Set sensitivity to LOW")
    }

    log(msg) {
        logger.log(msg)
    }

    error(msg) {
        logger.error(msg)
    }
}

module.exports = {
    'ApcHandler': ApcHandler
}