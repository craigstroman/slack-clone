import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { Button, Grid, IconButton, InputAdornment, Snackbar, TextField } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { updateSubScription } from '../../apollo';
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
    width: 450px;
  }
`;

const StyledSnackbar = styled(Snackbar)`
  .MuiTypography-root {
    background-color: #d32f2f;
  }
`;

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      fieldErrors: [],
      errors: false,
      hidden: true,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.validateForm = this.validateForm.bind(this);
    this.togglePasswordMask = this.togglePasswordMask.bind(this);
  }

  togglePasswordMask = () => {
    const { hidden } = this.state;

    if (hidden) {
      this.setState({
        hidden: false,
      });
    } else {
      this.setState({
        hidden: true,
      });
    }
  };

  /**
   * Updates the state when inputs change.
   *
   * @param      {Object}   e   The event object.
   */
  handleChange = e => {
    const { name, value } = e.target;

    if (name === 'email') {
      this.setState({
        email: value,
      });
    }

    if (name === 'password') {
      this.setState({
        password: value,
      });
    }
  };

  /**
   * Validates the form.
   *
   * @return     {boolean}  Indicates if a form is valid.
   */
  validateForm = () => {
    const { email, password } = this.state;
    const errors = {};

    if (!email.length) {
      errors.email = 'Email is required.';
    } else if (email.length >= 1) {
      if (!validateEmail(email)) {
        errors.email = 'Invalid email.';
      }
    }

    if (!password.length) {
      errors.password = 'Password is required.';
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
   * Handles the form submit
   *
   * @param      {Object}  e   The event object.
   */
  handleSubmit = async e => {
    e.preventDefault();
    const { email, password } = this.state;

    if (this.validateForm()) {
      const { mutate, history } = this.props;
      const response = await mutate({ variables: { email, password } });

      const { ok, teamUUID, channelUUID, token, refreshToken } = response.data.login;

      if (ok) {
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);

        const tokens = {
          token: localStorage.getItem('token'),
          refreshToken: localStorage.getItem('refreshToken'),
        };

        updateSubScription(tokens);

        if (teamUUID !== null) {
          history.push(`/dashboard/view/team/${teamUUID}/channel/${channelUUID}`);
        } else {
          history.push('/dashboard/view/team/');
        }
      } else {
        this.setState({ errors: true });
      }
    }
  };

  render() {
    const { email, password, errors, fieldErrors, hidden } = this.state;

    return (
      <Wrapper>
        <Content>
          <main>
            <form>
              {errors && (
                <StyledSnackbar
                  open={errors}
                  message="Invalid email or password."
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                />
              )}
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <StyledTextField
                    label="Email *"
                    type="email"
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
                    label="Password *"
                    type={hidden ? 'password' : 'text'}
                    name="password"
                    autoComplete="current-password"
                    margin="normal"
                    variant="outlined"
                    onChange={e => this.handleChange(e)}
                    onBlur={this.validateForm}
                    error={!fieldErrors.password === false}
                    helperText={fieldErrors.password}
                    value={password}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            title={hidden ? 'Show Password' : 'Hide Password'}
                            onClick={this.togglePasswordMask}
                          >
                            <FontAwesomeIcon
                              icon={hidden ? faEyeSlash : faEye}
                              style={{ cursor: 'pointer' }}
                            />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="button"
                    variant="contained"
                    color="primary"
                    onClick={e => this.handleSubmit(e)}
                  >
                    Login
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

const loginMutation = gql`
  mutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      ok
      teamUUID
      channelUUID
      token
      refreshToken
      errors {
        path
        message
      }
    }
  }
`;

Login.defaultProps = {
  history: {},
};

Login.propTypes = {
  history: PropTypes.object,
};

export default graphql(loginMutation)(Login);
