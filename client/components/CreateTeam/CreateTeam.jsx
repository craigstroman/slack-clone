import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
// import { Button, Col, Form, FormGroup, Label, Input } from 'reactstrap';
import { Button, Grid, TextField } from '@material-ui/core';
import styled, { ThemeProvider } from 'styled-components';
import gql from 'graphql-tag';
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
    form {
      margin: 0 auto;
      text-align: center;
    }
  }
`;

const StyledTextField = styled(TextField)`
  .MuiOutlinedInput-root {
    text-align: left;
    width: 500px;
  }
`;

class CreateTeam extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      fieldErrors: '',
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.validateForm = this.validateForm.bind(this);
  }

  validateForm = () => {
    const { name } = this.state;
    const errors = {};

    if (!name.length) {
      errors.name = 'Team name is required.';
    }

    if (Object.keys(errors).length >= 1) {
      this.setState({
        fieldErrors: errors,
      });

      return false;
    }

    this.setState({
      fieldErrors: errors,
    });

    return true;
  };

  handleChange = e => {
    const { value } = e.target;

    this.setState({ name: value });
  };

  handleSubmit = async () => {
    const { name } = this.state;
    let response = null;

    if (name.length) {
      const { mutate, history } = this.props;

      try {
        response = await mutate({ variables: { name } });
      } catch (err) {
        history.push('/login');
      }

      const { ok, errors, team } = response.data.createTeam;

      if (ok) {
        history.push(`/dashboard/view/team/${team.uuid}`);
      } else {
        const err = {};
        errors.forEach(({ path, message }) => {
          err[`${path}Error`] = message;
        });

        this.errors = err;
      }
    }
  };

  render() {
    const { name, errors, fieldErrors } = this.state;

    console.log('fieldErrors: ', fieldErrors);

    return (
      <ThemeProvider theme={theme}>
        <Wrapper>
          <header>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <h1>Slack Clone - Create A Team</h1>
                <hr />
              </Grid>
            </Grid>
          </header>
          <main>
            <form
              onSubmit={e => {
                e.preventDefault();
              }}
            >
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <StyledTextField
                    label="Team Name *"
                    type="text"
                    name="name"
                    margin="normal"
                    variant="outlined"
                    onChange={e => this.handleChange(e)}
                    onBlur={this.validateForm}
                    error={!fieldErrors.name === false}
                    helperText={fieldErrors.name}
                    value={name}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button type="button" variant="contained" color="primary" onClick={this.handleSubmit}>
                    Create Team
                  </Button>
                </Grid>
              </Grid>
            </form>
          </main>
        </Wrapper>
      </ThemeProvider>
    );
  }
}

const createTeamMutation = gql`
  mutation($name: String!) {
    createTeam(name: $name) {
      ok
      team {
        id
        uuid
      }
      errors {
        path
        message
      }
    }
  }
`;

CreateTeam.defaultProps = {
  history: {},
  mutate: () => {},
};

CreateTeam.propTypes = {
  history: PropTypes.object,
  mutate: PropTypes.func,
};

export default graphql(createTeamMutation)(CreateTeam);
