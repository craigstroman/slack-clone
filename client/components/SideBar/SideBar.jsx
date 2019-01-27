import React from 'react';
import PropTypes from 'prop-types';
import Channels from '../../containers/Channels/Channels';
import Users from '../../containers/Users/Users';
import './Sidebar.scss';

class Sidebar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeEl: '',
    };

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    const { parentNode } = e.target;
    const elId = parentNode.id;

    setTimeout(() => {
      this.setState({
        activeEl: elId,
      });
    }, 100);
  }

  render() {
    const { channels, users } = this.props;
    const { activeEl } = this.state;

    return (
      <div className="sidebar-content">
        <header>
          <h2 className="sidebar-title">Team Name</h2>
        </header>
        <section>
          <Channels activeEl={activeEl} channels={channels} handleClick={this.handleClick} />
          <Users activeEl={activeEl} users={users} handleClick={this.handleClick} />
        </section>
      </div>
    );
  }
}

Sidebar.defaultProps = {
  channels: [],
  users: [],
};

Sidebar.propTypes = {
  channels: PropTypes.array,
  users: PropTypes.array,
};

export default Sidebar;