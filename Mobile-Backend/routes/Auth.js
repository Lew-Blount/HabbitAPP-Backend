var express = require('express');
var router = express.Router();
const passport = require("../Configs/PassportJS");
const jwt = require("jsonwebtoken");
const User = require("../mongodb/models/User");
const bcrypt = require("bcrypt-nodejs");

/**
 * Runs passportJS authentication methods. If incorrect login posts Unauthorized back. If valid data then returns a signed
 * JWT token
 */
router.post("/login", async (req, res, next) => {
    passport.authenticate("login", async (err, user, info) => {
        try {
            if(err || !user){
                return res.status(401).send("Unauthorized");
            }
            req.login(user, { session : false }, async (error) => {
                if( error ) return next(error);

                const body = { _id : user._id, username : user.username };
                const token = jwt.sign({ user : body },"Pr0perty");

                return res.json({ token: token });
            });
        } catch (error) {
            return next(error);
        }
    })(req, res, next);
});

/**
 * Method to check if JWT token is valid
 */
router.get("/validate", passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        res.send(true);
    }
);

/**
 * Creates a new User in the DB
 */
router.post("/register", async (req, res) => {
    const password = req.body.password;
    bcrypt.hash(password, null, null, function(err, hash) {
        const newUser = new User({
            username: req.body.username,
            password: hash,
            shortlist: [],
            areaShortlist: []
        });

        newUser.save((err, newUser) => {
            if (err)
                res.status(500).send("An error occured trying to register the new user.");
            res.send(newUser);
        });
    });
});

router.post("/update", passport.authenticate("jwt",{ session: false }), async (req, res) => {
    const updatedUser = req.body.user;
    const oldUser = req.query.username;

    if (updatedUser.password !== null) {
        bcrypt.hash(updatedUser.password, null, null, function(bcryptErr, hash) {
            updatedUser.password = hash;
            if (bcryptErr) {
                res.status(400).send(bcryptErr);
            }
            User.findOneAndUpdate({username: oldUser}, updatedUser, {new: true}, (err, data) => {
                if (err) {
                    res.status(400).send(err);
                } else {
                    const body = { _id : data._id, username : data.username };
                    const token = jwt.sign({ user : body },"Pr0perty");
                    res.status(200).send({token: token});
                }
            })
        });
    } else {
        User.findOneAndUpdate({username: oldUser}, {username: updatedUser.username}, {new: true}, (err, data) => {
            if (err) {
                res.status(400).send(err);
            } else {
                const body = { _id : data._id, username : data.username };
                const token = jwt.sign({ user : body },"Pr0perty");
                res.status(200).send({token: token});
            }
        });
    }
});

module.exports = router;
