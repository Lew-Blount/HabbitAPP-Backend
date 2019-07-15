const request = require('request');
const propertyModels = require("../models/property");
const markerModel = require("../models/marker");
const uniq =  require("lodash/uniq");

//com
function GetAllNestoriaData(lat, long, radius) {
    radius = radius/1000;
    return new Promise(function (resolve, reject) {
        const queryUrl = "http://api.nestoria.co.uk/api?encoding=json&pretty=1&action=search_listings&number_of_results=50&centre_point=" + lat + ',' + long + ',' + radius + 'km';
        request(queryUrl, function (error, response, body) {
            if(!error && response.statusCode === 200) {
                var nestoriaResponse = JSON.parse(body);
                var propertyInfo = GetPropertiesFromNestoriaResponse(nestoriaResponse);

                if (propertyInfo === null) {
                    reject("Could not get data from nestoria API response");
                }

                resolve(propertyInfo);
            } else {
                reject(error);
            }
        });
    });
}

// FUNCTIONS FOR PROPERTY TAGS
function GetPropertyTags(lat, long, radius) {
    radius = radius/1000;
    return new Promise(function (resolve, reject) {
        const queryUrl = "http://api.nestoria.co.uk/api?encoding=json&pretty=1&action=search_listings&number_of_results=50&centre_point=" + lat + ',' + long + ',' + radius + 'km';
        request(queryUrl, function (error, response, body) {
            if(!error && response.statusCode === 200) {
                var nestoriaResponse = JSON.parse(body);
                var allTags = NestoriaResponseToTagArray(nestoriaResponse);

                if (allTags === null) {
                    reject("Could not get data from nestoria API response");
                }

                resolve(allTags);
            } else {
                reject(error);
            }
        });
    });
}

function NestoriaResponseToTagArray(nestoriaResponse) {
    var propertiesArray = nestoriaResponse.response.listings;
    var allTags = [];

    if (propertiesArray === null || propertiesArray === undefined) {
        return null;
    }

    propertiesArray.forEach(function(listing) {
        var tags = listing.keywords.split(', ');
        tags.forEach(function(tag) {
            allTags.push(tag);
        });
    });
    return uniq(allTags);
}

// FUNCTIONS FOR PROPERTY MARKERS
function GetPropertyMarkers(lat, long, radius, filters = null) {
    radius = radius/1000;
    return new Promise(function (resolve, reject) {
        let queryUrl = "http://api.nestoria.co.uk/api?encoding=json&pretty=1&action=search_listings&number_of_results=50&centre_point=" + lat + ',' + long + ',' + radius + 'km';
        if (filters !== null)
            queryUrl = ApplyFilterObjectToListingsUrl(queryUrl, filters);
        request(queryUrl, function (error, response, body) {
            if(!error && response.statusCode === 200) {
                var nestoriaResponse = JSON.parse(body);
                if (nestoriaResponse.response.total_pages > 1) {
                    const otherPageRequests = [];
                    for (let i = 2; i <= nestoriaResponse.response.total_pages; i++) {
                        otherPageRequests.push(
                            new Promise((resolvePage, rejectPage) => {
                                request(queryUrl + "&page=" + i, (reqErr, reqRes, reqBody) => {
                                    if(!reqErr && reqRes.statusCode === 200) {
                                        var pageBody = JSON.parse(reqBody);
                                        resolvePage(pageBody.response.listings);
                                    } else {
                                        rejectPage(reqErr);
                                    }
                                });
                            })
                        );
                    }
                    Promise.all(otherPageRequests).then((data) => {
                        data.forEach((dataItem) => {
                            nestoriaResponse.response.listings = nestoriaResponse.response.listings.concat(dataItem);
                        });
                        var markers = NestoriaResponseToLatLong(nestoriaResponse);

                        if (markers === null) {
                            reject("Could not read data from nestoria API response");
                        }

                        resolve(markers.slice(0, 50));
                    });
                } else {
                    var markers = NestoriaResponseToLatLong(nestoriaResponse);

                    if (markers === null) {
                        reject("Could not read data from nestoria API response");
                    }

                    resolve(markers);
                }
            } else {
                reject(error);
            }
        });
    });
}

function NestoriaResponseToLatLong(nestoriaResponse) {
    var transactionsArray = nestoriaResponse.response.listings;
    var allMarkers = [];

    if (transactionsArray === null || transactionsArray === undefined) {
        return null;
    }

    transactionsArray.forEach(function(listing) {
        var lat = listing.latitude;
        var long = listing.longitude;
        var matchFound = false;

        const newMarker = new markerModel.Marker(lat, long, false);

        for (let i = 0; i < allMarkers.length; i++) {
            if (CheckLatLongIsZeroPointOneKmAway(allMarkers[i], newMarker)) {
                allMarkers[i].hasMultiple = true;
                matchFound = true;
                break;
            }
        }

        if (!matchFound) {
            allMarkers.push(newMarker);
        }
    });

    return allMarkers;
}

function CheckLatLongIsZeroPointOneKmAway(latLongA, latLongB) {
    const ALatMax = parseFloat(parseFloat(latLongA.lat) + 0.0015);
    const ALatMin = parseFloat(parseFloat(latLongA.lat) - 0.0015);
    const ALongMax = parseFloat(parseFloat(latLongA.long) + 0.0015);
    const ALongMin = parseFloat(parseFloat(latLongA.long) - 0.0015);
    const BLat = parseFloat(latLongB.lat);
    const BLong = parseFloat(latLongB.long);

    if (latLongA.lat < 0 && latLongA.long < 0) {
        return (ALatMax <= BLat && ALatMin >= BLat && ALongMax <= BLong && ALongMin >= BLong);
    } else if (latLongA.lat < 0 && latLongA.long >= 0) {
        return (ALatMax <= BLat && ALatMin >= BLat && ALongMax >= BLong && ALongMin <= BLong);
    } else if (latLongA.long < 0 && latLongA.lat >= 0) {
        return (ALatMax >= BLat && ALatMin <= BLat && ALongMin <= BLong && ALongMax >= BLong);
    } else {
        return (ALatMax >= BLat && ALatMin <= BLat && ALongMax >= BLong && ALongMin <= BLong);
    }
}

// FUNCTIONS FOR MULTIPLE PROPERTIES
function GetPropertiesByLatLongWithRadius(lat, long, radius, filters = null) {
    return new Promise(function (resolve, reject) {
        let queryUrl = "http://api.nestoria.co.uk/api?encoding=json&pretty=1&action=search_listings&number_of_results=50&centre_point=" + lat + ',' + long + ',' + radius.toString() + 'km';
        if (filters !== null)
            queryUrl = ApplyFilterObjectToListingsUrl(queryUrl, filters);
        request(queryUrl, function (error, response, body) {
            if(!error && response.statusCode === 200) {
                var nestoriaResponse = JSON.parse(body);
                var propertyInfo = GetPropertiesFromNestoriaResponse(nestoriaResponse);

                if (propertyInfo === null) {
                    reject("Could not get data from nestoria API response");
                }

                resolve(propertyInfo);
            } else {
                reject(error);
            }
        });
    });
}

// FUNCTIONS FOR INDIVIDUAL PROPERTIES
function GetPropertiesByLatLong(lat, long, filters = null) {
    return new Promise(function (resolve, reject) {
        let queryUrl = "http://api.nestoria.co.uk/api?encoding=json&pretty=1&action=search_listings&number_of_results=50&centre_point=" + lat + ',' + long + ',' + 0.1 + 'km';
        if (filters !== null)
            queryUrl = ApplyFilterObjectToListingsUrl(queryUrl, filters);
        request(queryUrl, function (error, response, body) {
            if(!error && response.statusCode === 200) {
                var nestoriaResponse = JSON.parse(body);
                var propertyInfo = GetPropertiesFromNestoriaResponse(nestoriaResponse);

                if (propertyInfo === null) {
                    reject("Could not get data from nestoria API response");
                }

                resolve(propertyInfo);
            } else {
                reject(error);
            }
        });
    });
}

function GetPropertiesFromNestoriaResponse(nestoriaResponse) {
    var transactionsArray = nestoriaResponse.response.listings;
    var allPropertiesInObj = [];
    var tags = [];

    if (transactionsArray === null || transactionsArray === undefined) {
        return null;
    }

    transactionsArray.forEach(function(listing) {
        var fullAddress = listing.title;
        var propertyType = listing.property_type;
        var bedroomNumber = listing.bedroom_number;
        var bathroomNumber = listing.bathroom_number;
        var parkingSpaces = listing.car_spaces;
        tags = listing.keywords.split(', ');
        var propertyImageUrl = listing.img_url;
        var propertyThumbUrl = listing.thumb_url;
        var isForSale = null;
        var isForRent = null;
        var price = listing.price_formatted;
        if(listing.listing_type === "buy") {
            isForSale = true;
            isForRent = false;
        } else if(listing.listing_type === "rent") {
            isForRent = true;
            isForSale = false;
        }
        var lat = listing.latitude;
        var long = listing.longitude;
        var lister_url = listing.lister_url;
        var lister_name = listing.lister_name;

        var aProperty = new propertyModels.Property(fullAddress,propertyType,bedroomNumber,bathroomNumber,parkingSpaces,tags,propertyImageUrl, propertyThumbUrl, isForSale,isForRent,price, lat, long, lister_url, lister_name);
        allPropertiesInObj.push(aProperty);
    });
    return allPropertiesInObj;
}

function ApplyFilterObjectToListingsUrl(url, filters) {
    if (filters.priceMin !== null)
        url = url + "&price_min=" + filters.priceMin;
    if (filters.priceMax !== null)
        url = url + "&price_max=" + filters.priceMax;
    if (filters.bedMin !== null)
        url = url + "&bedroom_min=" + filters.bedMin;
    if (filters.bedMax !== null)
        url = url + "&bedroom_max=" + filters.bedMax;
    if (filters.bathMin !== null)
        url = url + "&bathroom_min=" + filters.bathMin;
    if (filters.bathMax !== null)
        url = url + "&bathroom_max=" + filters.bathMax;
    if (filters.roomMin !== null)
        url = url + "&room_min=" + filters.roomMin;
    if (filters.roomMax !== null)
        url = url + "&room_max=" + filters.roomMax;
    if (filters.tags !== null)
        url = url + "&keywords=" + filters.tags.join();

    console.log(url);
    return url;
}

module.exports = {
    GetAllNestoriaData: GetAllNestoriaData,
    GetPropertyMarkers: GetPropertyMarkers,
    GetPropertiesByLatLong: GetPropertiesByLatLong,
    GetPropertiesByLatLongWithRadius: GetPropertiesByLatLongWithRadius,
    GetPropertyTags: GetPropertyTags
};
