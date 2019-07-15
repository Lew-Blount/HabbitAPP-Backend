const mongoose = require('mongoose');
const AreaShortlistSchema = require("../schemas/AreaShortlist");

const AreaShortlist = mongoose.model("AreaShorlist", AreaShortlistSchema);

module.exports = AreaShortlist;
