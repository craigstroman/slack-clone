import React from 'react';
import PropTypes from 'prop-types';
import { gql, graphql } from 'react-apollo';
import {
  Col, Button, Form, FormGroup, Label, Input,
} from 'reactstrap';
import './Register.scss';

class Register extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      usernameError: '',
      email: '',
      emailError: '',
      password: '',
      passwordError: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    const { name, value } = e.target;

    this.setState({ [name]: value });
  }

  async handleSubmit(e) {
    const { username, email, password } = this.state;

    const { mutate } = this.props;

    const response = await mutate({ variables: { username, email, password } });

    console.log('response: ', response);

    const { ok, errors } = response.data.register;

    if (ok) {
      const { history } = this.props;

      history.push('/');
    } else {
      const err = {};
      errors.forEach(({ path, message }) => {
        // err['passwordError'] = 'too long..';
        err[`${path}Error`] = message;
      });

      this.setState(err);
    }
  }

  render() {
    const {
      username,
      email,
      password,
      usernameError,
      emailError,
      passwordError,
    } = this.state;

    const errorList = [];

    if (usernameError) {
      errorList.push(usernameError);
    }

    if (emailError) {
      errorList.push(emailError);
    }

    if (passwordError) {
      errorList.push(passwordError);
    }

    return (
      <div className="container">
        <header>
          <div className="header">
            <h1 className="text-center">Register</h1>
          </div>
        </header>
        <main>
          { usernameError || emailError || passwordError ? (
            <div className="row">
              <div className="col-md-12 text-center">
                <div>
                  There was some errors with your submision:
                </div>
              </div>
            </div>
          ) : null }
          <FormGroup row>
            <Label for="username" md={12}>
              Username:
            </Label>
            <Col md={12}>
              <Input
                type="text"
                className="form-control"
                name="username"
                id="username"
                placeholder="Username..."
                value={username}
                onChange={this.handleChange}
              />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="email" md={12}>
              Email address:
            </Label>
            <Col md={12}>
              <Input
                type="text"
                className="form-control"
                name="email"
                id="email"
                placeholder="you@host.com"
                value={email}
                onChange={this.handleChange}
              />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="password" md={12}>
              Password:
            </Label>
            <Col md={12}>
              <Input
                type="password"
                className="form-control"
                name="password"
                id="password"
                placeholder="Password.."
                value={password}
                onChange={this.handleChange}
              />
            </Col>
          </FormGroup>
          <Button
            type="submit"
            color="primary"
            onClick={this.handleSubmit}
          >
            Register
          </Button>
        </main>
      </div>
    );
  }
}

const registerMutation = gql`
  mutation($username: String!, $email: String!, $password: String!) {
    register(username: $username, email: $email, password: $password)
  }
`;

Register.defaultProps = {
  history: {},
  // historypush: () => {},
};

Register.propTypes = {
  history: PropTypes.object,
  // history.push: PropTypes.func,
};

export default graphql(registerMutation)(Register);
