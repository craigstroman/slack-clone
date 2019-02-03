import React from 'react';
import PropTypes from 'prop-types';
import { gql, graphql } from 'react-apollo';
import Channels from '../../containers/Channels/Channels';
import Users from '../../containers/Users/Users';
import './Sidebar.scss';

class Sidebar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeEl: '',
    };

    this.handleSelectItem = this.handleSelectItem.bind(this);
    this.handleAddChannel = this.handleAddChannel.bind(this);
    this.handleMessageUser = this.handleMessageUser.bind(this);
  }

  /**
   * Sets focus to an item selected in the sidebar.
   *
   */
  handleSelectItem(e) {
    const { parentNode } = e.target;
    const elId = parentNode.id;

    setTimeout(() => {
      this.setState({
        activeEl: elId,
      });
    }, 100);
  }

  /**
   * Adds a channel to the team.
   *
   */
  handleAddChannel(e) {
    console.log('handleAddChannel:');
    console.log('e: ', e);
    console.log('this: ', this);
  }

  /**
   * Allows a user to add a user to send a message to.
   *
   */
  handleMessageUser(e) {
    console.log('handlMessageUser: ');
    console.log('e: ', e);
    console.log('this: ', this);
  }

  render() {
    const { channels, users, data } = this.props;
    const { activeEl } = this.state;
    let teamName = '';

    if (data.allTeams) {
      teamName = data.allTeams[0].name;
    }

    return (
      <div className="sidebar-content">
        <header>
          <h2 className="sidebar-title">{teamName}</h2>
        </header>
        <section>
          <Channels
            activeEl={activeEl}
            channels={channels}
            handleSelectItem={this.handleSelectItem}
            handleAddChannel={this.handleAddChannel}
          />
          <Users
            activeEl={activeEl}
            users={users}
            handleSelectItem={this.handleSelectItem}
            handleMessageUser={this.handleMessageUser}
          />
        </section>
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

Sidebar.defaultProps = {
  channels: [],
  users: [],
  data: {},
};

Sidebar.propTypes = {
  channels: PropTypes.array,
  users: PropTypes.array,
  data: PropTypes.object,
};

export default graphql(allTeamsQuery)(Sidebar);
