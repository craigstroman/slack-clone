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
      teamName: '',
      teamId: null,
      itemName: '',
      itemType: '',
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
   * @param      {String}  itemName  The item name
   * @param      {String}  itemType  The item type
   */
  handleChangeItem = (itemName, itemType) => {
    this.setState({
      itemName,
      itemType,
    });
  }

  render() {
    const { data: { loading, me }, match } = this.props;
    const { teamId } = this.state;
    let { teamName, itemName, itemType } = this.state;
    let userTeams = null;
    let userId = null;
    let isOwner = false;
    let channel = null;

    if (loading) {
      return null;
    }

    if (Array.isArray(userTeams)) {
      if (!userTeams.length) {
        return (
          <NoTeams />
        );
      }
    }

    const { username, teams } = me;

    userId = username;

    userTeams = teams;

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
              users={[]}
              teamName={teamName}
              teamId={team.id}
              teamUUID={team.uuid}
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
            <Fragment>
              {match.params.channelId && (
                <Fragment>
                  <section>
                    <div className="messages-container">
                      <ChannelMessages
                        channelId={channel.id}
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
                        teamId={8}
                        userId={3}
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
                        itemName={itemName}
                        channelId={channel.id}
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
                        itemName="cstroman"
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
