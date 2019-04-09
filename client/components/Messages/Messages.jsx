import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import './Messages.scss';

const Messages = (props) => {
  const { data: { loading, messages }, channelId } = props;

  if (!loading) {
    console.log('messages: ', messages);
    console.log('channelId: ', channelId);
  }

  return (
    <div className="messages">
      <ul className="messages-list">
        <li className="message-item">
          {JSON.stringify(messages)}
        </li>
      </ul>
    </div>
  );
};

const messagesQuery = gql`
  query($channelId: Int!) {
    messages(channelId: $channelId) {
      id
      text
      user {
        username
      }
      createdAt
    }
  }
`;

Messages.defaultProps = {
  channelId: 0,
  data: {},
};

Messages.propTypes = {
  channelId: PropTypes.number,
  data: PropTypes.object,
};

export default graphql(messagesQuery, {
  variables: props => ({
    channelId: props.channelId,
  }),
})(Messages);
