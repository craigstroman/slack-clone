import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import styled, { ThemeProvider } from 'styled-components';
import meQuery from '../../shared/queries/team';
import MainSidebar from '../../components/MainSidebar/MainSidebar';
import ChannelMessages from '../../components/Messages/ChannelMessages/ChannelMessages';
import ChannelInput from '../../components/MessageInput/ChannelInput/ChannelInput';
import UserMessages from '../../components/Messages/UserMessages/UserMessages';
import UserInput from '../../components/MessageInput/UserInput/UserInput';
import Header from '../../components/Header/Header';
import NoTeams from '../Teams/NoTeams';
import theme from '../../shared/themes';

const Wrapper = styled.div`
  display: grid;
  height: 100vh;
  grid-template-columns: 250px 1fr;
  aside {
    display: grid;
    grid-template-columns: 250px;
  }
  main {
    display: grid;
  }
`;

const Sidebar = styled.div`
  background-color: ${props => props.theme.colors.valentino};
  grid-column: 1;
`;

const Content = styled.div`
  display: grid;
  grid-template-rows: auto 1fr auto;
  height: 100vh;
  header {
    grid-column: 1;
    grid-row: 1;
  }
  section {
    border-bottom: 1px solid ${props => props.theme.colors.black};
    border-top: 1px solid ${props => props.theme.colors.black};
    grid-column: 1;
    grid-row: 2;
  }
  footer {
    grid-column: 1;
    grid-row: 3;
  }
`;

const Messages = styled.div`
  height: 98%;
`;

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

  componentDidUpdate = prevProps => {
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
  };

  /**
   * Changes the team.
   *
   * @param      {String}  teamName  The team name
   * @param      {Integer}  teamId    The team identifier
   */
  handleChangeTeam = (teamName, teamId, teamUUID) => {
    const {
      data: { loading, me },
      match,
      history,
    } = this.props;
    const { teams } = me;
    const teamIdx = teams.findIndex(el => el.id === parseInt(teamId, 0));
    const team = teams[teamIdx];
    const { channels } = team;
    const { id, uuid } = channels[0];
    const data = {
      me,
    };

    history.push(`/dashboard/view/team/${teamUUID}/channel/${uuid}`);

    this.setState({ teamName, teamId, channelId: id, channelUUID: uuid });

    this.handleChangeItem(teamUUID, uuid, 'channel', data);
  };

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
  };

  render() {
    const {
      data: { loading, me },
      match,
    } = this.props;
    const { teamName, teamId, userId, userUUID, channelId, itemName } = this.state;

    if (loading) {
      return <div>Loading...</div>;
    }

    const { id, username, teams, uuid } = me;
    const user = {
      id,
      username,
      uuid,
    };

    if (Array.isArray(teams)) {
      if (!teams.length) {
        return <NoTeams />;
      }
    }

    const teamIdx = teamId ? teams.findIndex(el => el.id === parseInt(teamId, 10)) : 0;
    const team = teams[teamIdx];
    const { teamMembers } = team;
    const isOwner = team.admin;

    return (
      <ThemeProvider theme={theme}>
        <Wrapper>
          <aside>
            <Sidebar>
              <MainSidebar
                channels={team.channels}
                directMessageUsers={team.directMessageMembers}
                teamMembers={teamMembers}
                currentUser={user}
                teamName={teamName}
                teamId={team.id}
                teamUUID={team.uuid}
                isOwner={isOwner}
                {...this.props}
              />
            </Sidebar>
          </aside>
          <main>
            <Content>
              <header>
                <Header channels={team.channels} users={teamMembers} {...this.props} />
              </header>
              <Fragment>
                {match.params.channelId && channelId !== null && (
                  <Fragment>
                    <section>
                      <Messages>
                        <ChannelMessages
                          channelId={parseInt(channelId, 10)}
                          channels={team.channels}
                          {...this.props}
                        />
                      </Messages>
                    </section>
                  </Fragment>
                )}
                {match.params.userId && userId !== null && (
                  <Fragment>
                    <section>
                      <Messages>
                        <UserMessages
                          teamId={parseInt(team.id, 10)}
                          userId={parseInt(userId, 10)}
                          {...this.props}
                        />
                      </Messages>
                    </section>
                  </Fragment>
                )}
              </Fragment>
              <Fragment>
                {match.params.channelId && (
                  <Fragment>
                    <footer>
                      <ChannelInput
                        channelId={parseInt(channelId, 10)}
                        channels={team.channels}
                        {...this.props}
                      />
                    </footer>
                  </Fragment>
                )}
                {match.params.userId && (
                  <Fragment>
                    <footer>
                      <UserInput
                        teamId={team.id}
                        receiverId={parseInt(userId, 10)}
                        receiverUUID={userUUID}
                        username={itemName}
                        users={teamMembers}
                        {...this.props}
                      />
                    </footer>
                  </Fragment>
                )}
              </Fragment>
            </Content>
          </main>
        </Wrapper>
      </ThemeProvider>
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
