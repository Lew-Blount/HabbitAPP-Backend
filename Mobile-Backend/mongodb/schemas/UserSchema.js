const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Services
const bcrypt = require("bcrypt-nodejs");

const UserSchema = new Schema({
    username: {type: String, unique: true, required: true },
    password: {type: String, required: true },
    shortlist: [Object],
    areaShortlist: [Object]
});

UserSchema.methods.validPassword = function( pwd ) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(pwd, this.password, (err, res) => resolve(res));
    });
};

module.exports = UserSchema;
