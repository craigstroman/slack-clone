import React from 'react';
import PropTypes from 'prop-types';
import { compose, graphql } from 'react-apollo';
import { Button, TextField } from '@material-ui/core';
import styled, { ThemeProvider } from 'styled-components';
import gql from 'graphql-tag';
import jwt from 'jsonwebtoken';
import meQuery from '../../../shared/queries/team';
import theme from '../../../shared/themes';

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  .MuiFormControl-root {
    text-align: left;
    width: 100%;
    .MuiInputBase-root {
      .MuiInputBase-input {
        color: ${props => props.theme.colors.black};
        padding-left: 5px;
      }
    }
  }
`;

class UserInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      message: '',
      isSubmiting: false,
    };

    this.handleChange = this.handleChange.bind(this);
  }

  /**
   * Sets the state on input change.
   *
   * @param      {Object}  e   The event object.
   */
  handleChange = e => {
    const { name, value } = e.target;

    if (name === 'message') {
      this.setState({
        message: value,
      });
    }
  };

  /**
   * Submits the form.
   *
   */
  handleSubmit = async () => {
    const { message } = this.state;

    const { mutate, receiverId, teamId } = this.props;

    const response = await mutate({
      variables: {
        text: message,
        receiverId,
        teamId,
      },
    });

    const { data } = response;

    if (data.createDirectMessage) {
      this.setState({ message: '' });
    }
  };

  render() {
    const { users, match } = this.props;
    const { message, isSubmiting } = this.state;
    const token = jwt.decode(localStorage.getItem('token'));
    const user = users.filter(el => el.uuid === match.params.userId);

    let placeHolderText = null;

    if (token.user.id === user[0].id) {
      placeHolderText = 'Jot something down';
    } else {
      placeHolderText = `Message ${user[0].username}`;
    }

    return (
      <ThemeProvider theme={theme}>
        <Wrapper>
          <TextField
            name="message"
            placeholder={placeHolderText}
            value={message}
            autoComplete="off"
            onChange={e => this.handleChange(e)}
            onKeyUp={e => {
              if (e.keyCode === 13 && !isSubmiting) {
                this.handleSubmit();
              }
            }}
          />
        </Wrapper>
      </ThemeProvider>
    );
  }
}

const createDirectMessageMutation = gql`
  mutation($receiverId: Int!, $text: String!, $teamId: Int!) {
    createDirectMessage(receiverId: $receiverId, text: $text, teamId: $teamId)
  }
`;

UserInput.defaultProps = {
  receiverId: null,
  teamId: null,
  users: null,
  match: {},
};

UserInput.propTypes = {
  receiverId: PropTypes.number,
  teamId: PropTypes.number,
  users: PropTypes.array,
  match: PropTypes.object,
};

export default compose(
  graphql(meQuery, { options: { fetchPolicy: 'network-only' } }),
  graphql(createDirectMessageMutation),
)(UserInput);
