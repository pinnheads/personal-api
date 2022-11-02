/* eslint-disable new-cap */
import mongoose from 'mongoose';

const urlSchema = new mongoose.Schema({
  label: String,
  link: String,
});

urlSchema.path('link').validate((url) => {
  const urlRegex = new RegExp('^(https?:\\/\\/)?' // protocol
    + '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' // domain name
    + '((\\d{1,3}\\.){3}\\d{1,3}))' // OR ip (v4) address
    + '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' // port and path
    + '(\\?[;&a-z\\d%_.~+=-]*)?' // query string
    + '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
  return urlRegex.test(url);
}, 'Link should be in correct format');

const Url = new mongoose.model('Url', urlSchema);

export default Url;
