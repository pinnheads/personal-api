/* eslint-disable no-unused-vars */
/* eslint-disable import/first */
import _ from 'lodash';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import * as dotenv from 'dotenv';

dotenv.config();

import express from 'express';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import urlType from './typedefs/url.js';
import basicsType from './typedefs/basics.js';
import userType from './typedefs/user.js';
import userResolver from './resolvers/user.js';
import urlResolver from './resolvers/url.js';
import basicsResolver from './resolvers/basics.js';
import { getUser } from './middleware/user.js';
// eslint-disable-next-line no-unused-vars
import connectDB from './db/connect.js';

async function startApolloServer() {
  const mongodbURI = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_NAME;

  await connectDB(mongodbURI, dbName);
  // Required logic for integrating with Express
  const app = express();
  // Our httpServer handles incoming requests to our Express app.
  // Below, we tell Apollo Server to "drain" this httpServer,
  // enabling our servers to shut down gracefully.
  const httpServer = http.createServer(app);

  // Same ApolloServer initialization as before, plus the drain plugin
  // for our httpServer.
  const server = new ApolloServer({
    typeDefs: [basicsType, urlType, userType],
    resolvers: _.merge({}, basicsResolver, urlResolver, userResolver),
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
  // Ensure we wait for our server to start
  await server.start();

  // Set up our Express middleware to handle CORS, body parsing,
  // and our expressMiddleware function.
  app.use(
    '/',
    cors(),
    bodyParser.json(),
    // expressMiddleware accepts the same arguments:
    // an Apollo Server instance and optional configuration options
    expressMiddleware(server, {
      context: async ({ req, res }) => {
        // Get the user token from the headers.
        const token = req.headers.authorization || '';

        // Try to retrieve a user with the token
        const user = await getUser(token);

        // Add the user to the context
        return { user };
      },
    }),
  );

  // Modified server startup
  // eslint-disable-next-line no-promise-executor-return
  await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
  console.log('🚀 Server ready at http://localhost:4000/');
}

const server = startApolloServer();

export default server;
