import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Home from '../home/Home';

const Main = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/" exact component={Home} />
    </Switch>
  </BrowserRouter>
);

export default Main;
