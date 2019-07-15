var mongoose = require('mongoose');
var Model = mongoose.model;
var PropertySchema = require("../schemas/Property");

var Property = new Model("Property", PropertySchema);

module.exports = Property;