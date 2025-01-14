const mongoose = require('mongoose');

// User Schema
const userSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  profileId: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  contacts: [
    {
      profileId: {
        type: String,
        required: true
      },
      username: {
        type: String,
        required: true
      },
      phoneNumber: {
        type: String,
        required: true
      }
    }
  ]
});

// Create User Model
const User = mongoose.model('User', userSchema);

module.exports = User;
