import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faCircle } from '@fortawesome/free-solid-svg-icons';
import './DirectMessages.scss';

const DirectMessages = (props) => {
  const {
    users, activeEl, messageUser, selectItem,
  } = props;

  return (
    <div className="users">
      <div className="sidebar-heading">
        <h5>Direct Messages</h5>
        <Button
          type="button"
          className="sidebar-heading__action"
          onClick={() => messageUser()}
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
              itemType="user"
              name={el.name}
              onClick={e => selectItem(e)}
            >
              <FontAwesomeIcon icon={faCircle} className="user-status" />
              {el.name}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

DirectMessages.defaultProps = {
  users: [],
  activeEl: '',
  messageUser: () => {},
  selectItem: () => {},
};

DirectMessages.propTypes = {
  users: PropTypes.array,
  activeEl: PropTypes.string,
  messageUser: PropTypes.func,
  selectItem: PropTypes.func,
};

export default DirectMessages;
