import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import * as dotenv from 'dotenv';

dotenv.config();
import express from 'express';
import http from 'http';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import { PrismaClient } from '@prisma/client';
import { Context } from './context.js';
import { User } from './loaders/user.js';
import { resolvers } from './resolvers/index.js';
import { typeDefs } from './typeDefs/index.js';
import { Basics } from './loaders/basics.js';
// import getUser from './middleware/auth';

async function startApolloServer() {
  // Required logic for integrating with Express
  const app = express();
  const prisma = new PrismaClient();
  prisma.$connect();
  // Our httpServer handles incoming requests to our Express app.
  // Below, we tell Apollo Server to "drain" this httpServer,
  // enabling our servers to shut down gracefully.
  const httpServer = http.createServer(app);

  // Same ApolloServer initialization as before, plus the drain plugin
  // for our httpServer.
  const server = new ApolloServer<Context>({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
  // Ensure we wait for our server to start
  await server.start();

  // Set up our Express middleware to handle CORS, body parsing,
  // and our expressMiddleware function.
  app.use(
    '/',
    cors<cors.CorsRequest>(),
    bodyParser.json(),
    morgan('dev'),
    // expressMiddleware accepts the same arguments:
    // an Apollo Server instance and optional configuration options
    expressMiddleware(server, {
      context: async ({ req, res }) => {
        const token = req.headers.authorization || '';
        return {
          token: token,
          models: {
            User: new User({ prisma: prisma }),
            Basics: new Basics({ prisma: prisma, token: token }),
          },
        };
      },
    })
  );

  // Modified server startup
  await new Promise<void>((resolve) =>
    httpServer.listen({ port: 4000 }, resolve)
  );
  console.log(`🚀 Server ready at http://localhost:4000/`);
}

const server = await startApolloServer();

export default server;
