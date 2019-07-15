var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PropertyShortlist = new Schema({
    propertyName: String,
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
    price: String,
    lat: Number,
    long: Number,
    notes: [Object],
    lister_url: String,
    lister_name: String
});

module.exports = PropertyShortlist;