const mongoose = require('mongoose');
const NoteSchema = require("../schemas/Note");

const Note = mongoose.model("Note", NoteSchema);

module.exports = Note;