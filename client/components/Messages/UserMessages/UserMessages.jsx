import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import './UserMessages.scss';

const UserMessages = props => (
  <div>
    User Messages
  </div>
);

const directMessagesQuery = gql`
  query($teamId: Int!, $userId: Int!) {
    directMessages(teamId: $teamId, otherUserId: $userId) {
      id
      sender {
        username
      }
      text
      created_at
    }
  }
`;

export default graphql(directMessagesQuery, {
  variables: props => ({
    teamId: props.teamId,
    userId: props.userId,
  }),
  options: {
    fetchPolicy: 'network-only',
  },
})(UserMessages);
