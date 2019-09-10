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
      messageUser: null,
    };

    this.handleOpenDirectMessageModal = this.handleOpenDirectMessageModal.bind(this);
    this.handleCloseDirectMessageModal = this.handleCloseDirectMessageModal.bind(this);
    this.handleMessageUser = this.handleMessageUser.bind(this);
    this.handleSelectUser = this.handleSelectUser.bind(this);
    this.userAlreadyListed = this.userAlreadyListed.bind(this);
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

    this.setState({
      messageUser: val,
    });

    // Selects the user in the sidebar.
    handleGetUser(val, teamId);
  }

  userAlreadyListed = (user) => {
    const { directMessageUsers } = this.props;

    if (Array.isArray(directMessageUsers)) {
      if (user !== null) {
        if (typeof user === 'object') {
          if ({}.hasOwnProperty.call(user, 'id')) {
            const res = directMessageUsers.some(el => (el.id === user.id));

            return res;
          }
        }
      }
    }

    return 0;
  }

  render() {
    const {
      directMessageUsers, user, activeEl, teamId, teamUUID,
    } = this.props;
    const { directMessageModal, messageUser } = this.state;

    const userExists = messageUser !== null ? this.userAlreadyListed(messageUser) : null;
    const showMessageUser = (messageUser !== null && userExists !== null);

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
              <li
                className={
                  activeEl === user.uuid ? 'user-list__item selected' : 'user-list__item'
                }
                id={user.uuid}
                key={user.uuid}
              >
                <Button
                  type="button"
                  className="users-item"
                  name={user.username}
                  uuid={user.uuid}
                  id={user.id}
                  teamid={teamId}
                  onClick={e => this.handleSelectUser(e)}
                >
                  <FontAwesomeIcon icon={faCircle} className="user-status" />
                  {user.username}
                  &nbsp;(you)
                </Button>
              </li>
              {showMessageUser && (
                <li
                  className={
                    activeEl === messageUser.uuid ? 'user-list__item selected' : 'user-list__item'
                  }
                  id={messageUser.uuid}
                  key={messageUser.uuid}
                >
                  <Button
                    type="button"
                    className="users-item"
                    name={messageUser.username}
                    uuid={messageUser.uuid}
                    id={messageUser.id}
                    teamid={teamId}
                    onClick={e => this.handleSelectUser(e)}
                  >
                    <FontAwesomeIcon icon={faCircle} className="user-status" />
                    {messageUser.username}
                  </Button>
                </li>
              )}
              {directMessageUsers.map((el) => {
                if (el.username !== user.username) {
                  return (
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
                  );
                }
                return null;
              })}
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
  directMessageUsers: [],
  user: null,
  messageUser: null,
  activeEl: null,
  selectItem: () => {},
  handleGetUser: () => {},
  teamId: null,
  teamUUID: null,
  history: {},
};

DirectMessages.propTypes = {
  directMessageUsers: PropTypes.array,
  user: PropTypes.object,
  messageUser: PropTypes.object,
  activeEl: PropTypes.string,
  selectItem: PropTypes.func,
  handleGetUser: PropTypes.func,
  teamId: PropTypes.number,
  teamUUID: PropTypes.string,
  history: PropTypes.object,
};

export default DirectMessages;
