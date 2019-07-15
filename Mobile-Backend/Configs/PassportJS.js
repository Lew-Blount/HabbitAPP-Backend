const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../mongodb/models/User");

/**
 * Login strategy for PassportJS that checks for valid username and password
 */
passport.use("login", new LocalStrategy(
    (username, password, done) => {
        User.findOne({ username: username }, (err, user) => {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, { message: "Incorrect username." });
            }

            return user.validPassword(password).then((isValid) => {
                if (!isValid) {
                    return done(null, false, { message: "Incorrect password." });
                }
                return done(null, user);
            });
        });
    }
));

const JWTstrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;

//This verifies that the token sent by the user is valid
passport.use(new JWTstrategy({
    secretOrKey : "Pr0perty",
    jwtFromRequest : ExtractJWT.fromUrlQueryParameter("secret_token")
}, async (token, done) => {
    try {
        return done(null, token.user);
    } catch (error) {
        done(error);
    }
}));

/**
 * Serialization methods are required for PassportJS
 */
passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

module.exports = passport;