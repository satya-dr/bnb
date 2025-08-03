const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "First name is required!"]
  },
  lastName: {
    type: String,
    // Optional: আপনি চাইলে এখানে `required` যোগ করতে পারেন
  },
  email: {
    type: String,
    required: [true, "Email is required!"], // মেসেজ সংশোধন
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required!"], // মেসেজ সংশোধন
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

  // Email/OTP verification এর জন্য ফিল্ড যোগ
  isVerified: {
    type: Boolean,
    default: false,
  },

  // (Optional) যদি DB তে OTP ও expiry রাখতে চান, তাহলে নিচের মত
  otp: {
    type: String,
  },
  otpExpires: {
    type: Date,
  }
}, { timestamps: true }); // createdAt ও updatedAt ফিল্ড অটোমেটিক

module.exports = mongoose.model('User', userSchema);
