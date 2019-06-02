import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import {
  Button, Col, Form, FormGroup, Label, Input, Modal, ModalHeader, ModalBody, ModalFooter,
} from 'reactstrap';
import Autosuggest from 'react-autosuggest';
import './MessageUser.scss';

class MessageUser extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: '',
    };

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange = (e) => {
    const { value } = e.target;

    this.setState({
      user: value,
    });
  }

  render() {
    const { isOpen, handleCloseDirectMessageModal, data: { loading, getTeamMembers } } = this.props;
    const { user } = this.state;

    if (loading) {
      return null;
    }

    console.log('getTeamMembers: ', getTeamMembers);

    return (
      <Modal isOpen={isOpen}>
        <ModalHeader>Direct Messages</ModalHeader>
        <ModalBody>
          <Form onSubmit={(e) => { e.preventDefault(); }}>
            <FormGroup row>
              <Label for="name" md={4}>
                Find a user:
              </Label>
              <Col md={8}>
                <Input
                  type="text"
                  name="name"
                  placeholder="Find a user"
                  value={user}
                  onChange={e => this.handleInputChange(e)}
                />
              </Col>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button
            color="secondary"
            onClick={() => handleCloseDirectMessageModal()}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            color="primary"
          >
            Go
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

const getTeamMembersQuery = gql`
  query($teamId: Int!) {
    getTeamMembers(teamId: $teamId) {
      id
      uuid
      username
    }
  }
`;

MessageUser.defaultProps = {
  isOpen: false,
  handleCloseDirectMessageModal: () => {},
  data: {},
};

MessageUser.propTypes = {
  isOpen: PropTypes.bool,
  handleCloseDirectMessageModal: PropTypes.func,
  data: PropTypes.object,
};

export default graphql(getTeamMembersQuery)(MessageUser);
