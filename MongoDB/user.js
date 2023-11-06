const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  googleId: String,
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
  ]
});

module.exports = mongoose.model('User', userSchema);