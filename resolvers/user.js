import { GraphQLError } from 'graphql';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const userResolver = {
  Query: {
    async user(parent, args) {
      const result = await User.findById(args.id);
      return User.populate(result, { path: 'website' });
    },
  },
  Mutation: {
    // Register user
    async registerUser(parent, { registerInput }) {
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
    async loginUser(parent, { loginInput }) {
      // Check if a user is present
      const user = await User.findOne({ email: loginInput.email });

      // Check if the password provided is correct
      if (user && await (bcrypt.compare(loginInput.password, user.password))) {
        return user.token;
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
  },
};

export default userResolver;
