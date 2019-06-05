import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faCircle } from '@fortawesome/free-solid-svg-icons';
import InvitePeople from '../InvitePeople/InvitePeople';
import Channels from '../Channels/Channels';
import DirectMessages from '../DirectMessages/DirectMessages';
import './MainSidebar.scss';

class MainSidebar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeEl: '',
      user: null,
      invitePeopleModal: false,
    };

    this.handleSelectItem = this.handleSelectItem.bind(this);
    this.handleOpenInvitePeople = this.handleOpenInvitePeople.bind(this);
    this.handleCloseInvitePeople = this.handleCloseInvitePeople.bind(this);
    this.handleGetUser = this.handleGetUser.bind(this);
  }

  /**
   * Handles getting the selected user.
   *
   * @param      {Object}  user    The user.
   */
  handleGetUser = (user) => {
    this.setState({ user, activeEl: user.uuid });
  }

  /**
   * Sets focus to an item selected in the sidebar.
   *
   */
  handleSelectItem = (e) => {
    const { target } = e;
    const { parentNode } = e.target;
    const { handleChangeItem } = this.props;
    const elId = parentNode.id;
    const itemName = target.getAttribute('name');
    const itemType = target.getAttribute('itemType');

    this.setState({
      activeEl: elId,
    });

    handleChangeItem(itemName, itemType);
  }

  /**
   * Opens the invite people modal.
   *
   */
  handleOpenInvitePeople = () => {
    this.setState({ invitePeopleModal: true });
  }

  /**
   * Closes the invite people modal.
   *
   */
  handleCloseInvitePeople = () => {
    this.setState({ invitePeopleModal: false });
  }

  render() {
    const {
      channels, users, teamName, teamId, teamUUID, username, isOwner,
    } = this.props;
    const { activeEl, invitePeopleModal, user } = this.state;

    if (user !== null) {
      users.push(user);
    }

    return (
      <div className="main-sidebar-container">
        <header>
          <h2 className="main-sidebar__title">{teamName}</h2>
          <div className="main-sidebar__user">
            <FontAwesomeIcon icon={faCircle} className="user-status" />
            <h6 className="main-sidebar__username">
              {username}
            </h6>
          </div>
        </header>
        <section>
          <Fragment>
            <Channels
              isOwner={isOwner}
              channels={channels}
              activeEl={activeEl}
              teamId={teamId}
              teamUUID={teamUUID}
              selectItem={this.handleSelectItem}
              {...this.props}
            />
          </Fragment>
          <Fragment>
            <DirectMessages
              users={users}
              activeEl={activeEl}
              selectItem={this.handleSelectItem}
              handleGetUser={this.handleGetUser}
              teamId={teamId}
              teamUUID={teamUUID}
              {...this.props}
            />
          </Fragment>
          {isOwner && (
            <div className="invite-people">
              <div className="sidebar-heading">
                <h5>Invite People To Join</h5>
                <Button
                  type="button"
                  className="sidebar-heading__action"
                  onClick={this.handleOpenInvitePeople}
                >
                  <FontAwesomeIcon icon={faPlusCircle} />
                </Button>
              </div>
            </div>
          )}
        </section>
        <InvitePeople
          isOpen={invitePeopleModal}
          teamId={teamId}
          handleCloseInvitePeople={() => this.handleCloseInvitePeople()}
        />
      </div>
    );
  }
}

MainSidebar.defaultProps = {
  channels: [],
  users: [],
  teamName: '',
  teamId: null,
  teamUUID: null,
  username: '',
  isOwner: false,
  handleChangeItem: () => {},
};

MainSidebar.propTypes = {
  channels: PropTypes.array,
  users: PropTypes.array,
  teamName: PropTypes.string,
  teamId: PropTypes.number,
  teamUUID: PropTypes.string,
  username: PropTypes.string,
  isOwner: PropTypes.bool,
  handleChangeItem: PropTypes.func,
};

export default MainSidebar;
