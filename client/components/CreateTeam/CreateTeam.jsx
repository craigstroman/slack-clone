import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import {
  Button, Col, Form, FormGroup, Label, Input,
} from 'reactstrap';
import gql from 'graphql-tag';
import './CreateTeam.scss';

class CreateTeam extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      errors: false,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange = (e) => {
    const { value } = e.target;

    this.setState({ name: value });
  }

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
  }

  render() {
    const { name, errors } = this.state;

    return (
      <div className="container">
        <header>
          <div className="header">
            <h1 className="text-center">
              Create A Team
            </h1>
          </div>
        </header>
        <main>
          <div className="content">
            <div
              className={errors ? 'error visible' : 'error'}
            >
              <div className="alert alert-danger">
                Invalid team name.
              </div>
            </div>
            <Form onSubmit={(e) => { e.preventDefault(); }}>
              <FormGroup row>
                <Label for="name" md={2}>
                  Team Name:
                </Label>
                <Col md={10}>
                  <Input
                    type="text"
                    name="name"
                    value={name}
                    onChange={e => this.handleChange(e)}
                  />
                </Col>
              </FormGroup>
              <div className="row">
                <div className="col-md-12 text-center">
                  <Button
                    type="submit"
                    color="primary"
                    onClick={() => this.handleSubmit()}
                  >
                    Create Team
                  </Button>
                </div>
              </div>
            </Form>
          </div>
        </main>
      </div>
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
};

CreateTeam.propTypes = {
  history: PropTypes.object,
};

export default graphql(createTeamMutation)(CreateTeam);
