const mongoose = require('mongoose');
const ElectricitySchema = require("../schemas/ElectricitySchema");

const Electricity = mongoose.model("electricity_postcodes", ElectricitySchema);

module.exports = Electricity;