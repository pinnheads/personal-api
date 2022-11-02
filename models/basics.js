/* eslint-disable new-cap */
import mongoose, { Schema } from 'mongoose';
import Url from './url.js';

const basicsSchema = new Schema({
  name: String,
  currentRole: String,
  email: String,
  phone: String,
  website: {
    type: mongoose.ObjectId,
    ref: 'Url',
  },
  summary: String,
  location: String,
});

basicsSchema.path('email').validate((email) => {
  const emailRegex = /^([\w-\\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
  return emailRegex.test(email);
}, 'The e-mail is not valid.');

basicsSchema.path('phone').validate((phone) => {
  const phoneNoRegex = /(\+\d{1,3}\s?)?((\(\d{3}\)\s?)|(\d{3})(\s|-?))(\d{3}(\s|-?))(\d{4})(\s?(([E|e]xt[:|.|]?)|x|X)(\s?\d+))?/g;
  return phoneNoRegex.test(phone);
}, 'Enter a valid number');

const Basics = new mongoose.model('Basic', basicsSchema);

export default Basics;
