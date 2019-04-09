import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import Moment from 'react-moment';
import './Messages.scss';

const Messages = (props) => {
  const { data: { loading, messages }, channelId } = props;

  if (loading) {
    return null;
  }

  console.log('messages: ', messages);
  console.log('channelId: ', channelId);

  return (
    <div className="messages">
      <ul className="messages-list">
        {messages.map((message, i) => (
          <li
            key={message.id}
            className="messages-list__item"
          >
            <div className="message-header">
              <div className="message-user">
                {message.user.username}
              </div>
              <div className="message-date">
                <Moment format="MMMM DD YYYY">
                  {message.created_at}
                </Moment>
              </div>
            </div>
            <div className="message-text">
              {message.text}
            </div>
          </li>
        ))}
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
      created_at
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
