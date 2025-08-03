const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "First name is required!"]
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    required: [true, "Email is required!"], 
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required!"], 
  },
  userType: {
    type: String,
    enum: ["guest", "host"],
    default: "guest"
  },
  favourites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Home'
    }
  ],
  bookings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Home'
    }
  ],

  isVerified: {
    type: Boolean,
    default: false,
  },

  otp: {
    type: String,
  },
  otpExpires: {
    type: Date,
  }
}, { timestamps: true }); 

module.exports = mongoose.model('User', userSchema);
