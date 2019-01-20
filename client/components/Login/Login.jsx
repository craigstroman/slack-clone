import React from 'react';
import PropTypes from 'prop-types';
import { extendObservable } from 'mobx';
import { observer } from 'mobx-react';
import { gql, graphql } from 'react-apollo';
import { Button } from 'reactstrap';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import './Login.scss';

@observer
class Login extends React.Component {
  constructor(props) {
    super(props);

    extendObservable(this, {
      email: '',
      password: '',
      errors: false,
    });

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    const { name, value } = e.target;
    this[name] = value;
  }

  async handleSubmit() {
    const { email, password } = this;

    if (email.length && password.length) {
      const { mutate, history } = this.props;

      const response = await mutate({ variables: { email, password } });

      const { ok, token, refreshToken } = response.data.login;

      if (ok) {
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);

        history.push('/dashboard');
      } else {
        this.errors = true;
      }
    }
  }

  render() {
    const { email, password, errors } = this;

    return (
      <div className="container">
        <header>
          <div className="header">
            <h1 className="text-center">
              Login
            </h1>
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
            <AvForm>
              <AvField
                label="Email:"
                type="email"
                name="email"
                value={email}
                placeholder="you@host.com"
                onChange={this.handleChange}
                validate={{
                  required: { value: true, errorMessage: 'Please enter a username.' },
                }}
              />
              <AvField
                label="Password:"
                type="password"
                name="password"
                value={password}
                onChange={this.handleChange}
                validate={{
                  required: { value: true, errorMessage: 'Please enter a password.' },
                }}
              />
              <Button
                type="submit"
                color="primary"
                onClick={this.handleSubmit}
              >
                Login
              </Button>
            </AvForm>
          </div>
        </main>
      </div>
    );
  }
}

const loginMutation = gql`
  mutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      ok
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

export default graphql(loginMutation)(observer(Login));
