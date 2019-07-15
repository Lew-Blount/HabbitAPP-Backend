var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
mongoose.connect('mongodb://admin:Pr0perty4pp@ds227654.mlab.com:27654/property_app_db', { useNewUrlParser: true });
var db = mongoose.connection;
//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 3000;

var router = express.Router();
var propertiesRouter = require("./routes/Properties");
var authRouter = require("./routes/Auth");
var shortlistRouter = require("./routes/Shortlist");

// All routes are prefixed with /api
app.use('/api', router);
app.use("/", propertiesRouter);
app.use("/auth", authRouter);
app.use("/shortlist", shortlistRouter);

app.listen(port);
console.log('App is running on port ' + port);