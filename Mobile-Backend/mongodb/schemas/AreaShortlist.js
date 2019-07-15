var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AreaShortlist = new Schema({
    lat: Number,
    long: Number,
    postcode: String,
    broadband: Object,
    gas: Object,
    electricity: Object,
    crime: [Object],
    avgPrice: Number,
    notes: [Object]
});

module.exports = AreaShortlist;
