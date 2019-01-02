import ReactDOM from 'react-dom';
import React from 'react';
import { ApolloClient, createNetworkInterface, ApolloProvider } from 'react-apollo';
import Main from './main/Main';
import './App.scss';

import registerServiceWorker from '../registerServiceWorker';

const networkInterface = createNetworkInterface({
  uri: 'http://localhost:8081/graphql',
});

const client = new ApolloClient({
  networkInterface,
});

const App = (
  <ApolloProvider client={client}>
    <Main />
  </ApolloProvider>
);

ReactDOM.render(App, document.getElementById('app'));
registerServiceWorker();
