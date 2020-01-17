import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import PrivateRoute from '../shared/util/privateRoutes';

import Home from '../pages/Home/Home';
import Register from '../pages/Register/Register';
import CreateTeam from '../pages/Teams/CreateTeam/CreateTeam';
import ViewTeam from '../pages/Teams/ViewTeam/ViewTeam';
import Teams from '../pages/Teams/Teams/Teams';

const Routes = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/register" exact component={Register} />
      <Route path="/login" exact component={Home} />
      <PrivateRoute path="/teams" exact component={Teams} />
      <PrivateRoute path="/dashboard" exact component={ViewTeam} />
      <PrivateRoute path="/dashboard/view/team/:teamId?" exact component={ViewTeam} />
      <PrivateRoute path="/dashboard/view/team/:teamId?/channel/:channelId?" exact component={ViewTeam} />
      <PrivateRoute path="/dashboard/view/team/:teamId?/user/:userId?" exact component={ViewTeam} />
      <PrivateRoute path="/create-team" exact component={CreateTeam} />
    </Switch>
  </BrowserRouter>
);

export default Routes;
