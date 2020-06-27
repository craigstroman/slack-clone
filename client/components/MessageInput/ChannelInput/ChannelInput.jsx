import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import { Button, TextField } from '@material-ui/core';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import { withStyles } from '@material-ui/core/styles';
import styled, { ThemeProvider } from 'styled-components';
import gql from 'graphql-tag';
import FileUpload from '../../FileUpload/FileUpload';

const Wrapper = styled.div`
  display: grid;
  grid-column: 2;
  grid-template-columns: 4% auto;
  ${props => props.theme.mixins.clearfix()}
`;

const useStyles = theme => ({
  buttton: {
    cursor: 'pointer',
  },
  input: {
    flex: 1,
    paddingLeft: '5px',
    paddingBottom: '10px',
  },
});

class ChannelInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      message: '',
      isSubmiting: false,
      attachFileModal: false,
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
    const { channels, classes, match } = this.props;
    const { message, isSubmiting, attachFileModal } = this.state;
    const channel = channels.filter(el => el.uuid === match.params.channelId);
    const { name } = channel[0];

    return (
      <Wrapper>
        <Button variant="contained" className={classes.button} title="Attach a file">
          <FileUpload>
            <AttachFileIcon />
          </FileUpload>
        </Button>
        <TextField
          name="message"
          placeholder={`Message #${name}`}
          className={classes.input}
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
  classes: {},
  match: {},
};

ChannelInput.propTypes = {
  channelId: PropTypes.number,
  channels: PropTypes.array,
  classes: PropTypes.object,
  match: PropTypes.object,
};

export default graphql(createMessageMutation)(withStyles(useStyles)(ChannelInput));
