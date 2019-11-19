import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styled, { ThemeProvider } from 'styled-components';
import { IconButton } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faCircle } from '@fortawesome/free-solid-svg-icons';
import InvitePeople from '../InvitePeople/InvitePeople';
import Channels from '../Channels/Channels';
import DirectMessages from '../DirectMessages/DirectMessages';
import clearFix from '../../shared/themes/mixins';
import theme from '../../shared/themes';

const Wrapper = styled.div`
  padding-top: 15px;
`;

const Header = styled.header`
  h2 {
    color: ${props => props.theme.colors.white};
    text-align: center;
  }
`;

const User = styled.div`
  margin: 0 auto;
  text-align: center;
  h6 {
    color: ${props => props.theme.colors.white};
    display: inline-block;
    text-align: center;
  }
  svg {
    color: ${props => props.theme.colors.jungleGreen};
    font-size: 0.85em;
    margin-right: 5px;
  }
  ${clearFix()}
`;

const Invite = styled.section`
  color: ${props => props.theme.colors.shadyLady};
  display: block;
  height: 40px;
  width: 100%;
  h5,
  button {
    float: left;
  }

  h5 {
    margin-left: ${props => props.theme.sidebar.marginLeft};
  }

  button {
    bottom: 13px;
    color: ${props => props.theme.colors.shadyLady};
    margin-left: 10px;
  }
`;

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
   * Sets which item is selected when component loads.
   */
  componentDidMount = () => {
    const { match, channels, teamMembers } = this.props;

    if (match.params.channelId) {
      const channel = channels.filter(el => el.uuid === match.params.channelId);

      this.setState({ activeEl: channel[0].uuid });
    } else if (match.params.userId) {
      const user = teamMembers.filter(el => el.uuid === match.params.userId);

      this.setState({ activeEl: user[0].uuid });
    }
  };

  /**
   * Sets the selected channel if a team is changed.  Will select general channel of team.
   *
   * @param      {Object}  prevProps  The previous properties.
   */
  componentDidUpdate = prevProps => {
    const { match, channels } = this.props;

    if (match.params.channelId) {
      if (prevProps.match.params.channelId !== match.params.channelId) {
        const channel = channels.filter(el => el.uuid === match.params.channelId);

        this.setState({ activeEl: channel[0].uuid });
      }
    }
  };

  /**
   * Handles getting the selected user.
   *
   * @param      {Object}  user    The user.
   */
  handleGetUser = user => {
    this.setState({ user, activeEl: user.uuid });
  };

  /**
   * Sets focus to an item selected in the sidebar.
   *
   */
  handleSelectItem = e => {
    const { currentTarget } = e;
    const { parentNode } = currentTarget;
    const elId = parentNode.id;

    this.setState({
      activeEl: elId,
    });
  };

  /**
   * Opens the invite people modal.
   *
   */
  handleOpenInvitePeople = () => {
    this.setState({ invitePeopleModal: true });
  };

  /**
   * Closes the invite people modal.
   *
   */
  handleCloseInvitePeople = () => {
    this.setState({ invitePeopleModal: false });
  };

  render() {
    const { channels, directMessageUsers, teamName, teamId, teamUUID, currentUser, isOwner } = this.props;
    const { activeEl, invitePeopleModal, user } = this.state;

    return (
      <ThemeProvider theme={theme}>
        <Wrapper>
          <Header>
            <h2>{teamName}</h2>
            <User>
              <FontAwesomeIcon icon={faCircle} className="user-status" />
              <h6>{currentUser.username}</h6>
            </User>
          </Header>
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
                directMessageUsers={directMessageUsers}
                user={currentUser}
                messageUser={user}
                activeEl={activeEl}
                selectItem={this.handleSelectItem}
                handleGetUser={this.handleGetUser}
                teamId={teamId}
                teamUUID={teamUUID}
                {...this.props}
              />
            </Fragment>
            {isOwner && (
              <Invite>
                <h5>Invite People To Join</h5>
                <IconButton
                  type="button"
                  className="sidebar-heading__action"
                  onClick={this.handleOpenInvitePeople}
                >
                  <FontAwesomeIcon icon={faPlusCircle} />
                </IconButton>
              </Invite>
            )}
          </section>
          <InvitePeople
            isOpen={invitePeopleModal}
            teamId={teamId}
            handleCloseInvitePeople={() => this.handleCloseInvitePeople()}
          />
        </Wrapper>
      </ThemeProvider>
    );
  }
}

MainSidebar.defaultProps = {
  channels: [],
  directMessageUsers: [],
  teamMembers: [],
  teamName: '',
  teamId: null,
  teamUUID: null,
  currentUser: null,
  isOwner: false,
  match: {},
};

MainSidebar.propTypes = {
  channels: PropTypes.array,
  directMessageUsers: PropTypes.array,
  teamMembers: PropTypes.array,
  teamName: PropTypes.string,
  teamId: PropTypes.number,
  teamUUID: PropTypes.string,
  currentUser: PropTypes.object,
  isOwner: PropTypes.bool,
  match: PropTypes.object,
};

export default MainSidebar;
