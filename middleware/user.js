import User from '../models/user.js';

const getUser = async (token) => {
  const user = await User.findOne({ token });
  return user;
};

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
