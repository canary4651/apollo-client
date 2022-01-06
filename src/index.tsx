import * as ReactDOM from 'react-dom';

import {
  split, HttpLink,
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
} from '@apollo/client';

import { getMainDefinition } from '@apollo/client/utilities';

import { RetryLink } from '@apollo/client/link/retry';

import { WebSocketLink } from '@apollo/client/link/ws';

import App from './App';

const directionalLink = new RetryLink().split(
  (operation) => operation.getContext().version === 1,
  new HttpLink({ uri: 'http://localhost:4000/graphql' }),
  new HttpLink({ uri: 'https://swapi-graphql.netlify.app/.netlify/functions/index' }),
);

const wsLink = new WebSocketLink({
  uri: 'ws://localhost:4000/subscriptions',
  options: {
    reconnect: true,
  },
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition'
      && definition.operation === 'subscription'
    );
  },
  wsLink,
  directionalLink,
);

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('app'),
);
