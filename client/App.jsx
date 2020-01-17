import ReactDOM from 'react-dom';
import React, { Fragment } from 'react';
import { ApolloProvider } from 'react-apollo';
import { createGlobalStyle } from 'styled-components';
import Home from './pages/Home/Home';
import registerServiceWorker from './registerServiceWorker';
import client from './apollo';
import GlobalStyles from './globalStyles';

const App = (
  <Fragment>
    <ApolloProvider client={client}>
      <Home />
    </ApolloProvider>
    <GlobalStyles />
  </Fragment>
);

ReactDOM.render(App, document.getElementById('app'));

registerServiceWorker();

if (module.hot) {
  module.hot.accept();
}
