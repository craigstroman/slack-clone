import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import styled from 'styled-components';
import jwt from 'jsonwebtoken';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserAlt } from '@fortawesome/free-solid-svg-icons';
import PopUpMenu from '../PopUpMenu/PopUpMenu';

const Wrapper = styled.div`
  height: 10%;
  margin-left: 10px;
  margin-right: 10px;
`;

const Header = props => {
  const { match, channels, users } = props;
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
          <h3>{title}</h3>
        </Grid>
        <Grid item xs={6} style={{ textAlign: 'left' }}>
          {match.params.channelId && <FontAwesomeIcon icon={faUserAlt} />}
        </Grid>
        <Grid item xs={6} style={{ textAlign: 'right' }}>
          <PopUpMenu {...props} />
        </Grid>
      </Grid>
    </Wrapper>
  );
};

Header.defaultProps = {
  match: {},
  channels: [],
  users: [],
};

Header.propTypes = {
  match: PropTypes.object,
  channels: PropTypes.array,
  users: PropTypes.array,
};

export default Header;
