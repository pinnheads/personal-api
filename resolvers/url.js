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
        if (result.userId.toString() === context.user.id) {
          if (result) {
            return result;
          }
          throw new GraphQLError(`URL with id ${args.id} not found`, {
            extensions: {
              code: 'INVALID_INPUT',
            },
          });
        }
        throw new GraphQLError('You\'re not permitted to retrieve this url', {
          extensions: {
            code: 'FORBIDDEN',
            http: { status: 403 },
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
    // async updateUrl(_, args, context) {
    //   if (isAuthenticated(context)) {
    //     const oldLink = await Url.findById(args.id);
    //   }
    // },
  },
};

export default urlResolver;
