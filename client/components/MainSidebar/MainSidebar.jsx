import React from 'react';
import PropTypes from 'prop-types';
import Channels from '../../containers/Channels/Channels';
import Users from '../../containers/Users/Users';
import './MainSidebar.scss';

class MainSidebar extends React.Component {
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
    const { channels, users } = this.props;
    const { activeEl } = this.state;
    const teamName = '';

    return (
      <div className="main-sidebar-container">
        <header>
          <h2 className="main-sidebar__title">{teamName}</h2>
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

MainSidebar.defaultProps = {
  channels: [],
  users: [],
};

MainSidebar.propTypes = {
  channels: PropTypes.array,
  users: PropTypes.array,
};

export default MainSidebar;
