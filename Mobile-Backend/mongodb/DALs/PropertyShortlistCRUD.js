const User = require("../models/User");
const Note = require("../models/Note");

function AddPropertyToShortlist(username, property) {
    const propertyDbModel = property.toDbModel();

    return new Promise((resolve, reject) => {
        User.findOneAndUpdate({username: username}, {$push: {shortlist: propertyDbModel}}, {new: true}, (err, addedProperty) => {
            if (err)
                reject(err);
            resolve(propertyDbModel);
        });
    });
}

function DeletePropertyFromShortlist(username, propertyid) {
    return new Promise((resolve, reject) => {
        User.findOne({username: username}, (err, user) => {
            if (err)
                reject(err);

            const property = user.shortlist.filter(x => x._id.toString() === propertyid.toString())[0];

            if (property === null || property === undefined)
                reject("No property found with this id");
            else {
                const propertyIndex = user.shortlist.indexOf(property);
                user.shortlist.splice(propertyIndex, 1);
                user.markModified('shortlist');
                user.save(() => {
                    resolve("Success");
                });
            }
        });
    });
}

function GetPropertyNotes(username, propertyid) {
    return new Promise((resolve, reject) => {
        User.findOne({username: username}, (err, user) => {
            if (err)
                reject(err);

            const property = user.shortlist.filter(x => x._id.toString() === propertyid.toString())[0];

            if (property === null || property === undefined)
                reject("No property found with this id");
            else {
                resolve(property.notes);
            }
        });
    });
}

function AddNoteToProperty(username, propertyid, note) {
    const noteModel = new Note({created: new Date(), updated: new Date(), content: note});

    return new Promise((resolve, reject) => {
        User.findOne({username: username}, (err, user) => {
            if (err)
                reject(err);

            const property = user.shortlist.filter(x => x._id.toString() === propertyid.toString())[0];

            if (property === null || property === undefined)
                reject("No property found with this id");
            else {
                property.notes.push(noteModel);
                user.markModified("shortlist");
                user.save(() => {
                    resolve("Success");
                })
            }
        });
    });
}

function DeleteNoteOnProperty(username, propertyid, noteid) {
    return new Promise((resolve, reject) => {
        User.findOne({username: username}, (err, user) => {
            if (err)
                reject(err);

            const property = user.shortlist.filter(x => x._id.toString() === propertyid.toString())[0];

            if (property === null || property === undefined)
                reject("No property found with this id");
            else {
                const note = property.notes.filter(x => x._id.toString() === noteid.toString())[0];

                if (note === null || note === undefined)
                    reject("No note found with this id");
                else {
                    const noteIndex = property.notes.indexOf(note);
                    property.notes.splice(noteIndex, 1);
                    user.markModified('shortlist');
                    user.save(() => {
                        resolve("Success");
                    });
                }
            }
        });
    });
}

function UpdateNoteOnProperty(username, propertyid, noteid, note) {
    return new Promise((resolve, reject) => {
        User.findOne({username: username}, (err, user) => {
            if (err)
                reject(err);

            const property = user.shortlist.filter(x => x._id.toString() === propertyid.toString())[0];

            if (property === null || property === undefined)
                reject("No property found with this id");
            else {
                const noteToUpdate = property.notes.filter(x => x._id.toString() === noteid.toString())[0];

                if (noteToUpdate === null || noteToUpdate === undefined)
                    reject("No note found with this id");
                else {
                    const noteIndex = property.notes.indexOf(noteToUpdate);
                    property.notes[noteIndex].content = note;
                    property.notes[noteIndex].updated = new Date();
                    user.markModified('shortlist');
                    user.save(() => {
                        resolve("Success");
                    });
                }
            }
        });
    });
}

module.exports = {
    AddPropertyToShortlist,
    DeletePropertyFromShortlist,
    GetPropertyNotes,
    AddNoteToProperty,
    DeleteNoteOnProperty,
    UpdateNoteOnProperty
};
