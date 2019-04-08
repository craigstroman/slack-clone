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
    <div className="messags">
      <ul className="messages-list">
        <li className="message-item">
          Proin a mollis metus, ac viverra odio. Interdum et malesuada fames ac ante ipsum primis in faucibus.
          Sed ornare dolor ut felis tincidunt, eget suscipit purus consequat. Sed mattis non diam non pellentesque.
        </li>
        <li className="message-item">
          Proin a mollis metus, ac viverra odio. Interdum et malesuada fames ac ante ipsum primis in faucibus.
          Sed ornare dolor ut felis tincidunt, eget suscipit purus consequat. Sed mattis non diam non pellentesque.
        </li>
        <li className="message-item">
          Proin a mollis metus, ac viverra odio. Interdum et malesuada fames ac ante ipsum primis in faucibus.
          Sed ornare dolor ut felis tincidunt, eget suscipit purus consequat. Sed mattis non diam non pellentesque.
        </li>
        <li className="message-item">
          Proin a mollis metus, ac viverra odio. Interdum et malesuada fames ac ante ipsum primis in faucibus.
          Sed ornare dolor ut felis tincidunt, eget suscipit purus consequat. Sed mattis non diam non pellentesque.
        </li>
        <li className="message-item">
          Proin a mollis metus, ac viverra odio. Interdum et malesuada fames ac ante ipsum primis in faucibus.
          Sed ornare dolor ut felis tincidunt, eget suscipit purus consequat. Sed mattis non diam non pellentesque.
        </li>
        <li className="message-item">
          Proin a mollis metus, ac viverra odio. Interdum et malesuada fames ac ante ipsum primis in faucibus.
          Sed ornare dolor ut felis tincidunt, eget suscipit purus consequat. Sed mattis non diam non pellentesque.
        </li>
        <li className="message-item">
          Proin a mollis metus, ac viverra odio. Interdum et malesuada fames ac ante ipsum primis in faucibus.
          Sed ornare dolor ut felis tincidunt, eget suscipit purus consequat. Sed mattis non diam non pellentesque.
        </li>
        <li className="message-item">
          Proin a mollis metus, ac viverra odio. Interdum et malesuada fames ac ante ipsum primis in faucibus.
          Sed ornare dolor ut felis tincidunt, eget suscipit purus consequat. Sed mattis non diam non pellentesque.
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
