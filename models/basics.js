/* eslint-disable new-cap */
import mongoose, { Schema } from 'mongoose';

const basicsSchema = new Schema({
  name: String,
  currentRole: String,
  email: String,
  phone: String,
  website: String,
  summary: String,
  location: String,
});

const Basics = new mongoose.model('Basic', basicsSchema);

export default Basics;
