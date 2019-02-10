import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faCircle } from '@fortawesome/free-solid-svg-icons';
import './MainSidebar.scss';

class MainSidebar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeEl: '',
    };

    this.handleSelectItem = this.handleSelectItem.bind(this);
    // this.handleAddChannel = this.handleAddChannel.bind(this);
    // this.handleMessageUser = this.handleMessageUser.bind(this);
  }

  /**
   * Sets focus to an item selected in the sidebar.
   *
   */
  handleSelectItem = (e) => {
    const { target } = e;
    const { parentNode } = e.target;
    const { handleChannelChange } = this.props;
    const elId = parentNode.id;

    this.setState({
      activeEl: elId,
    });

    if (target.getAttribute('itemType') === 'channel') {
      const teamName = target.getAttribute('name');
      handleChannelChange(teamName);
    }
  }

  render() {
    const { channels, users, teamName } = this.props;
    const { activeEl } = this.state;

    return (
      <div className="main-sidebar-container">
        <header>
          <h2 className="main-sidebar__title">{teamName}</h2>
        </header>
        <section>
          <div className="channels">
            <div className="sidebar-heading">
              <h5>Channels</h5>
              <Button
                type="button"
                className="sidebar-heading__action"
                onClick={this.handleAddChannel}
              >
                <FontAwesomeIcon icon={faPlusCircle} />
              </Button>
            </div>
            <ul className="channels-list">
              {channels.map(el => (
                <li
                  className={
                    activeEl === `channel-${el.id}` ? 'channels-list__item selected' : 'channels-list__item'
                  }
                  id={`channel-${el.id}`}
                  key={`channel-${el.id}`}
                >
                  <Button
                    type="button"
                    className="channel-item"
                    itemType={el.type}
                    name={el.name}
                    onClick={e => this.handleSelectItem(e)}
                  >
                    #&nbsp;
                    {el.name}
                  </Button>
                </li>
              ))}
            </ul>
          </div>
          <div className="users">
            <div className="sidebar-heading">
              <h5>Direct Messages</h5>
              <Button
                type="button"
                className="sidebar-heading__action"
                onClick={this.handleMessageUser}
              >
                <FontAwesomeIcon icon={faPlusCircle} />
              </Button>
            </div>
            <ul className="users-list">
              {users.map(el => (
                <li
                  className={
                    activeEl === `user-${el.id}` ? 'user-list__item selected' : 'user-list__item'
                  }
                  id={`user-${el.id}`}
                  key={el.id}
                >
                  <Button
                    type="button"
                    className="users-item"
                    itemType={el.type}
                    name={el.name}
                    onClick={e => this.handleSelectItem(e)}
                  >
                    <FontAwesomeIcon icon={faCircle} className="user-status" />
                    {el.name}
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    );
  }
}

MainSidebar.defaultProps = {
  channels: [],
  users: [],
  teamName: '',
  handleChannelChange: () => {},
};

MainSidebar.propTypes = {
  channels: PropTypes.array,
  users: PropTypes.array,
  teamName: PropTypes.string,
  handleChannelChange: PropTypes.func,
};

export default MainSidebar;
