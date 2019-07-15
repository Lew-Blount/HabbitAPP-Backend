var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Property = new Schema({
    fullAddress: String,
    propertyType: String,
    bedroomNumber: Number,
    bathroomNumber: Number,
    parkingSpaces: Number,
    tags: [String],
    propertyImageUrl: String,
    propertyThumbUrl: String,
    isForSale: Boolean,
    isForRent: Boolean,
    price: Number,
    lat: Number,
    long: Number,
    lister_url: String,
    lister_name: String
});

module.exports = Property;