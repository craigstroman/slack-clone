import React from 'react';
import { gql, graphql } from 'react-apollo';
import PropTypes from 'prop-types';
import MainSidebar from '../MainSidebar/MainSidebar';
import TeamSidebar from '../TeamSidebar/TeamSidebar';
import Messages from '../Messages/Messages';
import Input from '../Input/Input';
import Header from '../Header/Header';
import './Dashboard.scss';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      teamName: '',
    };

    this.handleTeamChange = this.handleTeamChange.bind(this);
  }

  handleTeamChange(teamName) {
    this.setState({ teamName });
  }

  render() {
    const { data } = this.props;
    let { teamName } = this.state;
    let teams = [];

    if (Array.isArray(data.allTeams)) {
      teams = data.allTeams;

      teams = teams.map(el => ({
        id: el.id,
        letter: el.name.charAt(0).toUpperCase(),
        name: el.name,
      }));

      if (!teamName.length) {
        teamName = teams[0].name;
      }
    }

    return (
      <div className="dashboard-container">
        <div className="team-sidebar">
          <TeamSidebar
            teams={teams}
            handleTeamChange={this.handleTeamChange}
          />
        </div>
        <div className="main-sidebar">
          <MainSidebar
            channels={[{ id: 1, name: 'general' }, { id: 2, name: 'random' }]}
            users={[{ id: 1, name: 'slackbot' }, { id: 2, name: 'user1' }]}
            teamName={teamName}
          />
        </div>
        <div className="main-content">
          <header>
            <div className="header-container">
              <Header {...this.props} />
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
  }
}

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
  // teams: [],
  data: {},
};

Dashboard.propTypes = {
  // teams: PropTypes.array,
  data: PropTypes.object,
};

export default graphql(allTeamsQuery)(Dashboard);
