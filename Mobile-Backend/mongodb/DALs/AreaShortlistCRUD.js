const User = require("../models/User");
const Note = require("../models/Note");

function AddAreaToShortlist(username, area) {
    const areaDbModel = area.toDbModel();

    return new Promise((resolve, reject) => {
        User.findOneAndUpdate({username: username}, {$push: {areaShortlist: areaDbModel}}, {new: true}, (err, addedArea) => {
            if (err)
                reject(err);
            resolve(areaDbModel);
        });
    });
}

function DeleteAreaFromShortlist(username, areaid) {
    return new Promise((resolve, reject) => {
        User.findOne({username: username}, (err, user) => {
            if (err)
                reject(err);

            const area = user.areaShortlist.filter(x => x._id.toString() === areaid.toString())[0];

            if (area === null || area === undefined)
                reject("No area found with this id");
            else {
                const areaIndex = user.areaShortlist.indexOf(area);
                user.areaShortlist.splice(areaIndex, 1);
                user.markModified('areaShortlist');
                user.save(() => {
                    resolve("Success");
                });
            }
        });
    });
}

function GetAreaNotes(username, areaid) {
    return new Promise((resolve, reject) => {
        User.findOne({username: username}, (err, user) => {
            if (err)
                reject(err);

            const area = user.areaShortlist.filter(x => x._id.toString() === areaid.toString())[0];

            if (area === null || area === undefined)
                reject("No area found with this id");
            else {
                resolve(area.notes);
            }
        });
    });
}

function AddNoteToArea(username, areaid, note) {
    const noteModel = new Note({created: new Date(), updated: new Date(), content: note});

    return new Promise((resolve, reject) => {
        User.findOne({username: username}, (err, user) => {
            if (err)
                reject(err);

            const area = user.areaShortlist.filter(x => x._id.toString() === areaid.toString())[0];

            if (area === null || area === undefined)
                reject("No area found with this id");
            else {
                area.notes.push(noteModel);
                user.markModified("areaShortlist");
                user.save(() => {
                    resolve("Success");
                })
            }
        });
    });
}

function DeleteNoteOnArea(username, areaid, noteid) {
    return new Promise((resolve, reject) => {
        User.findOne({username: username}, (err, user) => {
            if (err)
                reject(err);

            const area = user.areaShortlist.filter(x => x._id.toString() === areaid.toString())[0];

            if (area === null || area === undefined)
                reject("No area found with this id");
            else {
                const note = area.notes.filter(x => x._id.toString() === noteid.toString())[0];

                if (note === null || note === undefined)
                    reject("No note found with this id");
                else {
                    const noteIndex = area.notes.indexOf(note);
                    area.notes.splice(noteIndex, 1);
                    user.markModified('areaShortlist');
                    user.save(() => {
                        resolve("Success");
                    });
                }
            }
        });
    });
}

function UpdateNoteOnArea(username, areaid, noteid, note) {
    return new Promise((resolve, reject) => {
        User.findOne({username: username}, (err, user) => {
            if (err)
                reject(err);

            const area = user.areaShortlist.filter(x => x._id.toString() === areaid.toString())[0];

            if (area === null || area === undefined)
                reject("No area found with this id");
            else {
                const noteToUpdate = area.notes.filter(x => x._id.toString() === noteid.toString())[0];

                if (noteToUpdate === null || noteToUpdate === undefined)
                    reject("No note found with this id");
                else {
                    const noteIndex = area.notes.indexOf(noteToUpdate);
                    area.notes[noteIndex].content = note;
                    area.notes[noteIndex].updated = new Date();
                    user.markModified('areaShortlist');
                    user.save(() => {
                        resolve("Success");
                    });
                }
            }
        });
    });
}

module.exports = {
    AddAreaToShortlist,
    DeleteAreaFromShortlist,
    GetAreaNotes,
    AddNoteToArea,
    DeleteNoteOnArea,
    UpdateNoteOnArea
};
