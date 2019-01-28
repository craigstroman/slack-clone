import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faCircle } from '@fortawesome/free-solid-svg-icons';
import './Users.scss';

const Users = (props) => {
  const {
    activeEl, users, handleSelectItem, handleMessageUser,
  } = props;

  return (
    <div className="users">
      <div className="sidebar-heading">
        <h5>Direct Messages</h5>
        <Button
          type="button"
          className="sidebar-heading__action"
          onClick={handleMessageUser}
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
              onClick={handleSelectItem}
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

Users.defaultProps = {
  activeEl: '',
  users: [],
  handleSelectItem: () => {},
  handleMessageUser: () => {},
};

Users.propTypes = {
  activeEl: PropTypes.string,
  users: PropTypes.array,
  handleSelectItem: PropTypes.func,
  handleMessageUser: PropTypes.func,
};


export default Users;
