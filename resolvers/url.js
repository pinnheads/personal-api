import Url from '../models/url.js';

const urlResolver = {
  Query: {
    async Url(parent, args) {
      await Url.findById(args.id);
    },
  },
  Mutation: {
    async addUrl(parent, args) {
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
