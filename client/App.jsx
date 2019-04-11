import ReactDOM from 'react-dom';
import React from 'react';
import { ApolloProvider } from 'react-apollo';
import Main from './containers/Main/Main';
import './App.scss';

import registerServiceWorker from './registerServiceWorker';
import client from './apollo';

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

if (module.hot) {
  module.hot.accept();
}
