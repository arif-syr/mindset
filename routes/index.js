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

const emailSubscriptionSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  dateSubscribed: {
    type: Date,
    default: Date.now
  }
});

const EmailSubscription = mongoose.model('EmailSubscription', emailSubscriptionSchema);

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
  ],
  sleepSchedule: [{
    bedtime: String,
    waketime: String
  }
  ],
  addiction: [{
    addiction_name: String,
    quit_date: String,
    savings_money: String,
    phone: String,
    reasons: String
  }],
  bedtimeRoutine: {
    days: [String],
    weekStarting: Date
  }, 
  cravings: [{
    addiction_name: String,
    craving: Number
  }],
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

router.get('/nutrition', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/pages/nutrition.html'));
});

router.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/pages/dashboard.html'));
});

router.get('/focus', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/pages/focus.html'));
});

router.get('/sleep', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/pages/sleep.html'));
});


router.get('/pomodoro', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/pages/pomodoro.html'));
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

router.get('/addiction', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/pages/addiction.html'));
});

let userAddiction = null;

router.post('/saveAddiction', ensureAuthenticated, async (req, res) => {
  const { addiction_name, quit_date, savings_money, phone, reasons } = req.body;
  userAddiction = { addiction_name, quit_date, savings_money, phone, reasons };
  try {
    req.user.addiction.push({addiction_name, quit_date, savings_money, phone, reasons});
    await req.user.save();
    res.json({ success: true });
  } catch (err) {
    res.json({ success: false });
  }
});

router.post('/saveSleepSchedule', ensureAuthenticated, async (req, res) => {
  const { bedtime, waketime } = req.body;
  try {
    req.user.sleepSchedule.push({ bedtime, waketime });
    await req.user.save();
    res.json({ success: true });
  } catch (err) {
    res.json({ success: false, message: 'Failed to save sleep schedule.' +err});
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

router.get('/getSleep', ensureAuthenticated, async (req, res) => {
  try {
    let sleepSchedule = req.user.sleepSchedule;
    res.json({ success: true, sleepSchedule: sleepSchedule });
  } catch (err) {
    res.json({ success: false, message: "Error occurred while fetching sleepSchedule." });
  }
});

router.get('/getRoutine', ensureAuthenticated, async (req, res) => {
  try {
    let bedtimeRoutine = req.user.bedtimeRoutine;
    res.json({ success: true, bedtimeRoutine : bedtimeRoutine });
  } catch (err) {
    res.json({ success: false, message: "Error occurred while fetching sleepSchedule." });
  }
});

router.post('/saveBedtimeRoutine', ensureAuthenticated, async (req, res) => {
  const { days } = req.body; 
  const startOfWeek = new Date(); 
  startOfWeek.setUTCHours(0, 0, 0, 0);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1); 

  try {
    req.user.bedtimeRoutine = {
      days: days,
      weekStarting: startOfWeek
    };
    await req.user.save();
    res.json({ success: true });
  } catch (err) {
    res.json({ success: false, message: 'Failed to save bedtime routine.' });
  }
});

const cron = require('node-cron');

cron.schedule('0 0 * * 1', async () => { 
  try {
    await User.updateMany({}, {
      $set: { 'bedtimeRoutine.days': [], 'bedtimeRoutine.weekStarting': new Date() }
    });
    console.log('Bedtime routine data reset for all users.');
  } catch (err) {
    console.error('Failed to reset bedtime routine data:', err);
  }
});

router.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/pages/register.html'));
});

router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "Email already in use." });
    }

    const newUser = new User({
      email,
      password
    });

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
  successRedirect: '/dashboard',
  failureRedirect: '/login',
  failureFlash: true
}));

router.delete('/deleteTask', ensureAuthenticated, async (req, res) => {
  console.log("DELETE endpoint hit");
  const taskId = req.body.id;

  try {
    const user = await User.findById(req.user._id);
    user.tasks = user.tasks.filter(task => task._id.toString() !== taskId);
    await user.save();
    res.json({ success: true });
  } catch (err) {
    res.json({ success: false, message: 'Failed to delete task.' });
  }
});

router.get('/getAddiction', ensureAuthenticated, (req, res) => {
  let userAddiction = req.user.addiction;
  if (userAddiction) {
    res.json({ success: true, data: userAddiction });
  } else {
    res.json({ success: false, message: "No addiction data found." });
  }
});

router.post('/saveCravings', ensureAuthenticated, async (req, res) => {
  const { cravings } = req.body; 
  try {
    req.user.cravings = cravings.map(craving => ({
      addiction_name: craving.addictionName,
      craving: parseInt(craving.cravingsCount) 
    }));

    await req.user.save();
    res.json({ success: true, message: 'Cravings updated successfully.' });
  } catch (err) {
    res.json({ success: false, message: 'Failed to update cravings.', error: err.message });
  }
});

router.get('/getCravings', ensureAuthenticated, (req, res) => {
  let cravings = req.user.cravings;
  if (cravings) {
    res.json({ success: true, data: cravings });
  } else {
    res.json({ success: false, message: "No addiction data found." });
  }
});

router.get('/logout', function(req, res, next){  
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

router.post('/subscribe', async (req, res) => {
  const { email } = req.body; 

  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required.' });
  }
  try {
    const newSubscription = new EmailSubscription({ email });
    await newSubscription.save();
    res.redirect('/');
  } catch (error) {
    if (error.code === 11000) { 
      return res.status(409).json({ success: false, message: 'Email already subscribed.' });
    }
    res.status(500).json({ success: false, message: 'Error subscribing email.', error: error.message });
  }
});

module.exports = router;