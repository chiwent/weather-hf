'use strict';

const Conf = require('conf');
const input = require('./config.json')

const config = new Conf();

module.exports = {
    getParams: (flags) => {
        return new Promise((resolve, reject) => {
            if (!flags || !flags.area) {
                reject(new Error('missing location'));
            }
            config.set('city', flags.city);
            config.set('area', flags.area);
            config.set('opt', flags.opt);
            config.set('lang', flags.lang);
            config.set('key', input.key);
            resolve(`All flags: ${flags.city}, ${flags.area}, ${flags.opt}, ${flags.lang}, ${input.key}`);
        });
    }
}