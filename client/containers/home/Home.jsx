import React from 'react';

const Home = () => (
  <div className="container">
    <div className="row">
      <div className="col-md-12">
        <h1 className="text-center">Slack Clone</h1>
        <hr />
      </div>
    </div>
    <div className="row">
      <div className="col-md-12 text-center">
        <a href="/login">Login</a>
      </div>
    </div>
    <div className="row">
      <div className="col-md-12 text-center">
        Not a registered user?&nbsp;
        <a href="/register">Sign Up</a>
      </div>
    </div>
  </div>
);

export default Home;
