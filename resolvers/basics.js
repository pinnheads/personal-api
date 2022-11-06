import { GraphQLError } from 'graphql';
import Url from '../models/url.js';
import User from '../models/user.js';
import Basics from '../models/basics.js';

const basicsResolver = {
  Query: {
    async basics(parent, args) {
      const result = await Basics.findById(args.id);
      return Basics.populate(result, { path: 'socials' });
    },
  },
  Mutation: {
    async addBasics(parent, args, context) {
      if (!context.user) {
        throw new GraphQLError('User is not authenticated', {
          extensions: {
            code: 'UNAUTHENTICATED',
            http: { status: 401 },
          },
        });
      }
      const newUserBasics = new Basics({
        firstName: args.firstName,
        lastName: args.lastName,
        currentRole: args.currentRole,
        phone: args.phone,
        summary: args.summary,
        location: args.location,
      });
      const result = await newUserBasics.save();
      const user = await User.findById(
        context.user.id,
      );
      user.basics = newUserBasics;
      await user.save();
      return result;
    },
  },
};

export default basicsResolver;
