import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import './SideBar.scss';

class SideBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeEl: '',
    };

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    const { parentNode } = e.target;
    const elId = parentNode.id;

    setTimeout(() => {
      this.setState({
        activeEl: elId,
      });
    }, 100);
  }

  render() {
    const { channels, users } = this.props;
    const { activeEl } = this.state;

    return (
      <div className="sidebar-content">
        <div className="channels">
          <div className="sidebar-heading">
            <h5>Channels</h5>
            <Button
              type="button"
              className="sidebar-heading__action"
              onClick={this.handleClick}
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
                  onClick={this.handleClick}
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
                  onClick={this.handleClick}
                >
                  #&nbsp;
                  {el.name}
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

SideBar.defaultProps = {
  channels: [],
  users: [],
};

SideBar.propTypes = {
  channels: PropTypes.array,
  users: PropTypes.array,
};

export default SideBar;
