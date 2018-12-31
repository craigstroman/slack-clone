import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Home from '../home/Home';
import Register from '../../components/Register/Register';

const Main = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/register" exact component={Register} />
    </Switch>
  </BrowserRouter>
);

export default Main;
