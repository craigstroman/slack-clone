import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import './SideBar.scss';

const SideBar = (props) => {
  const { channels, users } = props;

  return (
    <div className="sidebar-content">
      <div className="channels">
        <div className="sidebar-heading">
          <h5>Channels</h5>
          <button
            type="button"
            className="sidebar-heading__action"
          >
            <FontAwesomeIcon icon={faPlusCircle} />
          </button>
        </div>
        <ul className="channels-list">
          {channels.map(el => (
            <li
              className="channels-list__item"
              key={el.id}
            >
              <button
                type="button"
                className="channel-item"
              >
                #&nbsp;
                {el.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="users">
        <div className="sidebar-heading">
          <h5>Direct Messages</h5>
          <button
            type="button"
            className="sidebar-heading__action"
          >
            <FontAwesomeIcon icon={faPlusCircle} />
          </button>
        </div>
        <ul className="users-list">
          {users.map(el => (
            <li
              className="user-list__item"
              key={el.id}
            >
              <button
                type="button"
                className="users-item"
              >
                #&nbsp;
                {el.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

SideBar.defaultProps = {
  channels: [],
  users: [],
};

SideBar.propTypes = {
  channels: PropTypes.array,
  users: PropTypes.array,
};

export default SideBar;
