const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GasSchema = new Schema({
    POSTCODE: String,
    CONSUMPTION: String,
    METER_COUNT: String,
    MEAN: String,
    MEDIAN: String
});

module.exports = GasSchema;