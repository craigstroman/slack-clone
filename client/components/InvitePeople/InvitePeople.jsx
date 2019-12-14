import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@material-ui/core';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import styled from 'styled-components';
import normalizeErrors from '../../shared/util/normalizeErrors';

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

class InvitePeople extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      fieldErrors: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  /**
   * Sets the state on input change.
   *
   * @param      {Object}  e       The event object.
   */
  handleChange = e => {
    const { name, value } = e.target;

    if (name === 'email') {
      if (value.length) {
        this.setState({
          email: value,
        });
      }
    }
  };

  /**
   * Validates the form.
   *
   * @return     {boolean}  The result of validating the form.
   */
  validateForm = () => {
    const { email } = this.state;
    const errors = {};

    if (!email.length) {
      errors.email = 'Email is required.';
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

  /**
   * Submits the form.
   *
   */
  handleSubmit = async () => {
    const { email } = this.state;
    const { mutate, teamId, handleCloseInvitePeople } = this.props;

    if (this.validateForm()) {
      const response = await mutate({ variables: { teamId, email } });

      const { ok, errors } = response.data.addTeamMember;

      if (ok) {
        handleCloseInvitePeople();
      } else if (errors) {
        const err = normalizeErrors(errors);

        this.setState({
          fieldErrors: err.email[0],
        });
      }
    }
  };

  /**
   * Closes the invite people modal.
   *
   */
  handleClose = () => {
    const { handleCloseInvitePeople } = this.props;

    this.setState({
      email: '',
      fieldErrors: '',
    });

    handleCloseInvitePeople();
  };

  render() {
    const { isOpen } = this.props;
    const { email, fieldErrors } = this.state;

    return (
      <StyledDialog open={isOpen} maxWidth="md" fullWidth={true} onClose={this.handleClose}>
        <DialogTitle id="form-dialog-title">Add People to your Team</DialogTitle>
        <DialogContent>
          <DialogContentText>Invite a person to your team by entering their email address.</DialogContentText>
          <TextField
            type="text"
            name="email"
            label="Email"
            value={email}
            error={!fieldErrors.email === false}
            helperText={fieldErrors.email}
            onChange={e => this.handleChange(e)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => this.handleClose()}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={this.handleSubmit}>
            Invite Person
          </Button>
        </DialogActions>
      </StyledDialog>
    );
  }
}

const addTeamMemberMutation = gql`
  mutation($email: String!, $teamId: Int!) {
    addTeamMember(email: $email, teamId: $teamId) {
      ok
      errors {
        path
        message
      }
    }
  }
`;

InvitePeople.defaultProps = {
  isOpen: false,
  handleCloseInvitePeople: () => {},
};

InvitePeople.propTypes = {
  isOpen: PropTypes.bool,
  handleCloseInvitePeople: PropTypes.func,
};

export default graphql(addTeamMemberMutation)(InvitePeople);
