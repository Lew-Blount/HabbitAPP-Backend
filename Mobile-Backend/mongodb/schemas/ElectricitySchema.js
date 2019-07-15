const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ElectricitySchema = new Schema({
    POSTCODE: String,
    CONSUMPTION: String,
    METER_COUNT: String,
    MEAN: String,
    MEDIAN: String
});

module.exports = ElectricitySchema;