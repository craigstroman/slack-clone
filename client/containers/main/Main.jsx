import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Home from '../home/Home';
import Register from '../../components/Register/Register';
import Login from '../../components/Login/Login';

const Main = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/register" exact component={Register} />
      <Route path="/login" exact component={Login} />
    </Switch>
  </BrowserRouter>
);

export default Main;
