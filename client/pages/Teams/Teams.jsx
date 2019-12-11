import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import styled, { ThemeProvider } from 'styled-components';
import { graphql } from 'react-apollo';
import Grid from '@material-ui/core/Grid';
import meQuery from '../../shared/queries/team';
import PopUpMenu from '../../components/PopUpMenu/PopUpMenu';
import theme from '../../shared/themes';

const Wrapper = styled.div`
  margin: 0 auto;
  width: 100%;
  header {
    h1 {
      text-align: center;
    }
  }
  main {
    ul {
      list-style-type: none;
    }
  }
`;

const StyledTextLink = styled(Link)`
  color: ${props => props.theme.colors.black};
  &:hover,
  &:focus,
  &:active {
    color: ${props => props.theme.colors.black};
  }
`;

const Teams = props => {
  const {
    data: { loading, error, me },
  } = props;

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>There was an error {error}.</div>;
  }

  const { username, teams } = me;

  if (!teams.length) {
    return <div>No teams, you need to join a team.</div>;
  }

  return (
    <ThemeProvider theme={theme}>
      <Wrapper>
        <header>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <h1>Teams for {username}</h1>
              <hr />
            </Grid>
          </Grid>
        </header>
        <main>
          <Grid container spacing={3}>
            <Grid item xs={12} style={{ textAlign: 'right' }}>
              <PopUpMenu {...props} />
            </Grid>
            <Grid item xs={12}>
              <ul>
                {teams.map(el => {
                  const { uuid, name, channels, id } = el;
                  const channel = channels[0];

                  return (
                    <li key={`${uuid}-${id}`}>
                      <StyledTextLink to={`/dashboard/view/team/${uuid}/channel/${channel.uuid}`}>
                        {name}
                      </StyledTextLink>
                    </li>
                  );
                })}
              </ul>
            </Grid>
          </Grid>
        </main>
      </Wrapper>
    </ThemeProvider>
  );
};

Teams.defaultProps = {
  data: {},
};

Teams.propTypes = {
  data: PropTypes.object,
};

export default graphql(meQuery, { options: { fetchPolicy: 'network-only' } })(Teams);
