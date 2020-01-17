import React from 'react';
import styled from 'styled-components';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { CssBaseline, Grid } from '@material-ui/core';
import PrivateRoute from '../../shared/util/privateRoutes';
import Login from '../Login/Login';
import Register from '../Register/Register';
import CreateTeam from '../Teams/CreateTeam/CreateTeam';
import ViewTeam from '../Teams/ViewTeam/ViewTeam';
import Teams from '../Teams/Teams/Teams';

const Wrapper = styled.div`
  margin-top: 10px;
`;

const Home = props => (
  <Wrapper>
    <BrowserRouter>
      <CssBaseline />
      <main>
        <Grid container spacing={3} justify="center">
          <Grid item lg={12}>
            <Switch>
              <Route path="/" exact component={Login} />
              <Route path="/login" exact component={Login} />
              <Route path="/register" exact component={Register} />
              <PrivateRoute path="/teams" exact component={Teams} />
              <PrivateRoute path="/dashboard" exact component={ViewTeam} />
              <PrivateRoute path="/dashboard/view/team/:teamId?" exact component={ViewTeam} />
              <PrivateRoute
                path="/dashboard/view/team/:teamId?/channel/:channelId?"
                exact
                component={ViewTeam}
              />
              <PrivateRoute path="/dashboard/view/team/:teamId?/user/:userId?" exact component={ViewTeam} />
              <PrivateRoute path="/create-team" exact component={CreateTeam} />
            </Switch>
          </Grid>
        </Grid>
      </main>
    </BrowserRouter>
  </Wrapper>
);

export default Home;
