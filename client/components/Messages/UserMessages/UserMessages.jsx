import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import Moment from 'react-moment';
import uniqid from 'uniqid';
import './UserMessages.scss';

const newDirectMessageSubscription = gql`
  subscription($teamId: Int!, $userId: Int!) {
    newDirectMessage(teamId: $teamId, userId: $userId) {
      id
      sender {
        username
      }
      text
      createdAt
    }
  }
`;

class UserMessages extends React.Component {
  constructor(props) {
    super(props);

    this.subscribe = this.subscribe.bind(this);
  }

  componentDidMount() {
    const { teamId, userId } = this.props;

    this.unsubscribe = this.subscribe(teamId, userId);
  }

  componentDidUpdate(prevProps) {
    const { teamId, userId } = this.props;

    if (teamId !== prevProps.teamId || userId !== prevProps.userId) {
      if (this.unsubscribe) {
        this.unsubscribe();
      }
      this.unsubscribe = this.subscribe(teamId, userId);
    }
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  /**
   * Subscribes a user to a direct message.
   *
   * @param      {String}  teamId  The team identifier.
   * @param      {String}  userId  The user identifier.
   * @return     {Object}  The message object.
   */
  subscribe = (teamId, userId) => {
    const { data } = this.props;

    return data
      .subscribeToMore({
        document: newDirectMessageSubscription,
        variables: {
          teamId,
          userId,
        },
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData) {
            return prev;
          }

          return {
            ...prev,
            directMessages: [...prev.directMessages, subscriptionData.newDirectMessage],
          };
        },
      });
  }

  render() {
    const { data: { loading, directMessages } } = this.props;

    if (loading || typeof directMessages === 'undefined') {
      return null;
    }

    return (
      <div className="messages">
        <ul className="messages-list">
          {directMessages.map((message, i) => {
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
                    {message.sender.username}
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

const directMessagesQuery = gql`
  query($teamId: Int!, $userId: Int!) {
    directMessages(teamId: $teamId, otherUserId: $userId) {
      id
      sender {
        username
      }
      text
      createdAt
    }
  }
`;

UserMessages.defaultProps = {
  data: {},
  teamId: null,
  userId: null,
};

UserMessages.propTypes = {
  data: PropTypes.object,
  teamId: PropTypes.number,
  userId: PropTypes.number,
};

export default graphql(directMessagesQuery, {
  variables: props => ({
    teamId: props.teamId,
    userId: props.userId,
  }),
  options: {
    fetchPolicy: 'network-only',
  },
})(UserMessages);
