import Basics from '../models/basics.js';

const basicsResolver = {
  Query: {
    async basics(parent, args) {
      await Basics.findById(args.id);
    },
  },
  Mutation: {
    async addBasics(parent, args) {
      const newUser = new Basics({
        name: args.name,
        currentRole: args.currentRole,
        email: args.email,
        phone: args.phone,
        website: args.website,
        summary: args.summary,
        location: args.location,
      });
      const result = await newUser.save();
      return result;
    },
  },
};

export default basicsResolver;
