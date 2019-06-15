import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import {
  Button, Col, Form, FormGroup, Label, Input, Modal, ModalHeader, ModalBody, ModalFooter,
} from 'reactstrap';
import Downshift from 'downshift';
import './MessageUser.scss';

class MessageUser extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: '',
    };
  }

  render() {
    const {
      open, handleCloseDirectMessageModal, handleMessageUser, data: { loading, getTeamMembers },
    } = this.props;
    const { value } = this.state;

    if (loading) {
      return null;
    }

    const items = getTeamMembers;

    return (
      <Modal className="direct-messages__container" isOpen={open}>
        <ModalHeader>Direct Messages</ModalHeader>
        <ModalBody>
          <Form onSubmit={(e) => { e.preventDefault(); }}>
            <Downshift
              onChange={(selection) => {
                this.setState({ value: selection });
              }}
              itemToString={item => (item ? item.username : '')}
            >
              {({
                getInputProps,
                getItemProps,
                getLabelProps,
                getMenuProps,
                isOpen,
                inputValue,
                highlightedIndex,
                selectedItem,
              }) => (
                <div>
                  <FormGroup row>
                    <Label for="name" md={4} {...getLabelProps()}>Find a user to message:</Label>
                    <Col md={8}>
                      <Input {...getInputProps()} autoComplete="off" placeholder="Enter username" />
                    </Col>
                    <ul {...getMenuProps()} className="user-dropdown">
                      {isOpen
                        ? items
                          .filter(item => !inputValue || item.username.toLowerCase().includes(inputValue))
                          .map((item, index) => (
                            <li
                              {...getItemProps({
                                key: item.uuid,
                                index,
                                item,
                                style: {
                                  backgroundColor:
                                    highlightedIndex === index ? 'lightgray' : 'white',
                                  fontWeight: selectedItem === item ? 'bold' : 'normal',
                                },
                              })}
                            >
                              {item.username}
                            </li>
                          ))
                        : null}
                    </ul>
                  </FormGroup>
                </div>
              )}
            </Downshift>
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
            onClick={() => { handleMessageUser(value); }}
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
  open: false,
  handleCloseDirectMessageModal: () => {},
  handleMessageUser: () => {},
  data: {},
  teamUUID: null,
  history: {},
};

MessageUser.propTypes = {
  open: PropTypes.bool,
  handleCloseDirectMessageModal: PropTypes.func,
  handleMessageUser: PropTypes.func,
  data: PropTypes.object,
  teamUUID: PropTypes.string,
  history: PropTypes.object,
};

export default graphql(getTeamMembersQuery)(MessageUser);
