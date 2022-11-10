/* eslint-disable no-unused-vars */
/* eslint-disable new-cap */
import mongoose, { Schema } from 'mongoose';
import Url from './url.js';

const basicsSchema = new Schema({
  firstName: { type: String, default: null },
  lastName: { type: String, default: null },
  currentRole: { type: String, default: null },
  phone: { type: String, default: null },
  summary: { type: String, default: null },
  location: { type: String, default: null },
  // socials: [{
  //   type: mongoose.ObjectId,
  //   ref: 'Url',
  //   default: null,
  // }],
});

basicsSchema.path('phone').validate((phone) => {
  const phoneNoRegex = /(\+\d{1,3}\s?)?((\(\d{3}\)\s?)|(\d{3})(\s|-?))(\d{3}(\s|-?))(\d{4})(\s?(([E|e]xt[:|.|]?)|x|X)(\s?\d+))?/g;
  return phoneNoRegex.test(phone);
}, 'Enter a valid number');

const Basics = new mongoose.model('Basic', basicsSchema);

export default Basics;
