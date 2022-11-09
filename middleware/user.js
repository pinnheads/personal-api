import { GraphQLError } from 'graphql';
import User from '../models/user.js';

const getUser = async (token) => {
  const user = await User.findOne({ token });
  return user;
};

const isAuthenticated = async (context) => {
  if (context.user) {
    const user = await User.findById(context.user.id);
    if (user) return true;
  } else {
    throw new GraphQLError('Please Sign In or provide auth token', {
      extensions: {
        code: 'FORBIDDEN',
        http: { status: 403 },
      },
    });
  }
  return false;
};

const isUserAdmin = async (context) => {
  if (isAuthenticated(context)) {
    const user = await User.findById(context.user.id);
    if (user.isAdmin) {
      return true;
    }
    return false;
  }
  return false;
};

export { getUser, isAuthenticated, isUserAdmin };
