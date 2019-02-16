import React from 'react';
import PropTypes from 'prop-types';
import { extendObservable } from 'mobx';
import { observer } from 'mobx-react';
import { graphql } from 'react-apollo';
import {
  Button, Col, Form, FormGroup, Label, Input,
} from 'reactstrap';
import gql from 'graphql-tag';
import './CreateTeam.scss';

@observer
class CreateTeam extends React.Component {
  constructor(props) {
    super(props);

    extendObservable(this, {
      name: '',
      errors: false,
    });

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this[name] = value;
  }

  handleSubmit = async () => {
    const { name } = this;

    if (name.length) {
      const { mutate, history } = this.props;

      const response = await mutate({ variables: { name } });

      if (response) {
        console.log('response: ', response);
      }

      const { ok, errors } = response.data.createTeam;

      if (ok) {
        history.push('/');
      } else if (errors) {
        this.errors = true;
      }
    }
  }

  render() {
    const { name, errors } = this;

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
            <Form>
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
                    onClick={this.handleSubmit}
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

export default graphql(createTeamMutation)(observer(CreateTeam));
