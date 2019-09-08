var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    passport = require('passport');
var path = require('path');
const cors = require('cors');

const CORSBypass = function (app) {

    var allowCrossDomain = function (req, res, next) {

        if (req.method === 'OPTIONS') {

            //for preflighted requests i.e cross domain post request coming with customer req header

            var headers = {};

            // IE8 does not allow domains to be specified, just the *

            // headers["Access-Control-Allow-Origin"] = req.headers.origin;

            headers["Access-Control-Allow-Origin"] = "*";

            headers["Access-Control-Allow-Methods"] = "POST,GET,PUT,DELETE,OPTIONS";

            //headers["Access-Control-Allow-Credentials"] = false;

            headers["Access-Control-Max-Age"] = '86400'; // 24 hours

            headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization, Accept";

            res.writeHead(200, headers);

            res.end();

        } else {

            res.header('Access-Control-Allow-Origin', '*');

            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');

            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');

            next();

        }

    };

    app.use(allowCrossDomain);



}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());
CORSBypass(app);
app.use(cors());
var routes = require('./secreto/secreto-api/routes/appRoutes'); //importing route
routes(app); //register the route

app.use(express.static(path.join(__dirname, './secreto/secreto-testing/UI')))

app.listen(process.env.PORT)

console.log('Secreto -  Rest API started on PORT', process.env.PORT);



