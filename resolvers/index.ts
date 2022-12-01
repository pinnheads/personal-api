import _ from 'lodash';
import userResolvers from './user.js';
import basicResolver from './basics.js';

export const resolvers = _.merge({}, userResolvers, basicResolver);
