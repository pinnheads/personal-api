/* eslint-disable consistent-return */
import { GraphQLError } from 'graphql';
import Url from '../models/url.js';
import User from '../models/user.js';
import Basics from '../models/basics.js';
import { isAuthenticated } from '../middleware/user.js';

const urlResolver = {
  Query: {
    async Url(_, args, context) {
      if (isAuthenticated(context)) {
        const result = await Url.findById(args.id);
        if (result && result.userId.toString() === context.user.id) {
          return result;
        }
        throw new GraphQLError(`URL with id ${args.id} not found for the current user`, {
          extensions: {
            code: 'INVALID_INPUT',
            http: { status: 404 },
          },
        });
      }
    },
  },
  Mutation: {
    async addUrl(_, { urlInput }, context) {
      if (isAuthenticated(context)) {
        const newLink = new Url({
          label: urlInput.label,
          link: urlInput.link,
          userId: context.user.id,
        });
        const result = await newLink.save();
        return result;
      }
    },
    async updateUrl(_, { id, label, link }, context) {
      if (isAuthenticated(context)) {
        const oldLink = await Url.findById(id);
        if (oldLink && oldLink.userId.toString() === context.user.id) {
          oldLink.label = label;
          oldLink.link = link;
          const result = await oldLink.save();
          return result;
        }
        throw new GraphQLError(`URL with id ${id} not found for the current user`, {
          extensions: {
            code: 'INVALID_INPUT',
            http: { status: 404 },
          },
        });
      }
    },
    async deleteUrl(_, { id }, context) {
      if (isAuthenticated(context)) {
        const oldLink = await Url.findById(id);
        if (oldLink && oldLink.userId.toString() === context.user.id) {
          await Url.findByIdAndDelete(oldLink.id);
          return true;
        }
        throw new GraphQLError(`URL with id ${id} not found for the current user`, {
          extensions: {
            code: 'INVALID_INPUT',
            http: { status: 404 },
          },
        });
      }
    },
  },
};

export default urlResolver;
