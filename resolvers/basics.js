/* eslint-disable consistent-return */
import { GraphQLError } from 'graphql';
import Url from '../models/url.js';
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
          const populatedBasics = await Basics.populate(populatedUser.basics, { path: 'socials' });
          return populatedBasics;
        }
        return null;
      }
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
          socials: [],
        });
        await newUserBasics.save();
        if (basicsInput.socials.length > 0) {
          basicsInput.socials.forEach(async (url) => {
            const newUrl = await Url.create({
              label: url.label,
              link: url.link,
              userId: context.user.id,
            });
            const basics = await Basics.findById(newUserBasics.id);
            basics.socials.push(newUrl);
            basics.save();
          });
        }
        user.basics = newUserBasics;
        await user.save();
        const oldUser = await User.findById(context.user.id);
        const populatedUser = await User.populate(oldUser, { path: 'basics' });
        const populatedBasics = await Basics.populate(populatedUser.basics, { path: 'socials' });
        console.log(populatedBasics);
        return populatedBasics;
      }
    },
    async updateBasics(_, { basicsUpdateInput }, context) {
      if (await (isAuthenticated(context))) {
        const user = await User.findById(context.user.id);
        const basics = await Basics.findById(user.basics);
        if (basics) {
          basics.firstName = basicsUpdateInput.firstName;
          basics.lastName = basicsUpdateInput.lastName;
          basics.currentRole = basicsUpdateInput.currentRole;
          basics.phone = basicsUpdateInput.phone;
          basics.summary = basicsUpdateInput.summary;
          basics.location = basicsUpdateInput.location;
          await basics.save();
          if (basicsUpdateInput.socials) {
            basicsUpdateInput.socials.forEach(async (newData) => {
              if (newData.id === '') {
                const newUrl = await Url.create({
                  label: newData.label,
                  link: newData.link,
                  userId: context.user.id,
                });
                const updatedBasics = await Basics.findById(basics.id);
                updatedBasics.socials.push(newUrl);
                updatedBasics.save();
              }
            });
          }
          if (!basics.socials.length && basicsUpdateInput.socials) {
            basicsUpdateInput.socials.forEach(async (url) => {
              const newUrl = await Url.create({
                label: url.label,
                link: url.link,
                userId: context.user.id,
              });
              const updatedBasics = await Basics.findById(basics.id);
              updatedBasics.socials.push(newUrl);
              updatedBasics.save();
              return updatedBasics;
            });
          } else if (basics.socials.length > 0 && basicsUpdateInput.socials) {
            basics.socials.forEach(async (data) => {
              const oldData = await Url.findById(data);
              basicsUpdateInput.socials.forEach(async (newData) => {
                if (oldData.id === newData.id && oldData.userId.toString() === context.user.id) {
                  oldData.label = newData.label;
                  oldData.link = newData.link;
                  oldData.save();
                }
              });
            });
          }
          const updatedBasics = await Basics.populate(await Basics.findById(user.basics), { path: 'socials' });
          return updatedBasics;
        }
        return null;
      }
    },
    async deleteBasics(_, args, context) {
      if (await isAuthenticated(context)) {
        if (!context.user.basics) {
          throw new GraphQLError('Could not find basics data');
        }
        const basics = await Basics.findById(context.user.basics);
        basics.socials.forEach(async (id) => {
          await Url.findByIdAndDelete(id);
        });
        await Basics.findByIdAndDelete(basics.id);
        const user = await User.findById(
          context.user.id,
        );
        user.basics = null;
        await user.save();
        return true;
      }
    },
  },
};

export default basicsResolver;
