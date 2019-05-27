import React from 'react';
import PropTypes from 'prop-types';
import { compose, graphql } from 'react-apollo';
import {
  Col, Form, FormGroup, Input,
} from 'reactstrap';
import gql from 'graphql-tag';
import meQuery from '../../../shared/queries/team';
import './UserInput.scss';

const UserInput = (props) => {
  const { itemName } = props;

  return (
    <div className="input">
      <Form>
        <FormGroup row>
          <Col md={12}>
            <Input
              type="text"
              name="message"
              className="form-control"
              placeholder={`Message ${itemName}`}
              value=""
              autoComplete="off"
            />
          </Col>
        </FormGroup>
      </Form>
    </div>
  );
};

const createDirectMessageMutation = gql`
  mutation($receiverId: Int!, $text: String!, $teamId: Int!) {
    createDirectMessage(receiverId: $receiverId, text: $text, teamId: $teamId)
  }
`;

UserInput.defaultProps = {
  itemName: '',
};

UserInput.propTypes = {
  itemName: PropTypes.string,
};

export default compose(
  graphql(meQuery, { options: { fetchPolicy: 'network-only' } }),
  graphql(createDirectMessageMutation),
)(UserInput);
