import ReactDOM from 'react-dom';
import React, { Fragment } from 'react';
import { ApolloProvider } from 'react-apollo';
import { createGlobalStyle } from 'styled-components';
import Routes from './routes/routes';
import registerServiceWorker from './registerServiceWorker';
import client from './apollo';

const GlobalStyles = createGlobalStyle`
  html,
  body {
    font-family: arial, helvetica, sans-serif;
    height: 100%;
    margin: 0;
    padding: 0;
  }

  #app {
    height: 100%;
    overflow: hidden;
  }

  hr {
    width: 95%;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin-block-start: 0;
    margin-block-end: 0;

  }

  h1 {
    font-size: 2em;
  }

  h2 {
    font-size: 1.5em;
  }

  h3 {
    font-size: 1.17em;
  }

  h4 {
    font-size: 1em;
  }

  h5 {
    font-size: .83em;
  }

  h6 {
    font-size: .67em;
  }
`;

const App = (
  <Fragment>
    <ApolloProvider client={client}>
      <Routes />
    </ApolloProvider>
    <GlobalStyles />
  </Fragment>
);

ReactDOM.render(App, document.getElementById('app'));

registerServiceWorker();

if (module.hot) {
  module.hot.accept();
}
