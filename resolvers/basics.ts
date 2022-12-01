import { GraphQLError } from 'graphql';

import { Context } from '../context.js';

const basicResolver = {
  Query: {
    async basics(_, { id }, { token, models }: Context) {
      if (token) {
        const result = await models.Basics.getBasics(id);
        if (result) return result;
        throw new GraphQLError(`Couldn't find the basics data with id ${id}`, {
          extensions: {
            code: 'INVALID_INPUT',
            http: {
              status: 404,
            },
          },
        });
      }
      throw new GraphQLError(
        'Please provide a authentication token in the header!!',
        {
          extensions: {
            code: 'FORBIDDEN',
            http: { status: 403 },
          },
        }
      );
    },
  },
  Mutation: {
    async addBasics(_, { basicsInput }, { token, models }: Context) {
      if (token) {
        const newBasicsData = await models.Basics.createBasics(basicsInput);
        if (newBasicsData) return newBasicsData;
        throw new GraphQLError('Cannot create new entry at the moment!!', {
          extensions: {
            code: 'INTERNAL_SERVER_ERROR',
          },
        });
      }
      throw new GraphQLError(
        'Please provide a authentication token in the header!!',
        {
          extensions: {
            code: 'FORBIDDEN',
            http: { status: 403 },
          },
        }
      );
    },
    async updateBasics(_, args, { token, models }: Context) {
      if (token) {
        const updatedBasics = await models.Basics.updateBasics(
          args.basicsInput,
          args.id
        );
        if (updatedBasics) return updatedBasics;
        throw new GraphQLError('Cannot update basics data at the moment!!', {
          extensions: {
            code: 'INTERNAL_SERVER_ERROR',
          },
        });
      }
      throw new GraphQLError(
        'Please provide a authentication token in the header!!',
        {
          extensions: {
            code: 'FORBIDDEN',
            http: { status: 403 },
          },
        }
      );
    },
    async deleteBasics(_, { id }, { token, models }: Context) {
      if (token) {
        const result = await models.Basics.deleteBasics(id);
        if (result) return result;
        throw new GraphQLError('Cannot update basics data at the moment!!', {
          extensions: {
            code: 'INTERNAL_SERVER_ERROR',
          },
        });
      }
      throw new GraphQLError(
        'Please provide a authentication token in the header!!',
        {
          extensions: {
            code: 'FORBIDDEN',
            http: { status: 403 },
          },
        }
      );
    },
  },
};

export default basicResolver;
