import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';
import styled from 'styled-components';
import gql from 'graphql-tag';
import meQuery from '../../shared/queries/team';

const StyledDialog = styled(Dialog)`
  .MuiDialogTitle-root {
    border-bottom: 1px solid #dee2e6;
    margin-bottom: 1rem;
  }
  .MuiDialogActions-root {
    border-top: 1px solid #dee2e6;
    margin-top: 1rem;
  }
`;

class AddChannel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      channelName: '',
      fieldErrors: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.validateForm = this.validateForm.bind(this);
  }

  handleChange = e => {
    const { name, value } = e.target;

    if (name === 'name') {
      if (value.length) {
        this.setState({
          channelName: value,
        });
      }
    }
  };

  validateForm = () => {
    const { channelName } = this.state;
    const errors = {};

    if (!channelName.length) {
      errors.channel = 'Channel name is required.';
    }

    if (Object.keys(errors).length >= 1) {
      this.setState({
        fieldErrors: errors,
      });

      return false;
    }

    this.setState({
      fieldErrors: errors,
    });

    return true;
  };

  handleSubmit = async () => {
    const { channelName } = this.state;
    const { mutate, teamId } = this.props;

    if (this.validateForm()) {
      await mutate({
        variables: { teamId, name: channelName },
        optimisticResponse: {
          createChannel: {
            __typename: 'Mutation',
            ok: true,
            channel: {
              __typename: 'Channel',
              id: -1,
              uuid: -1,
              name: channelName,
            },
          },
        },
        update: (store, { data: { createChannel } }) => {
          const { ok, channel } = createChannel;

          if (!ok) {
            return;
          }

          const data = store.readQuery({ query: meQuery });
          const teamIdx = data.me.teams.findIndex(el => el.id === teamId);

          data.me.teams[teamIdx].channels.push(channel);

          store.writeQuery({ query: meQuery, data });
        },
      });

      this.handleClose();
    }
  };

  handleClose = () => {
    const { handleCloseAddChannel } = this.props;

    this.setState({ channelName: '', fieldErrors: '' });

    handleCloseAddChannel();
  };

  render() {
    const { isOpen } = this.props;
    const { channelName, fieldErrors } = this.state;

    return (
      <StyledDialog open={isOpen} maxWidth="md" fullWidth={true} onClose={this.handleClose}>
        <DialogTitle id="form-dialog-title">Create a channel</DialogTitle>
        <DialogContent>
          <DialogContentText>Enter a channel name.</DialogContentText>
          <TextField
            type="text"
            name="name"
            label="# e.g. Leads"
            value={channelName}
            error={!fieldErrors.channel === false}
            helperText={fieldErrors.channel}
            onChange={e => this.handleChange(e)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => this.handleClose()}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={this.handleSubmit}>
            Create Channel
          </Button>
        </DialogActions>
      </StyledDialog>
    );
  }
}

const createChannelMutation = gql`
  mutation($teamId: Int!, $name: String!) {
    createChannel(teamId: $teamId, name: $name) {
      ok
      channel {
        id
        uuid
        name
      }
    }
  }
`;

AddChannel.defaultProps = {
  isOpen: false,
  teamId: null,
  handleCloseAddChannel: () => {},
  mutate: () => {},
};

AddChannel.propTypes = {
  isOpen: PropTypes.bool,
  teamId: PropTypes.number,
  handleCloseAddChannel: PropTypes.func,
  mutate: PropTypes.func,
};

export default graphql(createChannelMutation)(AddChannel);
