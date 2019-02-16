import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
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
      itemName: '',
      itemType: '',
    };

    this.handleChangeItem = this.handleChangeItem.bind(this);
  }

  handleChangeTeam = (teamName) => {
    this.setState({ teamName });
  }

  handleChangeItem = (itemName, itemType) => {
    this.setState({
      itemName,
      itemType,
    });
  }

  render() {
    const { data } = this.props;
    let { teamName, itemName, itemType } = this.state;
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

      if (!itemName.length && !itemType.length) {
        itemName = 'general';
        itemType = 'channel';
      }
    }

    return (
      <div className="dashboard-container">
        <div className="team-sidebar">
          <TeamSidebar
            teams={teams}
            handleChangeTeam={this.handleChangeTeam}
            {...this.props}
          />
        </div>
        <div className="main-sidebar">
          <MainSidebar
            channels={[{ id: 1, name: 'general', type: 'channel' }, { id: 2, name: 'random', type: 'channel' }]}
            users={[{ id: 1, name: 'slackbot', type: 'user' }, { id: 2, name: 'user1', type: 'user' }]}
            teamName={teamName}
            handleChangeItem={this.handleChangeItem}
            {...this.props}
          />
        </div>
        <div className="main-content">
          <header>
            <div className="header-container">
              <Header itemName={itemName} itemType={itemType} {...this.props} />
            </div>
          </header>
          <main>
            <div className="messages-container">
              <Messages {...this.props} />
            </div>
          </main>
          <footer>
            <div className="input-container">
              <Input itemName={itemName} itemType={itemType} {...this.props} />
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
  data: {},
};

Dashboard.propTypes = {
  data: PropTypes.object,
};

export default graphql(allTeamsQuery)(Dashboard);
