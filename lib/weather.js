'use strict';

const axios = require('axios');
const Conf = require('conf');
const param = require('./params.js');
const key_config = require('../config.json');

const API = 'https://free-api.heweather.com/s6/weather';
const config = new Conf();

module.exports = {
    getWeather: (flags) => {
        return new Promise((resolve, reject) => {
            // console.log(JSON.stringify(flags)); // undefined
            let city = flags.city;
            let area = flags.area;
            let location = area || city;
            let opt = flags.opt;
            let lang = flags.lang || 'zh';
            let key = flags.key || key_config.key;
            let final_api;
            if (!location) {
                return reject(new Error('missing location'))
            }
            if (!key) {
                return reject(new Error('missing key, website: https://www.heweather.com/douments/api/'))
            }
            if (lang) {
                final_api = `${API}/${opt}/?location=${location}&lang=${lang}&key=${key}`
            } else {
                final_api = `${API}/${opt}/?location=${location}&key=${key}`
            }
            final_api = encodeURI(final_api);
            axios.get(final_api)
                .then(response => {
                    let datas;
                    let basic = response.data.HeWeather6[0].basic;
                    let update = response.data.HeWeather6[0].update;
                    if (response.data.HeWeather6[0].now) {
                        datas = response.data.HeWeather6[0].now;
                    } else if (response.data.HeWeather6[0].daily_forecast) {
                        datas = response.data.HeWeather6[0].daily_forecast;
                    }
                    let result = JSON.stringify({ "area": basic.location, "city": basic.parent_city, "province": basic.admin_area, "update_loc": update.loc, "data": datas });
                    resolve(result);
                })
                .catch(error => reject(error));
        });
    }
}