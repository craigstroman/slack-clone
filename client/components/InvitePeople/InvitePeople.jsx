import React from 'react';
import PropTypes from 'prop-types';
import {
  Button, Col, Form, FormGroup, Label, Input, Modal, ModalHeader, ModalBody, ModalFooter,
} from 'reactstrap';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import normalizeErrors from '../../shared/util/normalizeErrors';
import './InvitePeople.scss';

class InvitePeople extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      error: '',
      errors: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'email') {
      if (value.length) {
        this.setState({
          email: value,
        });
      }
    }
  }

  handleSubmit = async () => {
    const { email } = this.state;
    const { mutate, teamId, handleCloseInvitePeople } = this.props;

    const response = await mutate({ variables: { teamId, email } });

    const { ok, errors } = response.data.addTeamMember;

    if (ok) {
      handleCloseInvitePeople();
    } else if (errors) {
      const err = normalizeErrors(errors);

      this.setState({
        errors: true,
        error: err.email[0],
      });
    }
  }

  handleClose = () => {
    const { handleCloseInvitePeople } = this.props;

    this.setState({
      email: '',
      error: '',
      errors: false,
    });

    handleCloseInvitePeople();
  }

  render() {
    const { isOpen } = this.props;
    const { email, error, errors } = this.state;

    return (
      <Modal isOpen={isOpen}>
        <ModalHeader>
          Add People to your Team
        </ModalHeader>
        <ModalBody>
          <Form onSubmit={(e) => { e.preventDefault(); }}>
            <FormGroup row>
              <Label for="name" md={4}>
                Email address:
              </Label>
              <Col md={8}>
                <Input
                  type="email"
                  name="email"
                  placeholder="user@host.com"
                  value={email}
                  onChange={e => this.handleChange(e)}
                />
                {errors && error ? <div className="text-danger">{error}</div> : null}
              </Col>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button
            color="secondary"
            onClick={() => this.handleClose()}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            color="primary"
            onClick={() => this.handleSubmit()}
          >
            Invite Person
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

const addTeamMemberMutation = gql`
  mutation($email: String!, $teamId: Int!) {
    addTeamMember(email: $email, teamId: $teamId) {
      ok
      errors {
        path
        message
      }
    }
  }
`;

InvitePeople.defaultProps = {
  isOpen: false,
  handleCloseInvitePeople: () => {},
};

InvitePeople.propTypes = {
  isOpen: PropTypes.bool,
  handleCloseInvitePeople: PropTypes.func,
};

export default graphql(addTeamMemberMutation)(InvitePeople);
