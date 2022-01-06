import { gql, ApolloServer } from 'apollo-server-express';

import { PubSub } from 'graphql-subscriptions';

import http from 'http';
import express from 'express';

import { execute, subscribe } from 'graphql';
import { makeExecutableSchema } from '@graphql-tools/schema';

import { SubscriptionServer } from 'subscriptions-transport-ws';

const pubsub = new PubSub();

const typeDefs = gql`
  type Query {
    ping: String
  }
  type Subscription {
    messageAdded: String
  }
`;

const resolvers = {
  Query: {
    ping: () => 'pong',
  },
  Subscription: {
    messageAdded: {
      subscribe: () => pubsub.asyncIterator('messageAdded'),
    },
  },
};

setInterval(() => {
  pubsub.publish('messageAdded', {
    messageAdded: new Date().getTime(),
  });
}, 1000);

async function startApolloServer() {
  const PORT = 4000;
  const app = express();
  const schema = makeExecutableSchema({ typeDefs, resolvers });

  const httpServer = http.createServer(app);

  const subscriptionServer = SubscriptionServer.create({
    schema,
    execute,
    subscribe,
  }, {
    server: httpServer,
  });

  const server = new ApolloServer({
    schema,
    plugins: [{
      async serverWillStart() {
        return {
          async drainServer() {
            subscriptionServer.close();
          },
        };
      },
    }],
  });

  await server.start();

  server.applyMiddleware({ app });

  httpServer.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
  });
}

startApolloServer();
