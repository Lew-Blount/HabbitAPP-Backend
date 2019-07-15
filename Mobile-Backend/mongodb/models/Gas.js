const mongoose = require('mongoose');
const GasSchema = require("../schemas/GasSchema");

const Gas = mongoose.model("gas_postcodes", GasSchema);

module.exports = Gas;