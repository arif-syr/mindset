const express = require('express');
const bodyParser = require('body-parser');
const config = require('./modules/config');
const routes = require('./routes');
const app = express();
const path = require('path');

const session = require('express-session');
// const passport = require('passport');
// const GoogleStrategy = require('passport-google-oauth20').Strategy;

const passport = require('passport');

app.use(session({
    secret: 'secretKey',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.urlencoded({
    extended: true
}));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

// Start the Server
app.listen(config.PORT, config.HOST, () => {
    console.log(`Server started on http://${config.HOST}:${config.PORT}`);
});