const express = require('express');
const router = express.Router();
const ShortlistDAL = require('../mongodb/DALs/ShortlistDAL');
const PropertyCRUD = require('../mongodb/DALs/PropertyShortlistCRUD');
const AreaCRUD = require('../mongodb/DALs/AreaShortlistCRUD');
const PropertyShortlist = require("../models/propertyShortlist");
const AreaShortlist = require("../models/areaShortlist");

// ----------------------------------------------------------------- PROPERTY SHORTLIST ROUTES
router.get("/property/list", async (req, res) => {
    const username = req.query.username;

    if (username === undefined) {
        res.status(400).send("You must send a username in the query parameters");
    } else {
        ShortlistDAL.GetShortlist(username).catch(err => {
            res.status(400).send(err);
        }).then((result) => {
            res.status(200).send(result);
        });
    }
});

router.get("/property/get", async (req, res) => {
    const username = req.query.username;
    const propertyid = req.query.propertyid;

    if (username === undefined || propertyid === undefined) {
        res.status(400).send("You must send a username and propertyid in the query parameters");
    } else {
        ShortlistDAL.GetProperty(username, propertyid).catch(err => {
            res.status(400).send(err);
        }).then((result) => {
            res.status(200).send(result);
        });
    }
});

router.post("/property/add", async (req, res) => {
    const username = req.body.username;
    const property = req.body.property;

    if (username === undefined || property === undefined) {
        res.status(400).send("You must send a username and property in the body");
    } else {
        const propertyClass = new PropertyShortlist(property.propertyName, property.fullAddress, property.propertyType,
            property.bedroomNumber, property.bathroomNumber, property.parkingSpaces, property.tags,
            property.propertyImageUrl, property.propertyThumbUrl, property.isForSale, property.isForRent, property.price,
            property.lat, property.long, property.notes);
        PropertyCRUD.AddPropertyToShortlist(username, propertyClass).catch(err => {
            res.status(400).send(err);
        }).then((result) => {
            res.status(200).send(result);
        });
    }
});

router.post("/property/delete", async (req, res) => {
    const username = req.body.username;
    const propertyid = req.body.propertyid;

    if (username === undefined || propertyid === undefined) {
        res.status(400).send("You must send a username and propertyid in the body");
    } else {
        PropertyCRUD.DeletePropertyFromShortlist(username, propertyid).then((result) => {
            if (result === "Success")
                res.status(200).send();
            else
                res.status(502).send();
        }).catch((err) => res.status(502).send(err));
    }
});

router.get("/property/note/get", async (req, res) => {
    const username = req.query.username;
    const propertyid = req.query.propertyid;

    if (username === undefined || propertyid === undefined) {
        res.status(400).send("You must send a username and propertyid in the query parameters");
    } else {
        PropertyCRUD.GetPropertyNotes(username, propertyid).catch(err => {
            res.status(400).send(err);
        }).then((result) => {
            res.status(200).send(result);
        });
    }
});

router.post("/property/note/add", async (req, res) => {
    const username = req.body.username;
    const propertyid = req.body.propertyid;
    const note = req.body.note;

    if (username === undefined || propertyid === undefined || note === undefined) {
        res.status(400).send("You must send a username, propertyid and a note in the body");
    } else {
        PropertyCRUD.AddNoteToProperty(username, propertyid, note).then((result) => {
            if (result === "Success")
                res.status(200).send();
            else
                res.status(502).send();
        }).catch((err) => res.status(502).send(err));
    }
});

router.post("/property/note/delete", async (req, res) => {
    const username = req.body.username;
    const propertyid = req.body.propertyid;
    const noteid = req.body.noteid;

    if (username === undefined || propertyid === undefined || noteid === undefined) {
        res.status(400).send("You must send a username, propertyid and a noteid in the body");
    } else {
        PropertyCRUD.DeleteNoteOnProperty(username, propertyid, noteid).then((result) => {
            if (result === "Success")
                res.status(200).send();
            else
                res.status(502).send();
        }).catch((err) => res.status(502).send(err));
    }
});

router.post("/property/note/update", async (req, res) => {
    const username = req.body.username;
    const propertyid = req.body.propertyid;
    const noteid = req.body.noteid;
    const note = req.body.note;

    if (username === undefined || propertyid === undefined || noteid === undefined || note === undefined) {
        res.status(400).send("You must send a username, propertyid, noteid and a note in the body");
    } else {
        PropertyCRUD.UpdateNoteOnProperty(username, propertyid, noteid, note).then((result) => {
            if (result === "Success")
                res.status(200).send();
            else
                res.status(502).send();
        }).catch((err) => res.status(502).send(err));
    }
});


// ----------------------------------------------------------------- AREA SHORTLIST ROUTES
router.get("/area/list", async (req, res) => {
    const username = req.query.username;

    if (username === undefined) {
        res.status(400).send("You must send a username in the query parameters");
    } else {
        ShortlistDAL.GetAreaShortlist(username).catch(err => {
            res.status(400).send(err);
        }).then((result) => {
            res.status(200).send(result);
        });
    }
});

router.get("/area/get", async (req, res) => {
    const username = req.query.username;
    const areaid = req.query.areaid;

    if (username === undefined || areaid === undefined) {
        res.status(400).send("You must send a username and areaid in the query parameters");
    } else {
        ShortlistDAL.GetArea(username, areaid).catch(err => {
            res.status(400).send(err);
        }).then((result) => {
            res.status(200).send(result);
        });
    }
});

router.post("/area/add", async (req, res) => {
    const username = req.body.username;
    const area = req.body.area;

    if (username === undefined || area === undefined) {
        res.status(400).send("You must send a username and area in the body");
    } else {
        const areaClass = new AreaShortlist(area.lat, area.long, area.postcode, area.broadband, area.gas, area.electricity, area.crime, area.avgPrice, area.notes);
        AreaCRUD.AddAreaToShortlist(username, areaClass).catch(err => {
            res.status(400).send(err);
        }).then((result) => {
            res.status(200).send(result);
        });
    }
});

router.post("/area/delete", async (req, res) => {
    const username = req.body.username;
    const areaid = req.body.areaid;

    if (username === undefined || areaid === undefined) {
        res.status(400).send("You must send a username and areaid in the body");
    } else {
        AreaCRUD.DeleteAreaFromShortlist(username, areaid).then((result) => {
            if (result === "Success")
                res.status(200).send();
            else
                res.status(502).send();
        }).catch((err) => res.status(502).send(err));
    }
});

router.get("/area/note/get", async (req, res) => {
    const username = req.query.username;
    const areaid = req.query.areaid;

    if (username === undefined || areaid === undefined) {
        res.status(400).send("You must send a username and areaid in the query parameters");
    } else {
        AreaCRUD.GetAreaNotes(username, areaid).catch(err => {
            res.status(400).send(err);
        }).then((result) => {
            res.status(200).send(result);
        });
    }
});

router.post("/area/note/add", async (req, res) => {
    const username = req.body.username;
    const areaid = req.body.areaid;
    const note = req.body.note;

    if (username === undefined || areaid === undefined || note === undefined) {
        res.status(400).send("You must send a username, areaid and a note in the body");
    } else {
        AreaCRUD.AddNoteToArea(username, areaid, note).then((result) => {
            if (result === "Success")
                res.status(200).send();
            else
                res.status(502).send();
        }).catch((err) => res.status(502).send(err));
    }
});

router.post("/area/note/delete", async (req, res) => {
    const username = req.body.username;
    const areaid = req.body.areaid;
    const noteid = req.body.noteid;

    if (username === undefined || areaid === undefined || noteid === undefined) {
        res.status(400).send("You must send a username, areaid and a noteid in the body");
    } else {
        AreaCRUD.DeleteNoteOnArea(username, areaid, noteid).then((result) => {
            if (result === "Success")
                res.status(200).send();
            else
                res.status(502).send();
        }).catch((err) => res.status(502).send(err));
    }
});

router.post("/area/note/update", async (req, res) => {
    const username = req.body.username;
    const areaid = req.body.areaid;
    const noteid = req.body.noteid;
    const note = req.body.note;

    if (username === undefined || areaid === undefined || noteid === undefined || note === undefined) {
        res.status(400).send("You must send a username, areaid, noteid and a note in the body");
    } else {
        AreaCRUD.UpdateNoteOnArea(username, areaid, noteid, note).then((result) => {
            if (result === "Success")
                res.status(200).send();
            else
                res.status(502).send();
        }).catch((err) => res.status(502).send(err));
    }
});

module.exports = router;
