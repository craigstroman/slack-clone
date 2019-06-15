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
      id: null,
      itemName: null,
    };

    this.handleChangeItem = this.handleChangeItem.bind(this);
    this.handleChangeTeam = this.handleChangeTeam.bind(this);
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
   * Sets the selected item.
   *
   * @param      {string}    itemType  The item type
   * @param      {number}    id        The identifier
   * @param      {number}    uuid      The uuid
   * @param      {string}    name      The name
   * @param      {number}    teamId    The team identifier
   */
  handleChangeItem = (id, uuid, name, teamId) => {
    const { match } = this.props;

    const itemState = {
      teamName: '',
      teamId: '',
      id: '',
      itemName: '',
    };

    if (match.params.channelId) {
      itemState.itemName = name;
      itemState.id = id;
      itemState.teamId = teamId;
    } else if (match.params.userId) {
      itemState.id = id;
      itemState.teamId = id;
      itemState.itemName = name;
    }

    this.setState(itemState);
  }

  render() {
    const { data: { loading, me }, match } = this.props;
    const {
      teamName, teamId, itemName,
    } = this.state;
    let { id } = this.state;

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
    const isOwner = team.admin;


    if (id === null) {
      if (match.params.channelId) {
        const channel = team.channels.filter(el => (el.uuid === match.params.channelId));

        id = channel[0].id; // eslint-disable-line prefer-destructuring
      }
    }

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
              users={[]}
              username={username}
              teamName={teamName}
              teamId={team.id}
              teamUUID={team.uuid}
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
                  channels={team.channels}
                  {...this.props}
                />
              </div>
            </header>
            <Fragment>
              {match.params.channelId && (
                <Fragment>
                  <section>
                    <div className="messages-container">
                      <ChannelMessages
                        channelId={parseInt(id, 10)}
                        channels={team.channels}
                        {...this.props}
                      />
                    </div>
                  </section>
                </Fragment>
              )}
              {match.params.userId && (
                <Fragment>
                  <section>
                    <div className="messages-container">
                      <UserMessages
                        teamId={teamId}
                        userId={id}
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
                        channelId={parseInt(id, 10)}
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
                        itemName={itemName}
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

export default graphql(meQuery)(Dashboard);
