import React from 'react';
import {
  BrowserRouter, Route, Redirect, Switch,
} from 'react-router-dom';
import decode from 'jwt-decode';


import Home from '../Home/Home';
import Dashboard from '../../components/Dashboard/Dashboard';
import Register from '../../components/Register/Register';
import Login from '../../components/Login/Login';
import CreateTeams from '../../components/Teams/CreateTeams';

const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  const refreshToken = localStorage.getItem('refreshToken');
  try {
    decode(token);
    decode(refreshToken);
  } catch (err) {
    return false;
  }

  return true;
};

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props => (isAuthenticated() ? (
      <Component {...props} />
    ) : (
      <Redirect
        to={{
          pathname: '/login',
        }}
      />
    ))}
  />
);

const Main = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/register" exact component={Register} />
      <Route path="/login" exact component={Login} />
      <PrivateRoute path="/dashboard" exact component={Dashboard} />
      <PrivateRoute path="/create-team" exact component={CreateTeams} />
    </Switch>
  </BrowserRouter>
);

export default Main;
