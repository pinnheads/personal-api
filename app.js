import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { ApolloServerErrorCode } from '@apollo/server/errors';
import basicsResolver from './resolvers/basics.js';
import basicsType from './typedefs/basics.js';
// eslint-disable-next-line no-unused-vars
import db from './db/connect.js';

const server = new ApolloServer({
  typeDefs: basicsType,
  resolvers: basicsResolver,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀 Server ready at: ${url}`);
