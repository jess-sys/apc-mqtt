const util = require('util');
const exec = util.promisify(require('child_process').exec);
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

    async getSensorData() {
        let allowed_keys = ["output_voltage", "batt_level_percent", "ups_load",
            "line_freq", "runtime_left", "ups_status", "batt_voltage", "alarm_status",
            "nominal_battery_voltage"]
        let result = {}
        let {error, stdout, stderr} = await exec(config.commands.getSensorData);
        if (stderr) {
            this.error(`stderr: ${stderr}`);
            return result;
        }
        stdout.toString().split("\n").forEach((line) => {
            if (line.includes(": ")) {
                let key = line.split(': ')[0].toLocaleLowerCase().split(' ').join('_')
                if (allowed_keys.includes(key))
                    result[key] = line.split(': ')[1].toLocaleLowerCase().split(' ').join('_')
            }
        })
        return result;
    }

    // Set UPS sensitivity to LOW via serial commands
    setSensitivityLow() {
        this.cmd(config.commands.setLow)
        this.log("info: Set sensitivity to LOW")
    }

    // Set UPS sensitivity to HIGH via serial commands
    setSensitivityHigh() {
        this.cmd(config.commands.setHigh)
        this.log("info: Set sensitivity to HIGH")
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