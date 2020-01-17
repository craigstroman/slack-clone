import React from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import Moment from 'react-moment';
import uniqid from 'uniqid';
import styled, { ThemeProvider } from 'styled-components';
import decode from 'jwt-decode';
import meQuery from '../../../shared/queries/team';
import theme from '../../../shared/themes';

const Wrapper = styled.div`
  background-color: ${props => props.theme.colors.white};
  color: ${props => props.theme.colors.black};
  display: flex;
  flex-direction: column-reverse;
  height: 89vh;
  overflow-y: scroll;
  ul {
    list-style-type: none;
    margin-block-start: 0;
    margin-block-end: 0;
    padding-inline-start: 0;
    li {
      margin-bottom: 10px;
      padding-left: 10px;
    }
  }
`;

const MessageHeader = styled.header`
  display: block;
  width: 100%;
  h3 {
    display: inline-block;
    font-weight: bold;
    margin-right: 20px;
    text-align: left;
  }
  div {
    color: ${props => props.theme.colors.scorpion};
    display: inline-block;
    font-size: 0.875em;
  }
`;

const Message = styled.div`
  display: block;
  text-align: left;
  width: 100%;
`;

const newDirectMessageSubscription = gql`
  subscription($teamId: Int!, $userId: Int!) {
    newDirectMessage(teamId: $teamId, userId: $userId) {
      id
      sender {
        username
      }
      receiverId
      senderId
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

  componentDidMount = () => {
    const { teamId, userId } = this.props;
    this.unsubscribe = this.subscribe(teamId, userId);
  };

  componentDidUpdate = prevProps => {
    const { teamId, userId } = this.props;

    if (teamId !== prevProps.teamId || userId !== prevProps.userId) {
      if (this.unsubscribe) {
        this.unsubscribe();
      }

      this.unsubscribe = this.subscribe(teamId, userId);
    }
  };

  componentWillUnmount = () => {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  };

  /**
   * Subscribes a user to a direct message.
   *
   * @param      {String}  teamId  The team identifier.
   * @param      {String}  userId  The user identifier.
   * @return     {Object}  The message object.
   */
  subscribe = (teamId, userId) => {
    const { data } = this.props;
    const token = decode(localStorage.getItem('token'));
    const { user } = token;
    const { id } = user;

    return data.subscribeToMore({
      document: newDirectMessageSubscription,
      variables: {
        teamId,
        userId,
      },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData) {
          return prev;
        }

        const { newDirectMessage } = subscriptionData;

        if (newDirectMessage.senderId !== id && newDirectMessage.receiverId !== id) {
          return 0;
        }

        return {
          ...prev,
          directMessages: [...prev.directMessages, subscriptionData.newDirectMessage],
        };
      },
    });
  };

  render() {
    const {
      data: { loading, directMessages },
      userId,
    } = this.props;

    if (loading || typeof directMessages === 'undefined') {
      return null;
    }

    return (
      <ThemeProvider theme={theme}>
        <Wrapper>
          <ul>
            {directMessages.map((message, i) => {
              const { sender, text } = message;
              const { username } = sender;

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
                <li key={`${uniqid()}`}>
                  <MessageHeader>
                    <h3>{username}</h3>
                    <div>
                      <Moment calendar={calendarStrings}>{createdAt}</Moment>
                    </div>
                  </MessageHeader>
                  <Message>{text}</Message>
                </li>
              );
            })}
          </ul>
        </Wrapper>
      </ThemeProvider>
    );
  }
}

const directMessagesQuery = gql`
  query directMessagesQuery($teamId: Int!, $userId: Int!) {
    directMessages(teamId: $teamId, otherUserId: $userId) {
      id
      sender {
        username
      }
      receiverId
      senderId
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

export default compose(
  graphql(meQuery, { options: { fetchPolicy: 'network-only' } }),
  graphql(directMessagesQuery, {
    variables: props => ({
      teamId: props.teamId,
      userId: props.userId,
    }),
    options: {
      fetchPolicy: 'network-only',
    },
  }),
)(UserMessages);
