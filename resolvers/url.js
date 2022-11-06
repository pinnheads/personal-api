import Url from '../models/url.js';
import User from '../models/user.js';
import Basics from '../models/basics.js';

const urlResolver = {
  Query: {
    async Url(parent, args) {
      await Url.findById(args.id);
    },
  },
  Mutation: {
    async addUrl(parent, args, context) {
      const newLink = new Url({
        label: args.label,
        link: args.link,
      });
      const result = await newLink.save();
      return result;
    },
  },
};

export default urlResolver;
