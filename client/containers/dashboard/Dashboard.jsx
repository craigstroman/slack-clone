import React from 'react';
import SideBar from '../../components/SideBar/SideBar';
import Messages from '../../components/Messages/Messages';
import Input from '../../components/Input/Input';
import Header from '../../components/Header/Header';
import './Dashboard.scss';

const Dashboard = () => (
  <div className="content">
    <div className="sidebar">
      <SideBar />
    </div>
    <div className="main-content">
      <header>
        <div className="header-container">
          <Header />
        </div>
      </header>
      <main>
        <div className="messages-container">
          <Messages />
        </div>
        <div className="input-container">
          <Input />
        </div>
      </main>
    </div>
  </div>
);

export default Dashboard;
