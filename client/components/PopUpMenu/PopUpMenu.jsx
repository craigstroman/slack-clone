import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import styled, { ThemeProvider } from 'styled-components';
import { Button, Menu, MenuItem } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import theme from '../../shared/themes';

const StyledTextLink = styled(Link)`
  color: ${props => props.theme.colors.black};
  &:hover,
  &:focus,
  &:active {
    color: ${props => props.theme.colors.black};
  }
`;

const StyledMenu = styled(Menu)`
  .MuiMenu-paper {
    top: 83px !important;
  }
`;

class PopUpMenu extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      anchorEl: null,
    };

    this.logout = this.logout.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

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

  logout = () => {
    const { history } = this.props;

    localStorage.removeItem('refreshToken');
    localStorage.removeItem('token');

    history.push('/');
  };

  render() {
    const { anchorEl } = this.state;

    return (
      <Fragment>
        <ThemeProvider theme={theme}>
          <Button aria-controls="settings-menu" aria-haspopup="true" onClick={e => this.handleOpen(e)}>
            <FontAwesomeIcon icon={faCog} className="settings-icon" />
          </Button>
          <StyledMenu
            id="settings-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={this.handleClose}
          >
            <MenuItem onClick={this.handleClose}>
              <StyledTextLink to="/teams">Teams</StyledTextLink>
            </MenuItem>
            <MenuItem onClick={this.logout}>
              <StyledTextLink to="/">Logout</StyledTextLink>
            </MenuItem>
          </StyledMenu>
        </ThemeProvider>
      </Fragment>
    );
  }
}

PopUpMenu.defaultProps = {
  history: {},
};

PopUpMenu.propTypes = {
  history: PropTypes.object,
};

export default PopUpMenu;
