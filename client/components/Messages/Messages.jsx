import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import Moment from 'react-moment';
import './Messages.scss';

const newChannelMessageSubscription = gql`
  subscription($channelId: Int!) {
    newChannelMessage(channelId: $channelId) {
      id
      text
      user {
        username
      }
      createdAt
    }
  }
`;

class Messages extends React.Component {
  componentWillMount() {
    const { data, channelId } = this.props;

    data
      .subscribeToMore({
        document: newChannelMessageSubscription,
        variables: {
          channelId,
        },
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData) {
            return prev;
          }

          return {
            ...prev,
            messages: [...prev.messages, subscriptionData.newChannelMessage],
          };
        },
      });
  }

  render() {
    const { data: { loading, messages } } = this.props;

    if (loading) {
      return null;
    }

    return (
      <div className="messages">
        <ul className="messages-list">
          {messages.map((message, i) => {
            const calendarStrings = {
              lastDay: '[Yesterday at] LT',
              sameDay: '[Today at] LT',
              nextDay: '[Tomorrow at] LT',
              lastWeek: '[last] dddd [at] LT',
              sameElse: 'L',
            };

            return (
              <li
                key={message.id}
                className="messages-list__item"
              >
                <div className="message-header">
                  <div className="message-user">
                    {message.user.username}
                  </div>
                  <div className="message-date">
                    <Moment calendar={calendarStrings}>
                      {message.createdAt}
                    </Moment>
                  </div>
                </div>
                <div className="message-text">
                  {message.text}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}

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
