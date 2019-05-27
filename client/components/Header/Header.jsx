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

  logout = () => {
    const { history } = this.props;

    localStorage.removeItem('refreshToken');
    localStorage.removeItem('token');

    history.push('/');
  }

  toggle = () => {
    const { dropdownOpen } = this.state;

    this.setState({
      dropdownOpen: !dropdownOpen,
    });
  }

  render() {
    const { dropdownOpen } = this.state;
    const { itemName, match } = this.props;
    let title = '';

    if (match.params.channelId) {
      title = `#${itemName}`;
    } else if (match.params.userId) {
      title = itemName;
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
  itemName: '',
};

Header.propTypes = {
  history: PropTypes.object,
  match: PropTypes.object,
  itemName: PropTypes.string,
};

export default Header;
