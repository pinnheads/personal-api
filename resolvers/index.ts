import _ from 'lodash';
import userResolvers from './user.js';

export const resolvers = _.merge({}, userResolvers);
