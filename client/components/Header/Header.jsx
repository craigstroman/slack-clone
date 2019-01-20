import React from 'react';
import {
  Dropdown, DropdownToggle, DropdownMenu, DropdownItem,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import './Header.scss';

class Header extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dropdownOpen: false,
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    const { dropdownOpen } = this.state;

    this.setState({
      dropdownOpen: !dropdownOpen,
    });
  }

  render() {
    const { dropdownOpen } = this.state;

    return (
      <div className="header">
        <div className="row">
          <div className="col-md-6 text-left">
            <div className="channel-name">
              Channel Name
            </div>
            <div className="channel-users">
              Channel Users
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
                <FontAwesomeIcon icon={faEllipsisV} />
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem>Settings</DropdownItem>
                <DropdownItem>Logout</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
      </div>
    );
  }
}

export default Header;
