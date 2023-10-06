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
  ]
});

module.exports = mongoose.model('User', userSchema);