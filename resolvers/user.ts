import { GraphQLError } from 'graphql';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Context } from '../context.js';

const userResolver = {
  Query: {
    // async user(_, args, { userId, models }: Context) {
    //   if (userId) return await models.User.getById();
    //   throw new GraphQLError(
    //     'Please provide a authentication token in the header!!',
    //     {
    //       extensions: {
    //         code: 'FORBIDDEN',
    //         http: { status: 403 },
    //       },
    //     }
    //   );
    // },
  },
  Mutation: {
    async registerUser(_, { registerInput }, { token, models }: Context) {
      // Check if a user already exists
      const oldUser = await models.User.createUser(
        'test',
        'test@gmail.com',
        'test',
        'testqqfndnafijnain'
      );
      // // Throw error if user present
      // if (oldUser) {
      //   throw new GraphQLError(
      //     `A user is already present with the same email ${registerInput.email}`,
      //     {
      //       extensions: {
      //         code: 'USER_ALREADY_EXISTS',
      //       },
      //     }
      //   );
      // }
      // // Check if username and password is given by the user
      // if (!registerInput.username || !registerInput.password) {
      //   throw new GraphQLError('Please provide a valid input', {
      //     extensions: {
      //       code: 'INVALID_INPUT',
      //     },
      //   });
      // }
      // // If user not present then rake user password and encrypt the password
      // const encryptedPassword = await bcrypt.hash(registerInput.password, 10);
      // // Create new user for mongo db
      // const newUser = new User({
      //   username: registerInput.username,
      //   email: registerInput.email.toLowerCase(),
      //   password: encryptedPassword,
      // });
      // // Create a JWT token for the user
      // const token = jwt.sign(
      //   {
      //     user_id: newUser.id,
      //     email: newUser.email,
      //   },
      //   process.env.SECRET_KEY
      // );
      // // Add token to the user object
      // newUser.token = token;
      // // Save the user in DB
      // const result = await newUser.save();
      // Return the result
      return oldUser;
    },
  },
};

export default userResolver;
