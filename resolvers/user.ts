import { GraphQLError } from 'graphql';

import { encryptPassword, generateToken } from '../middleware/auth.js';
import { Context } from '../context.js';

const userResolver = {
  Query: {
    async user(_, args, { token, models }: Context) {
      if (token) return await models.User.getUser(token);
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

    async allUsers(_, args, { token, models }: Context) {
      if (await models.User.isUserAdmin(token)) return await models.User.getAllUsers()
      throw new GraphQLError(
        'You\'re not authorized to do this! Only Admins can access this',
        {
          extensions: {
            code: 'FORBIDDEN',
            http: {
              status: 403
            }
          }
        }
      )
    }
  },
  Mutation: {
    async registerUser(_, { registerInput }, { token, models }: Context) {
      // Check if a user already exists
      if (await models.User.userExists(registerInput.email)) {
        // Throw error if user present
        throw new GraphQLError('User already exists in the DB!', {
          extensions: {
            code: 'ALREADY_EXISTS',
            http: {
              status: 409,
            },
          },
        });
      }
      // Check if username and password is given by the user
      if (!registerInput.username || !registerInput.password) {
        throw new GraphQLError('Please provide a valid input', {
          extensions: {
            code: 'INVALID_INPUT',
          },
        });
      }
      // If user not present then take user password and encrypt the password
      const encryptedPassword = await encryptPassword(registerInput.password);
      // Create a JWT token for the user
      const newToken = await generateToken(registerInput.email);
      // Save the user in DB
      const newUser = await models.User.createUser(
        registerInput.username,
        registerInput.email,
        encryptedPassword,
        newToken
      );
      // Return the result
      return newUser;
    },
    async updateUserDetails(_, { updateDetails }, { token, models }: Context) {
      return await models.User.updateUser(
        updateDetails.email,
        updateDetails.username,
        token
      );
    },
    async deleteUser(_, { email }, { token, models }: Context) {
      if (models.User.isUserAdmin(token)) {
        return await models.User.deleteUser(email);
      }
      throw new GraphQLError('Not allowed to take this action', {
        extensions: {
          code: 'FORBIDDEN',
          http: {
            status: 403,
          },
        },
      });
    },
  },
};

export default userResolver;
