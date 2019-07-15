const mongoose = require('mongoose');
const PropertyShortlistSchema = require("../schemas/PropertyShortlist");

const PropertyShortlist = mongoose.model("PropertyShorlist", PropertyShortlistSchema);

module.exports = PropertyShortlist;