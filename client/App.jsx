import ReactDOM from 'react-dom';
import React from 'react';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider } from 'react-apollo';
import { setContext } from 'apollo-link-context';
import { ApolloLink } from 'apollo-link';
import Main from './containers/Main/Main';
import './App.scss';

import registerServiceWorker from './registerServiceWorker';

const httpLink = createHttpLink({ uri: 'http://localhost:8081/graphql' });

const middlewareLink = setContext(() => ({
  headers: {
    'x-token': localStorage.getItem('token'),
    'x-refresh-token': localStorage.getItem('refreshToken'),
  },
}));

const afterwareLink = new ApolloLink((operation, forward) => {
  const { headers } = operation.getContext();

  if (headers) {
    const token = headers.get('x-token');
    const refreshToken = headers.get('x-refresh-token');

    if (token) {
      localStorage.setItem('token', token);
    }

    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
  }

  return forward(operation);
});

const link = afterwareLink.concat(middlewareLink.concat(httpLink));

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

const App = (
  <ApolloProvider client={client}>
    <Main />
  </ApolloProvider>
);

ReactDOM.render(
  App,
  document.getElementById('app'),
);

registerServiceWorker();
