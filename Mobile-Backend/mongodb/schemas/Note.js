const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NoteSchema = new Schema({
    created: Date,
    updated: Date,
    content: String
});

module.exports = NoteSchema;
