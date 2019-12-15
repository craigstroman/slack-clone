import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import { Button, TextField } from '@material-ui/core';
import styled, { ThemeProvider } from 'styled-components';
import gql from 'graphql-tag';
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

class ChannelInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      message: '',
      isSubmiting: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  /**
   * Updates the state on input change.
   *
   * @param      {Object}  e       The event object.
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
    const { mutate, channelId } = this.props;

    if (!message) {
      this.setState({ isSubmiting: false });
      return;
    }

    await mutate({
      variables: { channelId, text: message },
    });

    this.setState({ message: '' });
  };

  render() {
    const { channels, match } = this.props;
    const { message, isSubmiting } = this.state;
    const channel = channels.filter(el => el.uuid === match.params.channelId);
    const { name } = channel[0];

    return (
      <ThemeProvider theme={theme}>
        <Wrapper>
          <TextField
            name="message"
            placeholder={`Message #${name}`}
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

const createMessageMutation = gql`
  mutation($channelId: Int!, $text: String!) {
    createMessage(channelId: $channelId, text: $text)
  }
`;

ChannelInput.defaultProps = {
  channelId: 0,
  channels: [],
  match: {},
};

ChannelInput.propTypes = {
  channelId: PropTypes.number,
  channels: PropTypes.array,
  match: PropTypes.object,
};

export default graphql(createMessageMutation)(ChannelInput);
