import { createGlobalStyle } from 'styled-components';

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

export default GlobalStyles;
