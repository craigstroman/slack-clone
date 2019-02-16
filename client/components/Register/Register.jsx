import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import {
  Button, Col, Form, FormGroup, Label, Input,
} from 'reactstrap';
import gql from 'graphql-tag';
import './Register.scss';

class Register extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      email: '',
      password: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange = (e) => {
    const { name, value } = e.target;

    this.setState({ [name]: value });
  }

  handleSubmit = async (e) => {
    const { username, email, password } = this.state;

    if (username.length && email.length && password.length) {
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
  }

  render() {
    const {
      username,
      email,
      password,
    } = this.state;

    return (
      <div className="container">
        <header>
          <div className="header">
            <h1 className="text-center">
              Register
            </h1>
          </div>
        </header>
        <main>
          <Form>
            <FormGroup row>
              <Label for="username" md={2}>
                Username:
              </Label>
              <Col md={10}>
                <Input
                  type="text"
                  name="username"
                  value={username}
                  onChange={e => this.handleChange(e)}
                />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label for="email" md={2}>
                Email:
              </Label>
              <Col md={10}>
                <Input
                  type="email"
                  name="email"
                  value={email}
                  placeholder="you@host.com"
                  onChange={e => this.handleChange(e)}
                />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label for="password" md={2}>
                Password:
              </Label>
              <Col md={10}>
                <Input
                  type="password"
                  name="password"
                  value={password}
                  onChange={e => this.handleChange(e)}
                />
              </Col>
            </FormGroup>
            <div className="row">
              <div className="col-md-12 text-center">
                <Button
                  type="submit"
                  color="primary"
                  onClick={this.handleSubmit}
                >
                  Register
                </Button>
              </div>
            </div>
          </Form>
        </main>
      </div>
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
