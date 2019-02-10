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
      channelName: '',
    };

    this.handleTeamChange = this.handleTeamChange.bind(this);
    this.handleChannelChange = this.handleChannelChange.bind(this);
  }

  handleTeamChange(teamName) {
    this.setState({ teamName });
  }

  handleChannelChange(channelName) {
    console.log('handleChannelChange:');
    console.log('channelName: ', channelName);
    this.setState({ channelName });
  }

  render() {
    const { data } = this.props;
    let { teamName, channelName } = this.state;
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

      if (!channelName.length) {
        channelName = 'general';
      }
    }

    return (
      <div className="dashboard-container">
        <div className="team-sidebar">
          <TeamSidebar
            teams={teams}
            handleTeamChange={this.handleTeamChange}
            {...this.props}
          />
        </div>
        <div className="main-sidebar">
          <MainSidebar
            channels={[{ id: 1, name: 'general', type: 'channel' }, { id: 2, name: 'random', type: 'channel' }]}
            users={[{ id: 1, name: 'slackbot', type: 'user' }, { id: 2, name: 'user1', type: 'user' }]}
            teamName={teamName}
            handleChannelChange={this.handleChannelChange}
            {...this.props}
          />
        </div>
        <div className="main-content">
          <header>
            <div className="header-container">
              <Header channelName={channelName} {...this.props} />
            </div>
          </header>
          <main>
            <div className="messages-container">
              <Messages {...this.props} />
            </div>
          </main>
          <footer>
            <div className="input-container">
              <Input {...this.props} />
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
