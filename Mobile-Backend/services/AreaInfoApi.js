const request = require('request');
const PostcodesIo = require("../services/PostcodesIoApi");
const LandReg = require("../services/LandRegistryApi");
const areaInfoModel = require("../models/areaInfo");
const Broadband = require("../mongodb/models/Broadband");
const Gas = require("../mongodb/models/Gas");
const Electricity = require("../mongodb/models/Electricity");

function GetAreaData(lat, long) { 
    return PostcodesIo.GetAllPostcodesFromLatLong(lat, long, 100).then((postcodes) => {
        return new Promise( async (resolve, reject) => {
            if (postcodes === null) {
                resolve(postcodes);
            } else {
                let postcode = postcodes[0];
                const promises = [
                    GetBroadband(postcode),
                    GetGas(postcode),
                    GetElectricity(postcode),
                    GetCrimes(lat, long),
                    LandReg.LandRegAveragePrice(postcode)
                ];

                Promise.all(promises).then((promiseResults) => {
                    const areaInfo = new areaInfoModel.AreaInfo(lat, long, postcode, promiseResults[0], promiseResults[1], promiseResults[2], promiseResults[3], promiseResults[4], promiseResults[5]);
                    resolve(areaInfo);
                });
            }
        });
    });
}

async function GetBroadband(postcode) {
    return new Promise((resolve, reject) => {
        postcode = postcode.replace(/\s+/g, '');
        Broadband.find({ postcode: postcode }).then(data => {
            if(data === undefined || data.length == 0) {
                resolve('No Broadband data for this location');
            } else {
                broadband = {
                    super_fast: data[0].SFBB,
                    avg_download: data[0].AvDS,
                    min_download: data[0].MinDS,
                    max_download: data[0].MaxDS,
                    avg_upload: data[0].AvUS,
                    min_upload: data[0].MinUS,
                    max_upload: data[0].MaxUS
                };
                resolve(broadband);
            }

        }).catch(err => {
            reject(err);
        })
    })
}

function GetGas(postcode) {
    return new Promise((resolve, reject) => {
        Gas.find({ POSTCODE: postcode }).then(data => {
            if(data === undefined || data.length == 0) {
                resolve('No Gas data for this location')
            } else {
                gas = {
                    consumption: data[0].CONSUMPTION,
                    meter_count: data[0].METER_COUNT
                }
                resolve(gas); 
            }
        }).catch(err => {
            reject(err);
        })
    })
}

function GetElectricity(postcode) {
    return new Promise((resolve, reject) => {
        Electricity.find({ POSTCODE: postcode }).then(data => {
            if(data === undefined || data.length == 0) {
                resolve('No Electricity data for this location')
            } else {
                electricity = {
                    consumption: data[0].CONSUMPTION,
                    meter_count: data[0].METER_COUNT
                }
                resolve(electricity);
            }

        }).catch(err => {
            reject(err);
        })
    })
}

function GetCrimes(lat, long) {
    return new Promise((resolve, reject) => {
        const queryUrl = "https://data.police.uk/api/crimes-street/all-crime?lat=" + lat + "&lng=" + long;
        request(queryUrl, function (err, res, body) {
            if(!err && res.statusCode === 200) {
                let crimes = JSON.parse(body);
                if(crimes === undefined || crimes.length == 0) {
                    resolve('No Crime data for this location')
                } else {
                    let shortenCrimes = crimes.slice(0, 5);
                    let crimeslist = [];
                    shortenCrimes.forEach((crime) => {
                        let cList = {
                            type: crime.category,
                            location: crime.location.street.name
                        }
                        crimeslist.push(cList);
                    })
                    resolve(crimeslist);
                }
            } else {
                reject(err);
            }
        })
    })
}

module.exports = {
    GetAreaData: GetAreaData
};
