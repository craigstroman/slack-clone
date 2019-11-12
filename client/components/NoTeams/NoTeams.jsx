import React from 'react';
import { Grid } from '@material-ui/core';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: block;
  width: 100%;
`;

const NoTeams = () => (
  <Wrapper>
    <Grid container spacing={3}>
      <Grid item xs={12}>
        You need to&nbsp;
        <a href="/create-team">create a team</a>.
      </Grid>
    </Grid>
  </Wrapper>
);

export default NoTeams;
