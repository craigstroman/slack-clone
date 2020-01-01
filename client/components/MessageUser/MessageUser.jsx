import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import decode from 'jwt-decode';
import styled from 'styled-components';

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

class MessageUser extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: '',
    };
  }

  render() {
    const {
      open,
      handleCloseDirectMessageModal,
      handleMessageUser,
      data: { loading, getTeamMembers },
    } = this.props;
    const { value } = this.state;
    const token = localStorage.getItem('token');
    const { user } = decode(token);
    const { username } = user;

    if (loading) {
      return null;
    }

    let items = getTeamMembers;

    if (Array.isArray(items)) {
      items = items.filter(el => el.username !== username);
    }

    return (
      <StyledDialog
        open={open}
        maxWidth="md"
        fullWidth={true}
        onClose={() => handleCloseDirectMessageModal()}
      >
        <DialogTitle id="form-dialog-title">Direct Messages</DialogTitle>
        <DialogContent>
          <Autocomplete
            options={items}
            getOptionLabel={option => option.username}
            renderOption={option => <Fragment>{option.username}</Fragment>}
            renderInput={params => (
              <TextField
                {...params}
                label="Find a user to message"
                variant="outlined"
                fullWidth
                inputProps={{
                  ...params.inputProps,
                  autoComplete: 'disabled', // disable autocomplete and autofill
                }}
              />
            )}
            onChange={event => {
              const { target } = event;
              const { textContent } = target;
              const selectedUser = items.find(el => el.username === textContent);

              this.setState({ value: selectedUser });
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleCloseDirectMessageModal()}>Cancel</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              handleMessageUser(value);
            }}
            disabled={!value}
          >
            Go
          </Button>
        </DialogActions>
      </StyledDialog>
    );
  }
}

const getTeamMembersQuery = gql`
  query($teamId: Int!) {
    getTeamMembers(teamId: $teamId) {
      id
      uuid
      username
    }
  }
`;

MessageUser.defaultProps = {
  open: false,
  handleCloseDirectMessageModal: () => {},
  handleMessageUser: () => {},
  data: {},
  // teamUUID: null,
  // history: {},
};

MessageUser.propTypes = {
  open: PropTypes.bool,
  handleCloseDirectMessageModal: PropTypes.func,
  handleMessageUser: PropTypes.func,
  data: PropTypes.object,
  // teamUUID: PropTypes.string,
  // history: PropTypes.object,
};

export default graphql(getTeamMembersQuery)(MessageUser);
