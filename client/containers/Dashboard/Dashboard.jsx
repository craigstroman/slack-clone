import React from 'react';
import MainSidebar from '../../components/MainSidebar/MainSidebar';
import TeamSidebar from '../../components/TeamSidebar/TeamSidebar';
import Messages from '../../components/Messages/Messages';
import Input from '../../components/Input/Input';
import Header from '../../components/Header/Header';
import './Dashboard.scss';

const Dashboard = props => (
  <div className="dashboard-container">
    <div className="team-sidebar">
      <TeamSidebar />
    </div>
    <div className="main-sidebar">
      <MainSidebar
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
      </main>
      <footer>
        <div className="input-container">
          <Input {...props} />
        </div>
      </footer>
    </div>
  </div>
);

export default Dashboard;
