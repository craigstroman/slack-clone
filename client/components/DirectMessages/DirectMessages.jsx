import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styled, { ThemeProvider } from 'styled-components';
import { Button, IconButton } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faCircle } from '@fortawesome/free-solid-svg-icons';
import MessageUser from '../MessageUser/MessageUser';
import theme from '../../shared/themes';
import clearFix from '../../shared/themes/mixins';

const Wrapper = styled.div`
  margin-top: 10px;
`;

const Heading = styled.div`
  display: block;
  margin: 0 auto;
  text-align: center;
  width: 100%;
  h3,
  button {
    color: ${props => props.theme.colors.shadyLady};
    float: left;
  }
  h3 {
    padding-top: 20px;
    margin-left: ${props => props.theme.sidebar.marginLeft};
  }
  ${clearFix()}
`;

const UsersList = styled.ul`
  list-style-type: none;
  padding-left: 0;
  li {
    &.selected {
      background-color: ${props => props.theme.colors.toryBlue};
      &:hover {
        background-color: ${props => props.theme.colors.toryBlue};
      }
    }

    button {
      color: ${props => props.theme.colors.shadyLady};
      svg {
        color: ${props => props.theme.colors.jungleGreen};
        margin-right: 5px;
      }
    }
  }
`;

class DirectMessages extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      directMessageModal: false,
      newMessageUser: null,
      addMessageUser: null,
      userExists: false,
      userAdded: null,
    };

    this.handleOpenDirectMessageModal = this.handleOpenDirectMessageModal.bind(this);
    this.handleCloseDirectMessageModal = this.handleCloseDirectMessageModal.bind(this);
    this.handleMessageUser = this.handleMessageUser.bind(this);
    this.handleSelectUser = this.handleSelectUser.bind(this);
    this.userAlreadyListed = this.userAlreadyListed.bind(this);
  }

  componentDidUpdate = prevProps => {
    const { teamMembers, newDirectMessages, user } = this.props;
    const { userAdded } = this.state;
    const { [newDirectMessages.length - 1]: newMessage } = newDirectMessages;

    if (prevProps.newDirectMessages.length !== newDirectMessages.length) {
      if (newMessage !== undefined) {
        const { sender } = newMessage;
        const { username } = sender;
        const sendByUser = teamMembers.find(el => el.username === username);
        const userExists = this.userAlreadyListed(sendByUser);

        if (userAdded !== null) {
          if (sendByUser.username !== userAdded.username) {
            if (sendByUser.username !== user.username) {
              this.setState({ userExists });

              if (!userExists) {
                if (typeof sendByUser === 'object') {
                  this.setState({
                    newMessageUser: sendByUser,
                    userAdded: sendByUser,
                  });
                }
              }
            }
          }
        }
        if (sendByUser.username !== user.username) {
          this.setState({ userExists });

          if (!userExists) {
            if (typeof sendByUser === 'object') {
              this.setState({
                newMessageUser: sendByUser,
                userAdded: sendByUser,
              });
            }
          }
        }
      }
    }
  };

  /**
   * Selects a user to message.
   *
   * @param      {Object}  e  The event object.
   */
  handleSelectUser = e => {
    const { selectItem, teamUUID, history } = this.props;
    const { currentTarget } = e;
    const uuid = currentTarget.getAttribute('uuid');

    history.push(`/dashboard/view/team/${teamUUID}/user/${uuid}`);

    selectItem(e);
  };

  /**
   * Opens the direct message modal.
   *
   */
  handleOpenDirectMessageModal = () => {
    this.setState({ directMessageModal: true });
  };

  /**
   * Closes the direct message modal.
   *
   */
  handleCloseDirectMessageModal = () => {
    this.setState({ directMessageModal: false });
  };

  /**
   * Loads the screen for messaging a selected user.
   *
   * @param      {Object}  val     The value
   */
  handleMessageUser = (val, teamId) => {
    const { history, teamUUID, handleGetUser } = this.props;
    const userExists = this.userAlreadyListed(val);

    this.setState({ userExists });

    if (!userExists) {
      history.push(`/dashboard/view/team/${teamUUID}/user/${val.uuid}`);

      this.handleCloseDirectMessageModal();

      this.setState({
        addMessageUser: val,
      });

      // Selects the user in the sidebar.
      handleGetUser(val, teamId);
    } else {
      this.handleCloseDirectMessageModal();

      // Selects the user in the sidebar.
      handleGetUser(val, teamId);
    }
  };

  /**
   * Checks to see if user exists on the sidebar already.
   *
   * @param      {Object}  user    The user.
   *
   * @return     {Boolean}  Indicates true/false if a user exists.
   */
  userAlreadyListed = user => {
    const { directMessageUsers } = this.props;

    if (user !== null) {
      if (Array.isArray(directMessageUsers)) {
        if (directMessageUsers.length >= 1) {
          if (typeof user === 'object') {
            if ({}.hasOwnProperty.call(user, 'id')) {
              const res = directMessageUsers.some(el => el.id === user.id);

              return res;
            }
          }
        }
      }
    }

    return 0;
  };

  render() {
    const { newDirectMessages, directMessageUsers, user, activeEl, teamId, teamUUID } = this.props;
    const { directMessageModal, addMessageUser, newMessageUser, userAdded, userExists } = this.state;

    const showNewMessageUser = addMessageUser !== null && userExists !== null;
    const showReceivedNewMessage = newMessageUser !== null && userExists !== null;

    return (
      <ThemeProvider theme={theme}>
        <Fragment>
          <Wrapper>
            <Heading>
              <h3>Direct Messages</h3>
              <IconButton
                className="sidebar-heading__action"
                onClick={() => this.handleOpenDirectMessageModal()}
              >
                <FontAwesomeIcon icon={faPlusCircle} />
              </IconButton>
            </Heading>
            <UsersList>
              <li
                className={activeEl === user.uuid ? 'user-list__item selected' : 'user-list__item'}
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
              {showReceivedNewMessage && (
                <li
                  className={
                    activeEl === newMessageUser.uuid ? 'user-list__item selected' : 'user-list__item'
                  }
                  id={newMessageUser.uuid}
                  key={newMessageUser.uuid}
                >
                  <Button
                    type="button"
                    className="users-item"
                    name={newMessageUser.username}
                    uuid={newMessageUser.uuid}
                    id={newMessageUser.id}
                    teamid={teamId}
                    onClick={e => this.handleSelectUser(e)}
                  >
                    <FontAwesomeIcon icon={faCircle} className="user-status" />
                    {newMessageUser.username}
                  </Button>
                </li>
              )}
              {showNewMessageUser && (
                <li
                  className={
                    activeEl === addMessageUser.uuid ? 'user-list__item selected' : 'user-list__item'
                  }
                  id={addMessageUser.uuid}
                  key={addMessageUser.uuid}
                >
                  <Button
                    type="button"
                    className="users-item"
                    name={addMessageUser.username}
                    uuid={addMessageUser.uuid}
                    id={addMessageUser.id}
                    teamid={teamId}
                    onClick={e => this.handleSelectUser(e)}
                  >
                    <FontAwesomeIcon icon={faCircle} className="user-status" />
                    {addMessageUser.username}
                  </Button>
                </li>
              )}
              {directMessageUsers.map(el => {
                if (newMessageUser !== null) {
                  this.setState({
                    newMessageUser: null,
                  });
                }

                if (el.username !== user.username) {
                  return (
                    <li
                      className={activeEl === el.uuid ? 'user-list__item selected' : 'user-list__item'}
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
            </UsersList>
          </Wrapper>
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
      </ThemeProvider>
    );
  }
}

DirectMessages.defaultProps = {
  directMessageUsers: [],
  newDirectMessages: [],
  teamMembers: [],
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
  newDirectMessages: PropTypes.array,
  teamMembers: PropTypes.array,
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
