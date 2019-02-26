import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import allTeamsQuery from '../../shared/queries/team';
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
    const { data: { loading, allTeams } } = this.props;
    const { teamId } = this.state;
    let { teamName, itemName, itemType } = this.state;

    if (loading) {
      return null;
    }

    if (Array.isArray(allTeams)) {
      if (!allTeams.length) {
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

    const teamIdx = teamId ? allTeams.findIndex(el => (el.id === parseInt(teamId, 10))) : 0;
    const team = allTeams[teamIdx];

    if (!itemName.length && !itemType.length) {
      itemName = 'general';
      itemType = 'channel';
    }

    if (!teamName.length) {
      teamName = team.name;
    }

    return (
      <div className="dashboard-container">
        <aside>
          <div className="team-sidebar">
            <TeamSidebar
              teams={allTeams.map(t => ({
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
                <Messages {...this.props} />
              </div>
            </section>
            <footer>
              <div className="input-container">
                <Input
                  itemName={itemName}
                  itemType={itemType}
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

export default graphql(allTeamsQuery)(Dashboard);
