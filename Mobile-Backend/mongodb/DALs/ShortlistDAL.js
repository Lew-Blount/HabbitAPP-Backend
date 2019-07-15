const User = require("../models/User");

function GetShortlist(username) {
    return new Promise((resolve, reject) => {
        User.findOne({username: username}, (err, user) => {
            if (err)
                reject(err);

            const reformattedShortlist = user.shortlist.map(obj => {
                const newObj = {};
                newObj["_id"] = obj._id;
                newObj["propertyName"] = obj.propertyName;
                newObj["fullAddress"] = obj.fullAddress;
                newObj["propertyImageUrl"] = obj.propertyImageUrl;
                newObj["price"] = obj.price;
                return newObj;
            });
            resolve(reformattedShortlist);
        });
    });
}

function GetAreaShortlist(username) {
    return new Promise((resolve, reject) => {
        User.findOne({username: username}, (err, user) => {
            if (err)
                reject(err);

            const reformattedShortlist = user.areaShortlist.map(obj => {
                const newObj = {};
                newObj["_id"] = obj._id;
                newObj["lat"] = obj.lat;
                newObj["long"] = obj.long;
                newObj["postcode"] = obj.postcode;
                newObj["avgPrice"] = obj.avgPrice;
                return newObj;
            });
            resolve(reformattedShortlist);
        });
    });
}

function GetProperty(username, propertyid) {
    return new Promise((resolve, reject) => {
        User.findOne({username: username}, (err, user) => {
            if (err)
                reject(err);

            const property = user.shortlist.filter(x => x._id.toString() === propertyid.toString())[0];

            if (property === null || property === undefined)
                reject("No property found with this id");
            else {
                const propertyIndex = user.shortlist.indexOf(property);
                resolve(user.shortlist[propertyIndex]);
            }
        });
    });
}

function GetArea(username, areaid) {
    return new Promise((resolve, reject) => {
        User.findOne({username: username}, (err, user) => {
            if (err)
                reject(err);

            const area = user.areaShortlist.filter(x => x._id.toString() === areaid.toString())[0];

            if (area === null || area === undefined)
                reject("No area found with this id");
            else {
                const areaIndex = user.areaShortlist.indexOf(area);
                resolve(user.areaShortlist[areaIndex]);
            }
        });
    });
}

module.exports = {
    GetShortlist,
    GetAreaShortlist,
    GetProperty,
    GetArea
};
