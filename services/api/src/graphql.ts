import { ApolloServer } from 'apollo-server-lambda';
import { makeExecutableSchema } from 'graphql-tools';
import { schema } from './schemas';
import { resolvers } from './resolvers';

const myGraphQLSchema = makeExecutableSchema({
  typeDefs: schema,
  resolvers,
});

const server = new ApolloServer({
    schema: myGraphQLSchema,
});

exports.handler = server.createHandler({
    cors: {
        origin: '*',
        credentials: true,
    },
});