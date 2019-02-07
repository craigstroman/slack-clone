import React from 'react';
import { gql, graphql } from 'react-apollo';
import PropTypes from 'prop-types';
// import _ from 'lodash';
// import decode from 'jwt-decode';
import MainSidebar from '../../components/MainSidebar/MainSidebar';
import TeamSidebar from '../../components/TeamSidebar/TeamSidebar';
import Messages from '../../components/Messages/Messages';
import Input from '../../components/Input/Input';
import Header from '../../components/Header/Header';
import './Dashboard.scss';

const Dashboard = ({ data: { allTeams } }) => {
  console.log('allTeams: ', allTeams);

  let teams = [];

  if (allTeams) {
    teams = allTeams.map(el => ({
      id: el.id,
      letter: el.name.charAt(0).toUpperCase(),
      name: el.name,
    }));

    console.log('teams: ', teams);
  }

  return (
    <div className="dashboard-container">
      <div className="team-sidebar">
        <TeamSidebar teams={teams} />
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
            <Header />
          </div>
        </header>
        <main>
          <div className="messages-container">
            <Messages />
          </div>
        </main>
        <footer>
          <div className="input-container">
            <Input />
          </div>
        </footer>
      </div>
    </div>
  );
};

const allTeamsQuery = gql`
  {
    allTeams {
      id
      name
      channels {
        id
        name
      }
    }
  }
`;

Dashboard.defaultProps = {
  data: [],
};

Dashboard.propTypes = {
  data: PropTypes.object,
};

export default graphql(allTeamsQuery)(Dashboard);
