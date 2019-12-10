import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { graphql } from 'react-apollo';
import Grid from '@material-ui/core/Grid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import meQuery from '../../shared/queries/team';

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

// eslint-disable-next-line react/prefer-stateless-function
class Teams extends React.Component {
  render() {
    const {
      data: { loading, error, me },
    } = this.props;

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
            <Grid item xs={12}>
              <ul>
                {teams.map(el => {
                  const { uuid, name, channels, id } = el;
                  const channel = channels[0];

                  return (
                    <li ke={`${uuid}-${id}`}>
                      <Link to={`/dashboard/view/team/${uuid}/channel/${channel.uuid}`}>{name}</Link>
                    </li>
                  );
                })}
              </ul>
            </Grid>
          </Grid>
        </main>
      </Wrapper>
    );
  }
}

Teams.defaultProps = {
  data: {},
};

Teams.propTypes = {
  data: PropTypes.object,
};

export default graphql(meQuery, { options: { fetchPolicy: 'network-only' } })(Teams);
