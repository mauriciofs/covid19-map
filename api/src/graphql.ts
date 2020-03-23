import { ApolloServer } from 'apollo-server-lambda';
import { makeExecutableSchema } from 'graphql-tools';
import { schema } from './schemas';
import { resolvers } from './resolvers';
import Helpers from './lib/Helpers';
import { APIGatewayEvent, Context, Callback } from 'aws-lambda';

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

export const handler: (event: APIGatewayEvent, context: Partial<Context>, callback: Callback) => void = server.createHandler({
    cors: {
        origin: '*',
        credentials: true,
    },
});