import React from 'react';
import { compose, graphql } from 'react-apollo';
import gql from 'graphql-tag';
import meQuery from '../../../shared/queries/team';
import './UserInput.scss';

const UserInput = props => (
  <div>
    User Input
  </div>
);

const createDirectMessageMutation = gql`
  mutation($receiverId: Int!, $text: String!, $teamId: Int!) {
    createDirectMessage(receiverId: $receiverId, text: $text, teamId: $teamId)
  }
`;

export default compose(
  graphql(meQuery, { options: { fetchPolicy: 'network-only' } }),
  graphql(createDirectMessageMutation),
)(UserInput);
