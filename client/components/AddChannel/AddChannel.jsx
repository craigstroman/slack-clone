import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import {
  Button, Col, Form, FormGroup, Label, Input, Modal, ModalHeader, ModalBody, ModalFooter,
} from 'reactstrap';
import gql from 'graphql-tag';
import allTeamsQuery from '../../shared/queries/team';

class AddChannel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      channelName: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'name') {
      if (value.length) {
        this.setState({
          channelName: value,
        });
      }
    }
  }

  handleSubmit = async () => {
    const { channelName } = this.state;
    const { mutate, teamId } = this.props;

    await mutate({
      variables: { teamId, name: channelName },
      optimisticResponse: {
        createChannel: {
          __typename: 'Mutation',
          ok: true,
          channel: {
            __typename: 'Channel',
            id: -1,
            name: channelName,
          },
        },
      },
      update: (store, { data: { createChannel } }) => {
        const { ok, channel } = createChannel;

        if (!ok) {
          return;
        }

        const data = store.readQuery({ query: allTeamsQuery });
        const teamIdx = data.allTeams.findIndex(el => (el.id === teamId));

        data.allTeams[teamIdx].channels.push(channel);

        store.writeQuery({ query: allTeamsQuery, data });
      },
    });

    this.handleClose();
  }

  handleClose = () => {
    const { handleCloseAddChannel } = this.props;

    this.setState({ channelName: '' });

    handleCloseAddChannel();
  }

  render() {
    const { isOpen } = this.props;
    const { channelName } = this.state;

    return (
      <Modal isOpen={isOpen}>
        <ModalHeader>Create a channel</ModalHeader>
        <ModalBody>
          <Form onSubmit={(e) => { e.preventDefault(); }}>
            <FormGroup row>
              <Label for="name" md={4}>
                Channel Name:
              </Label>
              <Col md={8}>
                <Input
                  type="text"
                  name="name"
                  placeholder="# e.g. Leads"
                  value={channelName}
                  onChange={e => this.handleChange(e)}
                />
              </Col>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button
            color="secondary"
            onClick={() => this.handleClose()}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            color="primary"
            onClick={() => this.handleSubmit()}
          >
            Create Channel
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

const createChannelMutation = gql`
  mutation($teamId: Int!, $name: String!) {
    createChannel(teamId: $teamId, name: $name) {
      ok
      channel {
        id
        name
      }
    }
  }
`;

AddChannel.defaultProps = {
  isOpen: false,
  handleCloseAddChannel: () => {},
};

AddChannel.propTypes = {
  isOpen: PropTypes.bool,
  handleCloseAddChannel: PropTypes.func,
};

export default graphql(createChannelMutation)(AddChannel);
