import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components';
import { Button, Grid, TextField } from '@material-ui/core';
import validateEmail from '../../shared/util/utils';

const Wrapper = styled.div`
  margin: 0 auto;
  width: 100%;
`;

const Content = styled.div`
  header {
    margin: 0 auto;
    width: 95%;
    h1 {
      text-align: center;
    }
  }
  margin: 0 auto;
  width: 100%;
  form {
    margin: 0 auto;
    text-align: center;
  }
`;

const StyledTextField = styled(TextField)`
  .MuiOutlinedInput-root {
    text-align: left;
    width: 500px;
  }
`;

class Register extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      email: '',
      password: '',
      passwordConfirmation: '',
      fieldErrors: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.validateForm = this.validateForm.bind(this);
  }

  /**
   * Updates state when a value is entered in a field.
   *
   * @param      {Object}  e       The event object.
   */
  handleChange = e => {
    const { name, value } = e.target;

    this.setState({ [name]: value });
  };

  /**
   * Validates the form.
   *
   * @return     {Boolean}  Indicates if the form is valid or invalid.
   */
  validateForm = () => {
    const { email, username, password, passwordConfirmation } = this.state;
    const errors = {};

    if (!email.length) {
      errors.email = 'Email is required.';
    } else if (email.length) {
      if (!validateEmail(email)) {
        errors.email = 'Invalid email.';
      }
    }

    if (!username.length) {
      errors.username = 'Username is required.';
    }

    if (!password.length) {
      errors.password = 'Password is required.';
    } else if (password.length) {
      if (password.length < 5) {
        errors.password = 'Password needs to be greater then 5 characters long.';
      } else if (password.length && password.length >= 5) {
        if (password !== passwordConfirmation) {
          errors.passwordConfirmation = 'Password and Password Confirmation must match.';
        }
      }
    }

    if (!passwordConfirmation.length) {
      errors.passwordConfirmation = 'Password confirmation is required.';
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

  /**
   * Submits the registration.
   *
   * @param      {Object}  e       The event object.
   */
  handleSubmit = async e => {
    const { username, email, password } = this.state;

    if (this.validateForm()) {
      const { mutate } = this.props;

      const response = await mutate({ variables: { username, email, password } });

      const { ok, errors } = response.data.register;

      if (ok) {
        const { history } = this.props;

        history.push('/');
      } else if (errors) {
        const err = {};
        errors.forEach(({ path, message }) => {
          err[`${path}Error`] = message;
        });

        this.setState(err);
      }
    }
  };

  render() {
    const { username, email, password, passwordConfirmation, fieldErrors } = this.state;

    return (
      <Wrapper>
        <Content>
          <header>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <h1>Register</h1>
                <hr />
              </Grid>
            </Grid>
          </header>
          <main>
            <form onSubmit={e => e.preventDefault()}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <StyledTextField
                    label="Email *"
                    type="text"
                    name="email"
                    autoComplete="email"
                    margin="normal"
                    variant="outlined"
                    onChange={e => this.handleChange(e)}
                    onBlur={this.validateForm}
                    error={!fieldErrors.email === false}
                    helperText={fieldErrors.email}
                    value={email}
                  />
                </Grid>
                <Grid item xs={12}>
                  <StyledTextField
                    label="Username *"
                    type="text"
                    name="username"
                    autoComplete="username"
                    margin="normal"
                    variant="outlined"
                    onChange={e => this.handleChange(e)}
                    onBlur={this.validateForm}
                    error={!fieldErrors.username === false}
                    helperText={fieldErrors.username}
                    value={username}
                  />
                </Grid>
                <Grid item xs={12}>
                  <StyledTextField
                    label="Password *"
                    type="password"
                    name="password"
                    autoComplete="password"
                    margin="normal"
                    variant="outlined"
                    onChange={e => this.handleChange(e)}
                    onBlur={this.validateForm}
                    error={!fieldErrors.password === false}
                    helperText={fieldErrors.password}
                    value={password}
                  />
                </Grid>
                <Grid item xs={12}>
                  <StyledTextField
                    label="Password Confirmation *"
                    type="password"
                    name="passwordConfirmation"
                    autoComplete="passwordConfirmation"
                    margin="normal"
                    variant="outlined"
                    onChange={e => this.handleChange(e)}
                    onBlur={this.validateForm}
                    error={!fieldErrors.passwordConfirmation === false}
                    helperText={fieldErrors.passwordConfirmation}
                    value={passwordConfirmation}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button type="button" variant="contained" color="primary" onClick={this.handleSubmit}>
                    Register
                  </Button>
                </Grid>
              </Grid>
            </form>
          </main>
        </Content>
      </Wrapper>
    );
  }
}

const registerMutation = gql`
  mutation($username: String!, $email: String!, $password: String!) {
    register(username: $username, email: $email, password: $password) {
      ok
      errors {
        path
        message
      }
    }
  }
`;

Register.defaultProps = {
  history: {},
};

Register.propTypes = {
  history: PropTypes.object,
};

export default graphql(registerMutation)(Register);
