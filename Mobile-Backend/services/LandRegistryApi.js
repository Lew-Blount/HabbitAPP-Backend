const request = require('request');
const saleHistoryModel = require("../models/saleHistory");
const PostcodesIo = require("../services/PostcodesIoApi");

/* Takes in lat, long and radius. Gets all postcodes for the coordinates provided. Creates a promise for each postcode
*(The promises are the requests to the land reg). Then returns all of the promise results combined.
*/
function GetPropertyData(lat, long, radius){
    return PostcodesIo.GetAllPostcodesFromLatLong(lat, long, radius).then((postcodes) => {
        return new Promise((resolve, reject) => {
            var promises = [];

            if (postcodes === null) {
                resolve(postcodes);
            } else {
                postcodes.forEach((postcode) => {
                    promises.push(LandRegTransactionRecordRequest(postcode.replace(" ", "%20")));
                });

                Promise.all(promises).then((result) => {
                    var mergedPromiseResults = [];
                    result.forEach((pResult) => {
                        mergedPromiseResults = mergedPromiseResults.concat(pResult);
                    });
                    resolve(mergedPromiseResults);
                });
            }
        });
    });
}

/*
* Takes in a postcode as a parameter, then runs it against land reg endpoint. Converts the responses to property models
* and then returns array of all the property models.
*/
function LandRegTransactionRecordRequest(postcode) {
    return new Promise(function(resolve, reject) {
        const queryUrl = "http://landregistry.data.gov.uk/data/ppi/transaction-record.json?propertyAddress.postcode=" + postcode + "&_pageSize=200";
        request(queryUrl, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                var landRegResponse = JSON.parse(body);
                var propertiesInPostcode = GetPropertiesFromLandRegResponse(landRegResponse);

                resolve(propertiesInPostcode);
            }
        });
    });
}

/*
* Takes in postcode, runs this against the land reg endpoint along with todays date and the date 5 years ago. takes the response and
* creates an average price paid.
*/
function LandRegAveragePrice(postcode) {
    return new Promise(function(resolve, reject) {
        let today = new Date();
        let maxDate = today.getFullYear() + '-' + ('0' + (today.getMonth()+1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);
        let minDate = (today.getFullYear() - 5) + '-' + ('0' + (today.getMonth()+1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);
        const queryUrl = "http://landregistry.data.gov.uk/data/ppi/transaction-record.json?min-transactionDate=" + minDate + "&max-transactionDate=" + maxDate + "&propertyAddress.postcode=" + postcode + "&_pageSize=5";
        request(queryUrl, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                var landRegResponse = JSON.parse(body);
                let prices = [];
                let sum = 0;
                landRegResponse.result.items.forEach((res) => {
                    prices.push(res.pricePaid);
                })
                prices.forEach((price) => {
                    sum += parseInt(price, 10);
                })
                let avg = sum/prices.length;
                resolve(avg.toFixed(2));
            }
        });
    });
}

/*
* Takes in the response object from a landregistry transaction-record query and then creates a saleHistory model for each
* property. Once all property models are generated it returns an array of them all.
*/
function GetPropertiesFromLandRegResponse(landRegResponse) {
    var transactionsArray = landRegResponse.result.items;
    var allPropertiesInObj = [];

    transactionsArray.forEach(function(item) {
        var address = item.propertyAddress.paon + ", " + item.propertyAddress.street + ", " + item.propertyAddress.locality + ", " + item.propertyAddress.town + ", " + item.propertyAddress.county + ", " + item.propertyAddress.postcode;
        var saleHistoryArray = [{date: item.transactionDate, price: item.pricePaid}];
        var aProperty = new saleHistoryModel.SaleHistory(address.replace(/undefined, /g, ""), item.propertyType.label[0]._value, saleHistoryArray);
        allPropertiesInObj.push(aProperty);
    });

    return MergeDuplicatePropertyData(allPropertiesInObj);
}

/*
* Takes in an array of propertyModels. Checks all of the properties and if a property exists with duplicate address then
* merges sale history into one property model.
* */
function MergeDuplicatePropertyData(propertyModelArray){
    var mergedData = [];
    var indexesToSkip = [];

    propertyModelArray.forEach((property, index) => {
        if(!indexesToSkip.includes(index)){
            var aProperty = property;
            propertyModelArray.forEach((property2, index2) => {
               if(aProperty.fullAddress === property2.fullAddress && index !== index2){
                   aProperty.saleHistory = aProperty.saleHistory.concat(property2.saleHistory);
                   indexesToSkip.push(index2);
               }
            });
            mergedData.push(aProperty);
        }
    });

    mergedData.forEach((x) => {
        x.saleHistory.sort((a, b) => {
            var aDate = new Date(a.date);
            var bDate = new Date(b.date);
            return aDate - bDate;
        });
    });

    return mergedData;
}

module.exports = {
    GetPropertyData: GetPropertyData,
    LandRegAveragePrice: LandRegAveragePrice
};
