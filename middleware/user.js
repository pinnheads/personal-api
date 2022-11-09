import User from '../models/user.js';

const getUser = async (token) => {
  const user = await User.findOne({ token });
  return user;
};

// TODO: Check authentication from context instead of the user id and throw proper error
const isAuthenticated = async (id) => {
  const user = await User.findById(id);
  if (!user) {
    return false;
  }
  return true;
};

const isUserAdmin = async (id) => {
  if (isAuthenticated(id)) {
    const user = await User.findById(id);
    if (user.isAdmin) {
      return true;
    }
    return false;
  }
};

export { getUser, isAuthenticated, isUserAdmin };
