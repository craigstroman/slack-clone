import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import Moment from 'react-moment';
import uniqid from 'uniqid';
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
  constructor(props) {
    super(props);

    this.subscribe = this.subscribe.bind(this);
  }

  componentDidMount() {
    const { channelId } = this.props;

    this.unsubscribe = this.subscribe(channelId);
  }

  componentDidUpdate(prevProps) {
    const { channelId } = this.props;

    if (channelId !== prevProps.channelId) {
      if (this.unsubscribe) {
        this.unsubscribe();
      }
      this.unsubscribe = this.subscribe(channelId);
    }
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  /**
   * Subscribes a user to a channel.
   *
   * @param      {String}  channelId  The channel identifier
   * @return     {Object}  The messages object.
   */
  subscribe = (channelId) => {
    const { data } = this.props;

    return data
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

    if (loading || typeof messages === 'undefined') {
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
              lastWeek: 'dddd [at] LT',
              nextWeek: 'dddd [at] LT',
              sameElse: 'L',
            };

            const createdAt = new Date(message.createdAt);

            return (
              <li
                key={`${uniqid()}`}
                className="messages-list__item"
              >
                <div className="message-header">
                  <div className="message-user">
                    {message.user.username}
                  </div>
                  <div className="message-date">
                    <Moment calendar={calendarStrings}>
                      {createdAt}
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
  options: {
    fetchPolicy: 'network-only',
  },
})(Messages);
