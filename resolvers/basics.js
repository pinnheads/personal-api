import { GraphQLError } from 'graphql';
// import Url from '../models/url.js';
import { isAuthenticated } from '../middleware/user.js';
import User from '../models/user.js';
import Basics from '../models/basics.js';

const basicsResolver = {
  Query: {
    async basics(_, args, context) {
      if (isAuthenticated(context)) {
        const user = await User.findById(context.user.id);
        if (user.basics) {
          const populatedUser = await User.populate(user, { path: 'basics' });
          return populatedUser.basics;
        }
        return null;
        // return Basics.populate(result, { path: 'socials' });
      }
      return null;
    },
  },
  Mutation: {
    async addBasics(_, { basicsInput }, context) {
      if (await isAuthenticated(context)) {
        const user = await User.findById(context.user.id);
        if (user.basics) {
          throw new GraphQLError(`This users basics data already exists with id ${user.basics}`, {
            extensions: {
              code: 'ALREADY_EXISTS',
              http: { status: 409 },
            },
          });
        }
        const newUserBasics = new Basics({
          firstName: basicsInput.firstName,
          lastName: basicsInput.lastName,
          currentRole: basicsInput.currentRole,
          phone: basicsInput.phone,
          summary: basicsInput.summary,
          location: basicsInput.location,
        });
        const result = await newUserBasics.save();
        user.basics = newUserBasics;
        await user.save();
        return result;
      }
      return null;
    },
    async updateBasics(_, { basicsInput }, context) {
      if (await (isAuthenticated(context))) {
        const user = await User.findById(context.user.id);
        const basics = await Basics.findById(user.basics);
        if (basics) {
          basics.firstName = basicsInput.firstName;
          basics.lastName = basicsInput.lastName;
          basics.currentRole = basicsInput.currentRole;
          basics.phone = basicsInput.phone;
          basics.summary = basicsInput.summary;
          basics.location = basicsInput.location;
          await basics.save();
          return basics;
        }
        return null;
      }
      return null;
    },
    async deleteBasics(_, args, context) {
      if (await isAuthenticated(context)) {
        const basics = await Basics.findById(args.id);
        if (!basics) {
          throw new GraphQLError(`Could not find basics data with id: ${args.id}`, {
            extensions: {
              code: 'INVALID_INPUT',
              http: { status: 404 },
            },
          });
        }
        await Basics.findByIdAndDelete(basics.id);
        const user = await User.findById(
          context.user.id,
        );
        user.basics = null;
        await user.save();
        return true;
      }
      return null;
    },
  },
};

export default basicsResolver;
