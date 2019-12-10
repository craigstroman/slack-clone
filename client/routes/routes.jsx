import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import PrivateRoute from '../shared/util/privateRoutes';

import Home from '../pages/Home/Home';
import Dashboard from '../pages/Dashboard/Dashboard';
import Register from '../pages/Register/Register';
import Login from '../pages/Login/Login';
import CreateTeam from '../components/CreateTeam/CreateTeam';
import Teams from '../pages/Teams/Teams';

const Routes = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/register" exact component={Register} />
      <Route path="/login" exact component={Login} />
      <PrivateRoute path="/teams" exact component={Teams} />
      <PrivateRoute path="/dashboard" exact component={Dashboard} />
      <PrivateRoute path="/dashboard/view/team/:teamId?" exact component={Dashboard} />
      <PrivateRoute path="/dashboard/view/team/:teamId?/channel/:channelId?" exact component={Dashboard} />
      <PrivateRoute path="/dashboard/view/team/:teamId?/user/:userId?" exact component={Dashboard} />
      <PrivateRoute path="/create-team" exact component={CreateTeam} />
    </Switch>
  </BrowserRouter>
);

export default Routes;
