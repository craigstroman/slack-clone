import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faCircle } from '@fortawesome/free-solid-svg-icons';
import AddChannel from '../AddChannel/AddChannel';
import InvitePeople from '../InvitePeople/InvitePeople';
import './MainSidebar.scss';

class MainSidebar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeEl: '',
      addChannelModal: false,
      invitePeopleModal: false,
    };

    this.handleSelectItem = this.handleSelectItem.bind(this);
    this.handleOpenAddChannel = this.handleOpenAddChannel.bind(this);
    this.handleInvitePeople = this.handleInvitePeople.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
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
      addChannelModal: false,
    });

    handleChangeItem(itemName, itemType);
  }

  handleOpenAddChannel = () => {
    this.setState({ addChannelModal: true });
  }

  handleInvitePeople = () => {
    this.setState({ invitePeopleModal: true });
  }

  handleCloseModal = () => {
    const { addChannelModal, invitePeopleModal } = this.state;

    if (addChannelModal) {
      this.setState({ addChannelModal: false });
    } else if (invitePeopleModal) {
      this.setState({ invitePeopleModal: false });
    }
  }

  render() {
    const {
      channels, users, teamName, teamId, username, isOwner,
    } = this.props;
    const { activeEl, addChannelModal, invitePeopleModal } = this.state;

    console.log('isOwner: ', isOwner);

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
          <div className="channels">
            <div className="sidebar-heading">
              <h5>Channels</h5>
              {isOwner && (
                <Button
                  type="button"
                  className="sidebar-heading__action"
                  onClick={this.handleOpenAddChannel}
                >
                  <FontAwesomeIcon icon={faPlusCircle} />
                </Button>
              )}
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
                    itemType="channel"
                    name={el.name}
                    onClick={e => this.handleSelectItem(e)}
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
                onClick={this.handleMessageUser}
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
                    onClick={e => this.handleSelectItem(e)}
                  >
                    <FontAwesomeIcon icon={faCircle} className="user-status" />
                    {el.name}
                  </Button>
                </li>
              ))}
            </ul>
          </div>
          {isOwner && (
            <div className="invite-people">
              <div className="sidebar-heading">
                <h5>Invite People To Join</h5>
                <Button
                  type="button"
                  className="sidebar-heading__action"
                  onClick={this.handleInvitePeople}
                >
                  <FontAwesomeIcon icon={faPlusCircle} />
                </Button>
              </div>
            </div>
          )}
        </section>
        <AddChannel
          isOpen={addChannelModal}
          teamId={teamId}
          handleCloseAddChannel={() => this.handleCloseModal()}
        />
        <InvitePeople
          isOpen={invitePeopleModal}
          teamId={teamId}
          handleCloseInvitePeople={() => this.handleCloseModal()}
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
  username: '',
  isOwner: false,
  handleChangeItem: () => {},
};

MainSidebar.propTypes = {
  channels: PropTypes.array,
  users: PropTypes.array,
  teamName: PropTypes.string,
  teamId: PropTypes.number,
  username: PropTypes.string,
  isOwner: PropTypes.bool,
  handleChangeItem: PropTypes.func,
};

export default MainSidebar;
