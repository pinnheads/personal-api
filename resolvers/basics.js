import Url from '../models/url.js';
import Basics from '../models/basics.js';

const basicsResolver = {
  Query: {
    async basics(parent, args) {
      const result = await Basics.findById(args.id);
      return Basics.populate(result, { path: 'website' });
    },
  },
  Mutation: {
    async addBasics(parent, args) {
      const newLink = new Url({
        label: args.label,
        link: args.link,
      });
      const newUrlObj = await newLink.save();
      const newUser = new Basics({
        name: args.name,
        currentRole: args.currentRole,
        email: args.email,
        phone: args.phone,
        website: newUrlObj,
        summary: args.summary,
        location: args.location,
      });
      const result = await newUser.save();
      return Basics.populate(result, { path: 'website' });
    },
  },
};

export default basicsResolver;
