import _ from 'lodash';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import UrlResolver from './resolvers/url.js';
import basicsResolver from './resolvers/basics.js';
import urlType from './typedefs/url.js';
import basicsType from './typedefs/basics.js';
// eslint-disable-next-line no-unused-vars
import db from './db/connect.js';

async function startApolloServer() {
  // Required logic for integrating with Express
  const app = express();
  // Our httpServer handles incoming requests to our Express app.
  // Below, we tell Apollo Server to "drain" this httpServer,
  // enabling our servers to shut down gracefully.
  const httpServer = http.createServer(app);

  // Same ApolloServer initialization as before, plus the drain plugin
  // for our httpServer.
  const server = new ApolloServer({
    typeDefs: [basicsType, urlType],
    resolvers: _.merge({}, basicsResolver, UrlResolver),
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
      context: async ({ req }) => ({ token: req.headers.token }),
    }),
  );

  // Modified server startup
  // eslint-disable-next-line no-promise-executor-return
  await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
  console.log('🚀 Server ready at http://localhost:4000/');
}

startApolloServer();
