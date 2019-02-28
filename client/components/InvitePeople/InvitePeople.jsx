import React from 'react';
import PropTypes from 'prop-types';
import {
  Button, Col, Form, FormGroup, Label, Input, Modal, ModalHeader, ModalBody, ModalFooter,
} from 'reactstrap';
import './InvitePeople.scss';

/* eslint react/prop-types: 0 */

const InvitePeople = ({
  isOpen,
  handleCloseInvitePeople,
  values,
  handleChange,
  handleSubmit,
}) => (
  <div>
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
                type="text"
                name="email"
                placeholder="user@host.com"
                value={values.name}
                onChange={e => handleChange(e)}
              />
            </Col>
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button
          color="secondary"
          onClick={() => handleCloseInvitePeople()}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          color="primary"
          onClick={() => handleSubmit()}
        >
          Invite Person
        </Button>
      </ModalFooter>
    </Modal>
  </div>
);

InvitePeople.defaultProps = {
  isOpen: false,
  values: {},
  handleCloseInvitePeople: () => {},
};

InvitePeople.propTypes = {
  isOpen: PropTypes.bool,
  values: PropTypes.object,
  handleCloseInvitePeople: PropTypes.func,
};

export default InvitePeople;
