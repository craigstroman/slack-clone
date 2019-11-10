import React, { Fragment } from 'react';
import styled from 'styled-components';
import { CssBaseline, Container, Grid } from '@material-ui/core';
import Login from '../Login/Login';

const Header = styled.header`
  margin-top: 10px;
  h1 {
    text-align: center;
  }
`;

const Home = () => (
  <Fragment>
    <CssBaseline />
    <Container maxWidth="lg">
      <Header>
        <h1>Slack Clone</h1>
        <hr />
      </Header>
      <main>
        <Grid container spacing={3} justify="center">
          <Grid item lg={12}>
            <Login />
          </Grid>
          <Grid item lg={12} style={{ textAlign: 'center' }}>
            Not a registered user?&nbsp;
            <a href="/register">Sign Up</a>
          </Grid>
        </Grid>
      </main>
    </Container>
  </Fragment>
);

export default Home;
