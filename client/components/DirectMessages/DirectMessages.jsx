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
    this.handleMessageUser = this.handleMessageUser.bind(this);
    this.handleSelectUser = this.handleSelectUser.bind(this);
  }

  /**
   * Selects a user to message.
   *
   * @param      {Object}  e  The event object.
   */
  handleSelectUser = (e) => {
    const { selectItem, teamUUID, history } = this.props;
    const { target } = e;
    const uuid = target.getAttribute('uuid');

    history.push(`/dashboard/view/team/${teamUUID}/user/${uuid}`);

    selectItem(e);
  }

  /**
   * Opens the direct message modal.
   *
   */
  handleOpenDirectMessageModal = () => {
    this.setState({ directMessageModal: true });
  }

  /**
   * Closes the direct message modal.
   *
   */
  handleCloseDirectMessageModal = () => {
    this.setState({ directMessageModal: false });
  }

  /**
   * Loads the screen for messaging a selected user.
   *
   * @param      {Object}  val     The value
   */
  handleMessageUser = (val, teamId) => {
    const { history, teamUUID, handleGetUser } = this.props;

    history.push(`/dashboard/view/team/${teamUUID}/user/${val.uuid}`);

    this.handleCloseDirectMessageModal();

    handleGetUser(val, teamId);
  }

  render() {
    const {
      users, activeEl, teamId, teamUUID,
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
                    activeEl === el.uuid ? 'user-list__item selected' : 'user-list__item'
                  }
                  id={el.uuid}
                  key={el.uuid}
                >
                  <Button
                    type="button"
                    className="users-item"
                    name={el.username}
                    uuid={el.uuid}
                    id={el.id}
                    teamid={teamId}
                    onClick={e => this.handleSelectUser(e)}
                  >
                    <FontAwesomeIcon icon={faCircle} className="user-status" />
                    {el.username}
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        </Fragment>
        <Fragment>
          <MessageUser
            open={directMessageModal}
            handleCloseDirectMessageModal={() => this.handleCloseDirectMessageModal()}
            handleMessageUser={this.handleMessageUser}
            teamId={teamId}
            teamUUID={teamUUID}
            {...this.props}
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
  handleGetUser: () => {},
  teamId: null,
  teamUUID: null,
};

DirectMessages.propTypes = {
  users: PropTypes.array,
  activeEl: PropTypes.string,
  selectItem: PropTypes.func,
  handleGetUser: PropTypes.func,
  teamId: PropTypes.number,
  teamUUID: PropTypes.string,
};

export default DirectMessages;
