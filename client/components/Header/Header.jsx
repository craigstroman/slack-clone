import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faUserAlt } from '@fortawesome/free-solid-svg-icons';
import jwt from 'jsonwebtoken';

const Wrapper = styled.div`
  height: 10%;
  margin-left: 10px;
  margin-right: 10px;
`;

class Header extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      anchorEl: null,
    };

    this.logout = this.logout.bind(this);
    this.teams = this.teams.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
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
  };

  teams = () => {
    const { history } = this.props;

    history.push('/teams');

    this.handleClose();
  };

  handleOpen = e => {
    const { currentTarget } = e;

    this.setState({
      anchorEl: currentTarget,
    });
  };

  handleClose = () => {
    this.setState({
      anchorEl: null,
    });
  };

  render() {
    const { anchorEl } = this.state;
    const { match, channels, users } = this.props;
    const token = jwt.decode(localStorage.getItem('token'));
    let title = '';

    if (match.params.channelId) {
      const channel = channels.filter(el => el.uuid === match.params.channelId);

      title = `#${channel[0].name}`;
    } else if (match.params.userId) {
      const user = users.filter(el => el.uuid === match.params.userId);

      if (user[0].id === token.user.id) {
        title = `${user[0].username} (you)`;
      } else {
        title = `${user[0].username}`;
      }
    }

    return (
      <Wrapper>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <h4>{title}</h4>
          </Grid>
          <Grid item xs={6} style={{ textAlign: 'left' }}>
            {match.params.channelId && <FontAwesomeIcon icon={faUserAlt} />}
          </Grid>
          <Grid item xs={6} style={{ textAlign: 'right' }}>
            <Button aria-controls="settings-menu" aria-haspopup="true" onClick={e => this.handleOpen(e)}>
              <FontAwesomeIcon icon={faCog} className="settings-icon" />
            </Button>
            <Menu
              id="settings-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={this.handleClose}
            >
              <MenuItem onClick={this.teams}>Teams</MenuItem>
              <MenuItem onClick={this.logout}>Logout</MenuItem>
            </Menu>
          </Grid>
        </Grid>
      </Wrapper>
    );
  }
}

Header.defaultProps = {
  history: {},
  match: {},
  channels: [],
  users: [],
};

Header.propTypes = {
  history: PropTypes.object,
  match: PropTypes.object,
  channels: PropTypes.array,
  users: PropTypes.array,
};

export default Header;
