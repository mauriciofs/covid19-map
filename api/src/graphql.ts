import { ApolloServer } from 'apollo-server-lambda';
import { makeExecutableSchema } from 'graphql-tools';
import { schema } from './schemas';
import { resolvers } from './resolvers';
import Helpers from './lib/Helpers';

const myGraphQLSchema = makeExecutableSchema({
  typeDefs: schema,
  resolvers,
});

const server = new ApolloServer({
    schema: myGraphQLSchema,
    context: async ({ event, context }) => ({
        connection: await Helpers.prepareLambda(),
        event,
        context
    })
});

exports.handler = server.createHandler({
    cors: {
        origin: '*',
        credentials: true,
    },
});