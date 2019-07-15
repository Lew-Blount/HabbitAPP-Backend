var express = require('express');
var router = express.Router();
var LandRegistryApi = require("../services/LandRegistryApi");
var NestoriaApi = require("../services/NestoriaApi");
var AreaInfoApi = require("../services/AreaInfoApi");
var PostcodeApi = require("../services/PostcodesIoApi");

router.get('/sale-history', function(req, res) {
    const lat = req.query.lat;
    const long = req.query.long;
    const radius = req.query.radius;

    if(lat === undefined || long === undefined || radius === undefined)
        res.json({"error": "You must supply a lat, long and a radius parameter"});
    else {
        LandRegistryApi.GetPropertyData(lat, long, radius).then((data) => {
            if (data === null) {
                res.status(404).send("No postcodes found at this lat and long")
            } else {
                res.json(data);
            }
        }, (err) => res.status(502).json({"error": err}));
    }
});

router.post('/properties-list', function(req, res) {
    const postcode = req.query.postcode;
    const filters = req.body.filters;
    const radius = req.query.radius;

    if(postcode === undefined || radius === undefined)
        res.json({"error": "You must supply a postcode and a radius parameter (Nestoria query)"});
    else if (radius > 99)
        res.json({"error": "Radius too large. Must be between 0.1 and 99"});
    else if (filters === undefined){
        PostcodeApi.GetLatLongFromPostcode(postcode).then((latLongObj) => {
            if (latLongObj.lat === undefined || latLongObj.long === undefined) {
                res.json({"error": "PostcodeAPI could not get lat and long for that postcode"});
            }
            NestoriaApi.GetPropertiesByLatLongWithRadius(latLongObj.lat, latLongObj.long, radius).then((data) => {
                res.json(data);
            }, (err) => res.status(502).json({"error": err}));
        });
    } else {
        PostcodeApi.GetLatLongFromPostcode(postcode).then((latLongObj) => {
            if (latLongObj.lat === undefined || latLongObj.long === undefined) {
                res.json({"error": "PostcodeAPI could not get lat and long for that postcode"});
            }
            NestoriaApi.GetPropertiesByLatLongWithRadius(latLongObj.lat, latLongObj.long, radius, filters).then((data) => {
                res.json(data);
            }, (err) => res.status(502).json({"error": err}));
        });
    }
});

router.post('/properties', function(req, res) {
    const lat = req.query.lat;
    const long = req.query.long;
    const filters = req.body.filters;

    if(lat === undefined || long === undefined)
        res.json({"error": "You must supply a lat, long and a radius parameter (Nestoria query)"});
    else if (filters === undefined){
        NestoriaApi.GetPropertiesByLatLong(lat, long).then((data) => {
            res.json(data);
        }, (err) => res.status(502).json({"error": err}));
    } else {
        NestoriaApi.GetPropertiesByLatLong(lat, long, filters).then((data) => {
            res.json(data);
        }, (err) => res.status(502).json({"error": err}));
    }
});

router.get('/tags', function(req, res) {
    const lat = req.query.lat;
    const long = req.query.long;
    const radius = req.query.radius;

    if(lat === undefined || long === undefined || radius === undefined)
        res.json({"error": "You must supply a lat, long and a radius parameter (Nestoria query)"});
    else {
        NestoriaApi.GetPropertyTags(lat, long, radius).then((data) => {
            res.json(data);
        }, (err) => res.status(502).json({"error": err}));
    }
});

router.post('/markers', function(req, res) {
    const lat = req.query.lat;
    const long = req.query.long;
    const radius = req.query.radius;
    const filters = req.body.filters;

    if(lat === undefined || long === undefined || radius === undefined)
        res.json({"error": "You must supply a lat, long and a radius parameter (Nestoria query)"});
    else if(filters === undefined) {
        NestoriaApi.GetPropertyMarkers(lat, long, radius).then((data) => {
            res.json(data);
        }, (err) => res.status(502).json({"error": err}));
    } else {
        NestoriaApi.GetPropertyMarkers(lat, long, radius, filters).then((data) => {
            res.json(data);
        }, (err) => res.status(502).json({"error": err}));
    }
});

router.get('/area', function(req, res) {
    const lat = req.query.lat;
    const long = req.query.long;
    if(lat === undefined || long === undefined)
        res.json({"error": "You must supply a lat and long parameter"});
    else {
        AreaInfoApi.GetAreaData(lat, long).then((data) => {
            if (data === null) {
                res.status(404).send("No postcodes found at this lat and long")
            } else {
                res.json(data);
            }
        }, (err) => res.status(502).json({"error": err}));
    }
});



module.exports = router;
