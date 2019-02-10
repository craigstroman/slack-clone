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

  logout() {
    const { history } = this.props;

    localStorage.removeItem('refreshToken');
    localStorage.removeItem('token');

    history.push('/');
  }

  toggle() {
    const { dropdownOpen } = this.state;

    this.setState({
      dropdownOpen: !dropdownOpen,
    });
  }

  render() {
    const { dropdownOpen } = this.state;
    const { channelName } = this.props;

    return (
      <div className="header">
        <div className="row">
          <div className="col-md-12 text-left">
            <b>
              #&nbsp;
              {channelName}
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
  channelName: '',
};

Header.propTypes = {
  history: PropTypes.object,
  channelName: PropTypes.string,
};

export default Header;
