import React from 'react';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';
import { compose, graphql } from 'react-apollo';
import {
  Button, Col, Form, FormGroup, Label, Input, Modal, ModalHeader, ModalBody, ModalFooter,
} from 'reactstrap';
import gql from 'graphql-tag';
import allTeamsQuery from '../../shared/queries/team';

/* eslint react/prop-types: 0 */

const AddChannel = ({
  isOpen,
  handleCloseAddChannel,
  values,
  handleChange,
  handleSubmit,
}) => (
  <div>
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
                value={values.name}
                onChange={e => handleChange(e)}
              />
            </Col>
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button
          color="secondary"
          onClick={() => handleCloseAddChannel()}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          color="primary"
          onClick={() => handleSubmit()}
        >
          Create Channel
        </Button>
      </ModalFooter>
    </Modal>
  </div>
);

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
  values: {},
  handleCloseAddChannel: () => {},
};

AddChannel.propTypes = {
  isOpen: PropTypes.bool,
  values: PropTypes.object,
  handleCloseAddChannel: PropTypes.func,
};

export default compose(
  graphql(createChannelMutation),
  withFormik({
    mapPropsToValues: () => ({ name: '' }),
    handleSubmit: async (values, { props: { handleCloseAddChannel, teamId, mutate } }) => {
      await mutate({
        variables: { teamId, name: values.name },
        optimisticResponse: {
          createChannel: {
            __typename: 'Mutation',
            ok: true,
            channel: {
              __typename: 'Channel',
              id: -1,
              name: values.name,
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
      handleCloseAddChannel();
    },
  }),
)(AddChannel);
