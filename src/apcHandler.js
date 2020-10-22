const { exec } = require("child_process");
const SysLogger = require('ain2');
const config = require('../config.json')

let logger = console;

if (config.log.mode === "syslog") {
    logger = new SysLogger({tag: 'apc-mqtt'});
}

class ApcHandler {
    constructor(config) {
    }
    setSensitivityLow() {
        exec("echo '5\n4\nL\nq\nq\n' | /sbin/apctest", (error, stdout, stderr) => {
            if (error || stderr) {
                this.error(`stderr: ${error || stderr}`);
                return;
            }
            this.log("info: Set sensitivity to LOW")
        });
    }
    setSensitivityHigh() {
        exec("echo '5\n4\nH\nq\nq\n' | /sbin/apctest", (error, stdout, stderr) => {
            if (error) {
                this.error(`stderr: ${stderr}`);
                return;
            }
            this.log("info: Set sensitivity to HIGH")
        });
    }
    log(msg) {
        console.log(msg)
    }
}

module.exports = {
    'ApcHandler': ApcHandler
}