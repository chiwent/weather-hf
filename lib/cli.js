#!/usr/bin/env node

'use strict';

const meow = require('meow');
const chalk = require('chalk');
const weather = require('./weather');
const flags = require('./params');
const fs = require('fs');
const path = require('path');

const key_config = require('./config.json')

const config_file = __dirname + '/config.json';

const cli = meow(`
Usage
    $ weather-hf <input>
Options
    --city, -c City you want check
    --area, -a area you want check
    --opt, -o the mode selection:  now:today's weather  forecast:then next few days' weather
    --lang, -l language, en: English, if you ignore this option, it default to Chinese
    --key, -k key
Examples
    $ weather-hf -a Tianhe
`, {
    flags: {
        city: {
            type: 'string',
            alias: 'c'
        },
        area: {
            type: 'string',
            alias: 'a'
        },
        opt: {
            type: 'string',
            alias: 'o',
            default: 'now'
        },
        lang: {
            type: 'string',
            alias: 'l',
            default: ''
        },
        key: {
            type: 'string',
            alias: 'k',
            default: key_config.key
        }
    }
});



try {
    let file_data = fs.readFileSync(config_file, 'utf-8');
    if (!file_data.key && !cli.flags.key) {
        console.log('Please input your key! You only need to enter it once. Next time you can ignore it.');
        process.exit(0);
    }
    if (cli.flags.key) {
        let str = JSON.stringify({ key: cli.flags.key });
        fs.writeFileSync(config_file, str);
    }
} catch (error) {
    console.error(error);
    process.exit(1);
}



if (cli.input.length && cli.input[0] === 'config') {
    flags.getParams(cli.flags)
        .then(result => {
            console.log(chalk.bold.blue(result));
            process.exit(0);
        })
        .catch(error => {
            if (error) {
                console.log(chalk.bold.red(error));
                process.exit(1);
            }
        });
} else {
    weather.getWeather(cli.flags)
        .then(result => {
            result = JSON.parse(result);
            console.log(chalk.red(`Location: ${result.area}, ${result.city}, ${result.province}`));
            console.log(chalk.blue(`Update-Time: ${result.update_loc}`));
            console.log(chalk.green(`Data:`));
            let dat = JSON.stringify(result.data);
            let data = JSON.parse(dat);
            if (dat.length < 250) {
                console.log(chalk.bold.yellow('Today :'));
                console.log(chalk.cyan(data.cond_txt));
                console.log(chalk.cyan(`temperature(温度): ${data.tmp}`));
                console.log(chalk.cyan(`humidity(湿度): ${data.hum}`));
                console.log(chalk.cyan(`pcpn(降水量): ${data.pcpn}`));
                console.log(chalk.cyan(`vis(能见度): ${data.vis}`));
                console.log(chalk.cyan(`wind_dir(风向): ${data.wind_dir}`));
                console.log(chalk.cyan(`wind_sc(风力): ${data.wind_sc}`));
                console.log(chalk.cyan(`wind_spd(风速): ${data.wind_spd}`));
            } else {
                data.forEach((item, index) => {
                    console.log(chalk.green('=============================================='))
                    console.log(chalk.bold.yellow(`The next ${index + 1} day(s) :`));
                    console.log(chalk.cyan(item.cond_txt));
                    console.log(chalk.cyan(`min-temperature(最低温度): ${item.tmp_min}`));
                    console.log(chalk.cyan(`max-temperature(最高温度): ${item.tmp_max}`));
                    console.log(chalk.cyan(`humidity(湿度): ${item.hum}`));
                    console.log(chalk.cyan(`pcpn(降水量): ${item.pcpn}`));
                    console.log(chalk.cyan(`vis(能见度): ${item.vis}`));
                    console.log(chalk.cyan(`wind_dir(风向): ${item.wind_dir}`));
                    console.log(chalk.cyan(`wind_sc(风力): ${item.wind_sc}`));
                    console.log(chalk.cyan(`wind_spd(风速): ${item.wind_spd}`));
                });
            }
            process.exit(0);
        }).catch(error => {
            if (error) {
                console.log(chalk.bold.red(error));
                process.exit(1);
            }
        });
}