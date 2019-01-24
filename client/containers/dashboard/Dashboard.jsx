import React from 'react';
import SideBar from '../../components/SideBar/SideBar';
import Messages from '../../components/Messages/Messages';
import Input from '../../components/Input/Input';
import Header from '../../components/Header/Header';
import './Dashboard.scss';

const Dashboard = props => (
  <div className="content">
    <div className="sidebar">
      <SideBar
        channels={[{ id: 1, name: 'general' }, { id: 2, name: 'random' }]}
        users={[{ id: 1, name: 'slackbot' }, { id: 2, name: 'user1' }]}
      />
    </div>
    <div className="main-content">
      <header>
        <div className="header-container">
          <Header {...props} />
        </div>
      </header>
      <main>
        <div className="messages-container">
          <Messages {...props} />
        </div>
        <div className="input-container">
          <Input {...props} />
        </div>
      </main>
    </div>
  </div>
);

export default Dashboard;
