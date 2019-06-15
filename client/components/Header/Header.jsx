import React from 'react';
import PropTypes from 'prop-types';
import {
  Dropdown, DropdownToggle, DropdownMenu, DropdownItem,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faUserAlt } from '@fortawesome/free-solid-svg-icons';
import './Header.scss';

class Header extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dropdownOpen: false,
    };

    this.toggle = this.toggle.bind(this);
    this.logout = this.logout.bind(this);
  }

  /**
   * Logs a user out.
   *
   */
  logout = () => {
    const { history } = this.props;

    localStorage.removeItem('refreshToken');
    localStorage.removeItem('token');

    history.push('/');
  }

  /**
   * Toggles the dropdown.
   *
   */
  toggle = () => {
    const { dropdownOpen } = this.state;

    this.setState({
      dropdownOpen: !dropdownOpen,
    });
  }

  render() {
    const { dropdownOpen } = this.state;
    const { match, channels } = this.props;
    let title = '';

    if (match.params.channelId) {
      const channel = channels.filter(el => (el.uuid === match.params.channelId));

      title = `#${channel[0].name}`;
    } else if (match.params.userId) {
      // left empty for now.
    }

    return (
      <div className="header">
        <div className="row">
          <div className="col-md-12 text-left">
            <b>
              {title}
            </b>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 text-left">
            <div className="channel-users">
              <FontAwesomeIcon icon={faUserAlt} />
            </div>
          </div>
          <div className="col-md-6 text-right">
            <Dropdown isOpen={dropdownOpen} toggle={this.toggle}>
              <DropdownToggle
                tag="span"
                onClick={this.toggle}
                data-toggle="dropdown"
                aria-expanded={dropdownOpen}
              >
                <FontAwesomeIcon icon={faCog} className="settings-icon" />
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem>Settings</DropdownItem>
                <DropdownItem
                  className="btn btn-link"
                  onClick={this.logout}
                >
                  Logout
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
      </div>
    );
  }
}

Header.defaultProps = {
  history: {},
  match: {},
  channels: [],
};

Header.propTypes = {
  history: PropTypes.object,
  match: PropTypes.object,
  channels: PropTypes.array,
};

export default Header;
