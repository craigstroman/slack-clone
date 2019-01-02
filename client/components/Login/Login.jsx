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
    });

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    const { name, value } = e.target;
    this[name] = value;
    console.log('onChnage: ');
    console.log('this: ', this);
  }

  async handleSubmit() {
    const { email, password } = this;

    const { mutate } = this.props;

    const response = await mutate({ variables: { email, password } });

    const { ok, token, refreshToken } = response.data.login;

    if (ok) {
      console.log('token: ', token);
      console.log('refreshToken: ', refreshToken);
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
    }
  }

  render() {
    const { email, password } = this;

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
          <AvForm>
            <AvField
              label="Email:"
              type="email"
              name="email"
              value={email}
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

// Login.defaultProps = {
//   history: {},
// };

// Login.propTypes = {
//   history: PropTypes.object,
// };

export default graphql(loginMutation)(Login);
