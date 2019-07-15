const mongoose = require('mongoose');
const BroadbandSchema = require("../schemas/BroadbandSchema");

const Broadband = mongoose.model("broadband_postcodes", BroadbandSchema);

module.exports = Broadband;