import React from 'react';
import PropTypes from 'prop-types';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components';
import { Button, Grid, TextField } from '@material-ui/core';
import validateEmail from '../../shared/util/utils';

const Wrapper = styled.div`
  margin-top: 10px;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
`;

const Content = styled.div`
  header {
    margin: 0 auto;
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
      usernameVerified: false,
      emailVerified: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.verifyEmail = this.verifyEmail.bind(this);
    this.verifyUser = this.verifyUser.bind(this);
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
   * Checks wether or not a email is alredy registered.
   *
   * @param      {Object}  e      The event object.
   */
  verifyEmail = async e => {
    const { target } = e;
    const { value } = target;
    const { client } = this.props;

    if (value.length) {
      try {
        const res = await client.query({
          query: gql`
            query($email: String) {
              verifyEmail(email: $email)
            }
          `,
          variables: {
            email: value,
          },
        });
        const { data } = res;
        const { verifyEmail } = data;

        if (verifyEmail) {
          this.setState({ emailVerified: true });

          this.validateForm();
        } else if (!verifyEmail) {
          this.setState({
            emailVerified: false,
          });

          this.validateForm();
        }
      } catch (err) {
        console.log(`There was an error: ${err}`);
      }
    }
  };

  /**
   * Checks wether or not a username is already registered.
   *
   * @param      {Object}  e     The event object.
   */
  verifyUser = async e => {
    const { target } = e;
    const { value } = target;
    const { client } = this.props;

    if (value.length) {
      try {
        const res = await client.query({
          query: gql`
            query($username: String) {
              verifyUser(username: $username)
            }
          `,
          variables: {
            username: value,
          },
        });

        const { data } = res;
        const { verifyUser } = data;

        if (verifyUser) {
          this.setState({ usernameVerified: true });

          this.validateForm();
        } else {
          this.setState({ usernameVerified: false });

          this.validateForm();
        }
      } catch (err) {
        console.log(`There was an error: ${err}`);
      }
    }
  };

  /**
   * Validates the form.
   *
   * @return     {Boolean}  Indicates if the form is valid or invalid.
   */
  validateForm = () => {
    const {
      email,
      fieldErrors,
      username,
      password,
      passwordConfirmation,
      recaptchaVerified,
      emailVerified,
      usernameVerified,
    } = this.state;
    const errors = {};

    if (!email.length) {
      errors.email = 'Email is required.';
    } else if (email.length) {
      if (!validateEmail(email)) {
        errors.email = 'Email invalid or or already taken.';
      } else if (emailVerified) {
        errors.email = 'Email invalid or or already taken.';
      }
    }

    if (!username.length) {
      errors.username = 'Username is required.';
    } else if (username.length < 3) {
      errors.username = 'The username needs to be between 3 and 25 characters long.';
    } else if (usernameVerified) {
      errors.username = `Username ${username} is not available.`;
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
      const { client } = this.props;

      const response = await client.mutate({
        mutation: gql`
          mutation($username: String!, $email: String!, $password: String!) {
            register(username: $username, email: $email, password: $password) {
              ok
              errors {
                path
                message
              }
            }
          }
        `,
        variables: { username, email, password },
      });

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
    const {
      username,
      email,
      password,
      passwordConfirmation,
      fieldErrors,
      usernameVerified,
      emailVerified,
    } = this.state;

    return (
      <Wrapper>
        <Content>
          <header>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <h1>Slack Clone - Register</h1>
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
                    onChange={e => {
                      this.handleChange(e);
                      this.verifyEmail(e);
                    }}
                    onBlur={this.validateForm}
                    error={!fieldErrors.email === false || emailVerified === true}
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
                    onChange={e => {
                      this.handleChange(e);
                      this.verifyUser(e);
                    }}
                    onBlur={this.validateForm}
                    error={!fieldErrors.username === false || usernameVerified === true}
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

Register.defaultProps = {
  client: {},
  history: {},
};

Register.propTypes = {
  client: PropTypes.object,
  history: PropTypes.object,
};

export default withApollo(Register);
