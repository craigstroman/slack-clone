import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import Moment from 'react-moment';
import uniqid from 'uniqid';
import './UserMessages.scss';

const UserMessages = (props) => {
  console.log('props: ', props);
  const { data: { loading, directMessages } } = props;

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

          const createdAt = new Date(message.created_at);

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
};

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

UserMessages.defaultProps = {
  data: {},
};

UserMessages.propTypes = {
  data: PropTypes.object,
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
