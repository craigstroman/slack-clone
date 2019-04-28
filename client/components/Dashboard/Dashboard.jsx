import React from 'react';
import PropTypes from 'prop-types';
import decode from 'jwt-decode';
import { graphql } from 'react-apollo';
import meQuery from '../../shared/queries/team';
import MainSidebar from '../MainSidebar/MainSidebar';
import TeamSidebar from '../TeamSidebar/TeamSidebar';
import Messages from '../Messages/Messages';
import MessageInput from '../MessageInput/MessageInput';
import Header from '../Header/Header';
import './Dashboard.scss';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      teamName: '',
      teamId: null,
      itemName: '',
      itemType: '',
    };

    this.handleChangeItem = this.handleChangeItem.bind(this);
    this.handleChangeTeam = this.handleChangeTeam.bind(this);
  }

  handleChangeTeam = (teamName, teamId) => {
    this.setState({ teamName, teamId });
  }

  handleChangeItem = (itemName, itemType) => {
    this.setState({
      itemName,
      itemType,
    });
  }

  render() {
    const { data: { loading, me } } = this.props;
    const { teamId } = this.state;
    let { teamName, itemName, itemType } = this.state;
    let userTeams = null;
    let isOwner = false;
    let channel = null;
    let userId = null;

    if (loading) {
      return null;
    }

    if (!loading) {
      const { teams } = me;

      userTeams = teams;
    }

    try {
      const token = localStorage.getItem('token');
      const { user } = decode(token);
      const { username } = user;

      userId = username;
    } catch (err) {
      console.log('error: ', err);
    }

    if (Array.isArray(userTeams)) {
      if (!userTeams.length) {
        return (
          <div className="containter">
            <div className="row">
              <div className="col-md-12 text-center">
                You need to&nbsp;
                <a href="/create-team">
                  create a team
                </a>
                .
              </div>
            </div>
          </div>
        );
      }
    }

    const teamIdx = teamId ? userTeams.findIndex(el => (el.id === parseInt(teamId, 10))) : 0;
    const team = userTeams[teamIdx];

    if (!itemName.length && !itemType.length) {
      itemName = 'general';
      itemType = 'channel';
    }

    if (itemName.length && itemType.length) {
      if (itemType === 'channel') {
        channel = team.channels.find(el => (el.name === itemName));
      }
    }

    if (!teamName.length) {
      teamName = team.name;
    }

    try {
      const token = localStorage.getItem('token');
      const { user } = decode(token);
      const { id } = user;

      isOwner = id === team.owner;
    } catch (err) {
      console.log('There was an error.');
      console.log('error: ', err);
    }

    return (
      <div className="dashboard-container">
        <aside>
          <div className="team-sidebar">
            <TeamSidebar
              userTeams={userTeams.map(t => ({
                id: t.id,
                letter: t.name.charAt(0).toUpperCase(),
                name: t.name,
                type: 'channel',
              }))}
              handleChangeTeam={this.handleChangeTeam}
              {...this.props}
            />
          </div>
          <div className="main-sidebar">
            <MainSidebar
              channels={team.channels}
              users={[{ id: 1, name: 'slackbot' }, { id: 2, name: 'user1' }]}
              teamName={teamName}
              teamId={team.id}
              username={userId}
              isOwner={isOwner}
              handleChangeItem={this.handleChangeItem}
              {...this.props}
            />
          </div>
        </aside>
        <main>
          <div className="main-content">
            <header>
              <div className="header-container">
                <Header
                  itemName={itemName}
                  itemType={itemType}
                  {...this.props}
                />
              </div>
            </header>
            <section>
              <div className="messages-container">
                <Messages
                  channelId={channel.id}
                  {...this.props}
                />
              </div>
            </section>
            <footer>
              <div className="input-container">
                <MessageInput
                  itemName={itemName}
                  itemType={itemType}
                  channelId={channel.id}
                  {...this.props}
                />
              </div>
            </footer>
          </div>
        </main>
      </div>
    );
  }
}

Dashboard.defaultProps = {
  data: {},
};

Dashboard.propTypes = {
  data: PropTypes.object,
};

export default graphql(meQuery)(Dashboard);
