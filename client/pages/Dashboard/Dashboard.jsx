import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import meQuery from '../../shared/queries/team';
import MainSidebar from '../../components/MainSidebar/MainSidebar';
import TeamSidebar from '../../components/TeamSidebar/TeamSidebar';
import Messages from '../../components/Messages/Messages';
import MessageInput from '../../components/MessageInput/MessageInput';
import Header from '../../components/Header/Header';
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
    let userId = null;
    let isOwner = false;
    let channel = null;

    if (loading) {
      return null;
    }

    if (!loading) {
      const { username, teams } = me;

      userId = username;

      userTeams = teams;
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
    isOwner = team.admin;

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

    return (
      <div className="dashboard-container">
        <aside>
          <div className="team-sidebar">
            <TeamSidebar
              userTeams={userTeams.map(t => ({
                id: t.id,
                uuid: t.uuid,
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
  history: {},
};

Dashboard.propTypes = {
  data: PropTypes.object,
  history: PropTypes.object,
};

export default graphql(meQuery)(Dashboard);
