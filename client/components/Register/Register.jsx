import React from 'react';
import PropTypes from 'prop-types';
import { gql, graphql } from 'react-apollo';
import key from 'react-key-string';
import { Button } from 'reactstrap';
import { AvForm, AvField } from 'availity-reactstrap-validation';
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

    console.log('this.state: ', this.state);

    console.log('form filled: ', username.length && email.length && password.length);

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
          // err['passwordError'] = 'too long..';
          err[`${path}Error`] = message;
        });

        console.log('errors: ', errors);

        this.setState(err);
      }
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
                  <ul className="erros">
                    {errorList.map((el, id) => (
                      <li key={key.generate()}>{ el }</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : null }
          <AvForm>
            <AvField
              name="username"
              label="Username:"
              type="text"
              value={username}
              onChange={this.handleChange}
              validate={{
                required: { value: true, errorMessage: 'Please enter a username.' },
                pattern: { value: '^[A-Za-z0-9]+$', errorMessage: 'Your username must be composed only with letter and numbers.' },
                minLength: { value: 3, errorMessage: 'Your username must be between 3 and 25 characters.' },
                maxLength: { value: 25, errorMessage: 'Your username must be between 3 and 25 characters.' },
              }}
            />
            <AvField
              name="email"
              label="Email:"
              type="email"
              placeholder="you@host.com"
              value={email}
              onChange={this.handleChange}
              validate={{
                required: {
                  value: true,
                  errorMessage: 'Please enter a email.',
                },
              }}
            />
            <AvField
              name="password"
              label="Password:"
              type="text"
              value={password}
              onChange={this.handleChange}
              validate={{
                required: { value: true, errorMessage: 'Please enter a password.' },
                minLength: { value: 5, errorMessage: 'Your password must be between 5 and 100 characters.' },
                maxLength: { value: 100, errorMessage: 'Your password must be between 5 and 100 characters.' },
              }}
            />
            <Button
              type="submit"
              color="primary"
              onClick={this.handleSubmit}
            >
              Register
            </Button>
          </AvForm>
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
