/* eslint-disable no-unused-vars */
import { GraphQLError } from 'graphql';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Basics from '../models/basics.js';
import User from '../models/user.js';
import { isUserAdmin, isAuthenticated } from '../middleware/user.js';

const userResolver = {
  Query: {
    async user(_, args, context) {
      const result = await User.findById(context.user.id);
      return result;
      // return User.populate(result, { path: 'basics', populate: { path: 'socials' } });
    },
  },
  Mutation: {
    // Register user
    async registerUser(_, { registerInput }) {
      // Check if a user already exists
      const oldUser = await User.findOne({ email: registerInput.email });
      // Throw error if user present
      if (oldUser) {
        throw new GraphQLError(
          `A user is already present with the same email ${registerInput.email}`,
          {
            extensions: {
              code: 'USER_ALREADY_EXISTS',
            },
          },
        );
      }
      // Check if username and password is given by the user
      if (!registerInput.username || !registerInput.password) {
        throw new GraphQLError('Please provide a valid input', {
          extensions: {
            code: 'INVALID_INPUT',
          },
        });
      }
      // If user not present then rake user password and encrypt the password
      const encryptedPassword = await bcrypt.hash(registerInput.password, 10);
      // Create new user for mongo db
      const newUser = new User({
        username: registerInput.username,
        email: registerInput.email.toLowerCase(),
        password: encryptedPassword,
      });
      // Create a JWT token for the user
      const token = jwt.sign({
        user_id: newUser.id,
        email: newUser.email,
      }, process.env.SECRET_KEY);
      // Add token to the user object
      newUser.token = token;
      // Save the user in DB
      const result = await newUser.save();
      // Return the result
      return result;
    },
    // Login user resolver
    async loginUser(_, { loginInput }) {
      // Check if email and password are provided by the user
      if (!loginInput.email || !loginInput.password) {
        throw new GraphQLError('Please provide a valid input', {
          extensions: {
            code: 'INVALID_INPUT',
          },
        });
      }
      // Check if a user is present
      const user = await User.findOne({ email: loginInput.email });

      // Check if the password provided is correct
      if (user && await (bcrypt.compare(loginInput.password, user.password))) {
        return user;
      }
      // otherwise throw error
      throw new GraphQLError(
        'Incorrect password or email! Please check and try again.',
        {
          extensions: {
            code: 'INVALID_CREDENTIALS',
          },
        },
      );
    },
    // Make a user admin
    async makeAdmin(_, args, context) {
      if (await isAuthenticated(context.user.id) && await isUserAdmin(context.user.id)) {
        const user = await User.findById(args.id);
        if (!user) {
          throw new GraphQLError(`No user with id ${args.id} found`, {
            extensions: {
              code: 'INVALID_CREDENTIALS',
              http: { status: 404 },
            },
          });
        }
        user.isAdmin = true;
        await user.save();
        return true;
      }
      throw new GraphQLError('You\'re not permitted to do this!', {
        extensions: {
          code: 'FORBIDDEN',
          http: { status: 403 },
        },
      });
    },
    async deleteUser(_, args, context) {
      if (await isAuthenticated(context.user.id) && await isUserAdmin(context.user.id)) {
        const user = await User.findById(args.id);
        if (!user) {
          throw new GraphQLError(`No user with id ${args.id} found`, {
            extensions: {
              code: 'INVALID_CREDENTIALS',
              http: { status: 404 },
            },
          });
        }
        const result = await User.findByIdAndDelete(user.id);
        console.log(result);
        return true;
      }
      throw new GraphQLError('You\'re not permitted to do this!', {
        extensions: {
          code: 'FORBIDDEN',
          http: { status: 403 },
        },
      });
    },
  },
};

export default userResolver;
