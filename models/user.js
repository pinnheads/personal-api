/* eslint-disable no-unused-vars */
/* eslint-disable new-cap */
import mongoose, { Schema } from 'mongoose';
import Basics from './basics.js';

const userSchema = new Schema({
  username: { type: String, default: null },
  email: { type: String, unique: true },
  password: String,
  token: String,
  isAdmin: { type: Boolean, default: false },
  // basics: { type: mongoose.ObjectId, ref: 'Basic', default: null },
});

userSchema.path('email').validate((email) => {
  const emailRegex = /^([\w-\\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
  return emailRegex.test(email);
}, 'The e-mail is not valid.');

const User = new mongoose.model('User', userSchema);

export default User;
