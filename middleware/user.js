import User from '../models/user.js';

const getUser = async (token) => {
  const result = await User.findOne({ token });
  return result;
};

export default getUser;
