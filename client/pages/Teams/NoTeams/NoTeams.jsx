import React from 'react';
import { Grid } from '@material-ui/core';
import styled from 'styled-components';
import PopUpMenu from '../../../components/PopUpMenu/PopUpMenu';

const Wrapper = styled.div`
  margin: 0 auto;
  width: 100%;
  header {
    h1 {
      text-align: center;
    }
  }
  main {
    margin: 0 auto;
    text-align: center;
  }
`;

const NoTeams = props => (
  <Wrapper>
    <header>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <h1>Slack Clone - No Teams</h1>
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
          You need to&nbsp;
          <a href="/create-team">create a team</a>.
        </Grid>
      </Grid>
    </main>
  </Wrapper>
);

export default NoTeams;
