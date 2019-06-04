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
  handleMessageUser = (val) => {
    const { history, teamUUID } = this.props;

    history.push(`/dashboard/view/team/${teamUUID}/user/${val.uuid}`);

    this.handleCloseDirectMessageModal();
  }

  render() {
    const {
      users, activeEl, selectItem, teamId, teamUUID,
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
  teamId: null,
  teamUUID: null,
};

DirectMessages.propTypes = {
  users: PropTypes.array,
  activeEl: PropTypes.string,
  selectItem: PropTypes.func,
  teamId: PropTypes.number,
  teamUUID: PropTypes.string,
};

export default DirectMessages;
