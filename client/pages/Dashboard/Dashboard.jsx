import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import meQuery from '../../shared/queries/team';
import MainSidebar from '../../components/MainSidebar/MainSidebar';
import TeamSidebar from '../../components/TeamSidebar/TeamSidebar';
import ChannelMessages from '../../components/Messages/ChannelMessages/ChannelMessages';
import ChannelInput from '../../components/MessageInput/ChannelInput/ChannelInput';
import UserMessages from '../../components/Messages/UserMessages/UserMessages';
import UserInput from '../../components/MessageInput/UserInput/UserInput';
import Header from '../../components/Header/Header';
import NoTeams from '../../components/NoTeams/NoTeams';
import './Dashboard.scss';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      teamName: null,
      teamId: null,
      userId: null,
      userUUID: null,
      channelUUID: null,
      channelId: null,
      itemName: null,
    };

    this.handleChangeTeam = this.handleChangeTeam.bind(this);
  }

  componentDidUpdate = (prevProps) => {
    const { match, data } = this.props;
    const { channelUUID, userUUID } = this.state;

    if (match.params.channelId) {
      const teamUUID = match.params.teamId;
      const uuid = match.params.channelId;

      if (prevProps.match.params.channelId !== match.params.channelId) {
        this.handleChangeItem(teamUUID, uuid, 'channel', data);
      } else if (channelUUID === null) {
        this.handleChangeItem(teamUUID, uuid, 'channel', data);
      }
    } else if (match.params.userId) {
      const teamUUID = match.params.teamId;
      const uuid = match.params.userId;

      if (prevProps.match.params.userId !== match.params.userId) {
        this.handleChangeItem(teamUUID, uuid, 'user', data);
      } else if (userUUID === null) {
        this.handleChangeItem(teamUUID, uuid, 'user', data);
      }
    }
  }

  /**
   * Changes the team.
   *
   * @param      {String}  teamName  The team name
   * @param      {Integer}  teamId    The team identifier
   */
  handleChangeTeam = (teamName, teamId) => {
    this.setState({ teamName, teamId });
  }

  /**
   * Updates which item is selected.
   *
   * @param      {String}  teamUUID  The team uuid
   * @param      {String}  uuid      The uuid
   * @param      {String}  type      The type
   */
  handleChangeItem = (teamUUID, uuid, type, data) => {
    const { teams } = data.me;
    const teamIdx = teams.findIndex(el => el.uuid === teamUUID);
    const team = teams[teamIdx];

    if (type === 'channel') {
      const { channels } = team;
      const channel = channels.filter(el => el.uuid === uuid);

      if (Array.isArray(channel)) {
        if (channel.length) {
          this.setState({
            teamName: team.name,
            teamId: team.id,
            userId: null,
            userUUID: null,
            channelUUID: channel[0].uuid,
            channelId: channel[0].id,
            itemName: channel[0].name,
          });
        }
      }
    } else if (type === 'user') {
      const { teamMembers } = team;
      const user = teamMembers.filter(el => el.uuid === uuid);

      if (Array.isArray(user)) {
        if (user.length) {
          this.setState({
            teamName: team.name,
            teamId: team.id,
            userId: user[0].id,
            userUUID: user[0].uuid,
            channelUUID: null,
            channelId: null,
            itemName: null,
          });
        }
      }
    }
  }

  render() {
    const {
      data: { loading, me }, match,
    } = this.props;
    const {
      teamName, teamId, userId, userUUID, channelId, itemName,
    } = this.state;

    if (loading) {
      return (
        <div>
          Loading...
        </div>
      );
    }

    const { username, teams } = me;

    const teamIdx = teamId ? teams.findIndex(el => (el.id === parseInt(teamId, 10))) : 0;
    const team = teams[teamIdx];
    const { teamMembers } = team;
    const isOwner = team.admin;

    if (Array.isArray(teams)) {
      if (!teams.length) {
        return (
          <NoTeams />
        );
      }
    }

    return (
      <div className="dashboard-container">
        <aside>
          <div className="team-sidebar">
            <TeamSidebar
              userTeams={teams.map(t => ({
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
              directMessageUsers={team.directMessageMembers}
              teamMembers={teamMembers}
              username={username}
              teamName={teamName}
              teamId={team.id}
              teamUUID={team.uuid}
              isOwner={isOwner}
              {...this.props}
            />
          </div>
        </aside>
        <main>
          <div className="main-content">
            <header>
              <div className="header-container">
                <Header
                  channels={team.channels}
                  users={teamMembers}
                  {...this.props}
                />
              </div>
            </header>
            <Fragment>
              {match.params.channelId && channelId !== null && (
                <Fragment>
                  <section>
                    <div className="messages-container">
                      <ChannelMessages
                        channelId={parseInt(channelId, 10)}
                        channels={team.channels}
                        {...this.props}
                      />
                    </div>
                  </section>
                </Fragment>
              )}
              {match.params.userId && userId !== null && (
                <Fragment>
                  <section>
                    <div className="messages-container">
                      <UserMessages
                        teamId={parseInt(team.id, 10)}
                        userId={parseInt(userId, 10)}
                        {...this.props}
                      />
                    </div>
                  </section>
                </Fragment>
              )}
            </Fragment>
            <Fragment>
              {match.params.channelId && (
                <Fragment>
                  <footer>
                    <div className="input-container">
                      <ChannelInput
                        channelId={parseInt(channelId, 10)}
                        channels={team.channels}
                        {...this.props}
                      />
                    </div>
                  </footer>
                </Fragment>
              )}
              {match.params.userId && (
                <Fragment>
                  <footer>
                    <div className="input-container">
                      <UserInput
                        teamId={team.id}
                        receiverId={parseInt(userId, 10)}
                        receiverUUID={userUUID}
                        username={itemName}
                        users={teamMembers}
                        {...this.props}
                      />
                    </div>
                  </footer>
                </Fragment>
              )}
            </Fragment>
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

export default graphql(meQuery, { options: { fetchPolicy: 'network-only' } })(Dashboard);
