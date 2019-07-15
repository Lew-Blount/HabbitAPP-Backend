const request = require('request');

// Gets all of the postcodes in a radius from a lat long. The radius works in metres, 2000 is the max. 2000m = 2km.
function GetAllPostcodesFromLatLong(lat, long, radius){
    return new Promise(function(resolve, reject) {
        const queryUrl = "http://api.postcodes.io/postcodes?lon=" + long + "&lat=" + lat + "&radius=" + radius;
        request(queryUrl, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                const postcodeArray = PostcodeResponseToArray(body);
                if (postcodeArray === null) {
                    resolve(null);
                } else {
                    resolve(postcodeArray);
                }
            } else {
                reject(error);
            }
        });
    });
}

function GetLatLongFromPostcode(postcode) {
    return new Promise(function(resolve, reject) {
        const queryUrl = "http://api.postcodes.io/postcodes/" + postcode;
        request(queryUrl, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                const responseObj = JSON.parse(body);
                const result = { lat: responseObj.result.latitude, long: responseObj.result.longitude };
                resolve(result);
            } else {
                reject(error);
            }
        });
    });
}

// Converts the response from api.postcodes.io/postcodes to just an array of postcodes
function PostcodeResponseToArray(response){
    var responseObj = JSON.parse(response);
    var responseArray = responseObj.result;

    if (responseArray === null) {
        return responseArray;
    } else {
        var postcodeArray = [];

        responseArray.forEach((item) => {
            postcodeArray.push(item.postcode);
        });

        return postcodeArray;
    }
}

module.exports = {
    GetAllPostcodesFromLatLong: GetAllPostcodesFromLatLong,
    GetLatLongFromPostcode : GetLatLongFromPostcode
};
