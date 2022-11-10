/* eslint-disable import/first */
import _, { sumBy } from 'lodash';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import * as dotenv from 'dotenv';

dotenv.config();

import urlType from '../typedefs/url.js';
import basicsType from '../typedefs/basics.js';
import userType from '../typedefs/user.js';
import userResolver from '../resolvers/user.js';
import urlResolver from '../resolvers/url.js';
import basicsResolver from '../resolvers/basics.js';
import { getUser } from '../middleware/user.js';
// eslint-disable-next-line no-unused-vars
import connectDB from '../db/connect.js';

async function setupServer() {
  const mongodbURI = process.env.MONGODB_URI;
  const dbName = 'test';
  const db = await connectDB(mongodbURI, dbName);
  // Same ApolloServer initialization as before, plus the drain plugin
  // for our httpServer.
  const server = new ApolloServer({
    typeDefs: [basicsType, urlType, userType],
    resolvers: _.merge({}, basicsResolver, urlResolver, userResolver),
  });

  const { url } = await startStandaloneServer(server, {
    context: async ({ req, res }) => {
      // Get the user token from the headers.
      const token = req.headers.authorization || '';

      // Try to retrieve a user with the token
      const user = await getUser(token);

      // Add the user to the context
      return { user };
    },
    listen: { port: 4000 },
  });
  return { server, db };
}
export default setupServer;
