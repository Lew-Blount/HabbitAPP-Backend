var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BroadbandSchema = new Schema({
    postcode: String,
    NGA: Number,
    SFBB: Number,
    UFBB: Number,
    AvDS: String,
    MinDS: String,
    MaxDS: String,
    AvUS: String,
    MinUS: String,
    MaxUS: String
});

module.exports = BroadbandSchema;