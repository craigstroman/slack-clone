import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import {
  Button, Form, FormGroup, Label, Input,
} from 'reactstrap';
import gql from 'graphql-tag';
import './Login.scss';

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      fieldErrors: [],
      errors: false,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.validateForm = this.validateForm.bind(this);
    this.validateEmail = this.validateEmail.bind(this);
  }

  /**
   * Updates the state when inputs change.
   *
   * @param      {Object}   e   The event object.
   */
  handleChange = (e) => {
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
  }

  /**
   * Validates a email.
   *
   * @return     {boolean}  Indicates if a email is valid.
   */
  validateEmail = () => {
    const { email } = this.state;
    const emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (emailRex.test(email)) {
      return true;
    }

    return false;
  }

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
      if (!this.validateEmail()) {
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

    return true;
  }

  /**
   * Handles the form submit
   *
   * @param      {Object}  e   The event object.
   */
  handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = this.state;

    if (this.validateForm()) {
      const { mutate, history } = this.props;
      const response = await mutate({ variables: { email, password } });

      const {
        ok, teamUUID, channelUUID, token, refreshToken,
      } = response.data.login;

      if (ok) {
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);

        if (teamUUID !== null) {
          history.push(`/dashboard/view/team/${teamUUID}/channel/${channelUUID}`);
        } else {
          history.push('/dashboard/view/team/');
        }
      } else {
        this.setState({ errors: true });
      }
    }
  }

  render() {
    const {
      email, password, errors, fieldErrors,
    } = this.state;

    return (
      <div className="login-container">
        <header>
          <div className="header">
            <h1 className="text-center">
              Login
            </h1>
            <hr />
          </div>
        </header>
        <main>
          <div className="content">
            <div
              className={errors ? 'error visible' : 'error'}
            >
              <div className="alert alert-danger">
                Invalid email or password.
              </div>
            </div>
          </div>
          <Form>
            <FormGroup className="row">
              <Label for="email" className="col-md-2 col-form-label">Email:</Label>
              <div className="col-md-10">
                <Input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="you@host.com"
                  value={email}
                  onChange={this.handleChange}
                  className={fieldErrors.email ? 'input-error' : ''}
                />
                <div className="errors">
                  {fieldErrors.email}
                </div>
              </div>
            </FormGroup>
            <FormGroup className="row">
              <Label for="password" className="col-md-2 col-form-label">Password:</Label>
              <div className="col-md-10">
                <Input
                  type="password"
                  name="password"
                  id="password"
                  value={password}
                  onChange={this.handleChange}
                  className={fieldErrors.email ? 'input-error' : ''}
                />
                <div className="errors">
                  {fieldErrors.password}
                </div>
              </div>
            </FormGroup>
            <div className="row">
              <div className="col text-center">
                <Button
                  type="submit"
                  color="primary"
                  className="mx-auto"
                  onClick={e => this.handleSubmit(e)}
                >
                  Login
                </Button>
              </div>
            </div>
          </Form>
        </main>
      </div>
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
