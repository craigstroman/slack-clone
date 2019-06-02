import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faCircle } from '@fortawesome/free-solid-svg-icons';
import MessageUser from '../MessageUser/MessageUser';
import './DirectMessages.scss';

class DirectMessages extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      directMessageModal: false,
    };

    this.handleOpenDirectMessageModal = this.handleOpenDirectMessageModal.bind(this);
    this.handleCloseDirectMessageModal = this.handleCloseDirectMessageModal.bind(this);
  }

  handleOpenDirectMessageModal = () => {
    this.setState({ directMessageModal: true });
  }

  handleCloseDirectMessageModal = () => {
    this.setState({ directMessageModal: false });
  }

  render() {
    const {
      users, activeEl, selectItem, teamId,
    } = this.props;

    const { directMessageModal } = this.state;

    return (
      <Fragment>
        <Fragment>
          <div className="users">
            <div className="sidebar-heading">
              <h5>Direct Messages</h5>
              <Button
                type="button"
                className="sidebar-heading__action"
                onClick={() => this.handleOpenDirectMessageModal()}
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
                  id="user-0"
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
        </Fragment>
        <Fragment>
          <MessageUser
            isOpen={directMessageModal}
            handleCloseDirectMessageModal={() => this.handleCloseDirectMessageModal()}
            teamId={teamId}
          />
        </Fragment>
      </Fragment>

    );
  }
}

DirectMessages.defaultProps = {
  users: [],
  activeEl: '',
  selectItem: () => {},
  teamId: null,
};

DirectMessages.propTypes = {
  users: PropTypes.array,
  activeEl: PropTypes.string,
  selectItem: PropTypes.func,
  teamId: PropTypes.number,
};

export default DirectMessages;
