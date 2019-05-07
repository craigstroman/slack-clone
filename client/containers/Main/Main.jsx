import React from 'react';
import {
  BrowserRouter, Route, Redirect, Switch,
} from 'react-router-dom';
import decode from 'jwt-decode';
import PrivateRoute from '../../shared/util/privateRoutes';

import Home from '../Home/Home';
import Dashboard from '../../components/Dashboard/Dashboard';
import Register from '../../components/Register/Register';
import Login from '../../components/Login/Login';
import CreateTeam from '../../components/CreateTeam/CreateTeam';

const Main = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/register" exact component={Register} />
      <Route path="/login" exact component={Login} />
      <PrivateRoute path="/dashboard" exact component={Dashboard} />
      <PrivateRoute path="/dashboard/view/team/:teamId?" exact component={Dashboard} />
      <PrivateRoute path="/dashboard/view/channel/:channelId?" exact component={Dashboard} />
      <PrivateRoute path="/create-team" exact component={CreateTeam} />
    </Switch>
  </BrowserRouter>
);

export default Main;
