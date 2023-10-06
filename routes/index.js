const express = require('express');
const router = express.Router();
const path = require('path');
const passport = require('passport');
const mongoose = require('mongoose');
const session = require('express-session');

const app = express();

const LocalStrategy = require('passport-local').Strategy;

const GoogleStrategy = require('passport-google-oauth20').Strategy;


const connectDB = require('../MongoDB/modules/db');

connectDB(true);

const userSchema = new mongoose.Schema({
  googleId: String,
  password: String,
  email: String,
  tasks: [
    {
      name: String,
      description: String,
      duration: Number
    }
  ]
});

const User = mongoose.model('User', userSchema);


const { google } = require('../MongoDB/modules/credentials');

app.use(session({ secret: 'secretKey', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new GoogleStrategy(google,
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ googleId: profile.id });
      if (user) {
        return done(null, user);
      } else {
        user = await new User({ googleId: profile.id, email: profile.emails[0].value }).save();
        return done(null, user);
      }
    } catch (err) {
      return done(err, null);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
});

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/pages/dashboard.html'));
});

router.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/pages/dashboard.html'));
});

router.get('/focus', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/pages/focus.html'));
});

router.get('/startTask', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/pages/startTask.html'));
});

router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/focus');
  }
);


router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/pages/login.html'));
});

router.post('/addTask', ensureAuthenticated, async (req, res) => {
  const { name, description, duration } = req.body;
  try {
    req.user.tasks.push({ name, description, duration });
    await req.user.save();
    res.json({ success: true });
  } catch (err) {
    res.json({ success: false });
  }
});

router.get('/getTasks', ensureAuthenticated, async (req, res) => {
  try {
      let tasks = req.user.tasks;
      res.json({ success: true, tasks: tasks });
  } catch (err) {
      res.json({ success: false, message: "Error occurred while fetching tasks." });
  }
});

router.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/pages/register.html'));
});

router.post('/register', async (req, res) => {
  try {
      const { email, password } = req.body;

      // Check for existing user with the same email
      const existingUser = await User.findOne({ email });
      if (existingUser) {
          return res.json({ success: false, message: "Email already in use." });
      }

      // Create a new user
      const newUser = new User({
          email,
          password
      });

      // Save the new user to the database
      await newUser.save();
      res.json({ success: true, message: "Registration successful" });

  } catch (error) {
      res.json({ success: false, message: "Error occurred during registration." });
  }
});


function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/login');
  }
}

passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            return done(null, false, { message: 'Incorrect email.' });
        }
        
        if (user.password !== password) {
            return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));

router.post('/login', passport.authenticate('local', {
  successRedirect: '/dashboard', // redirect to the secure profile section
  failureRedirect: '/login',     // redirect back to the login page if there is an error
  failureFlash: true             // allow flash messages
}));

module.exports = router;