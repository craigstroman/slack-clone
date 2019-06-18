import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import {
  Col, Form, FormGroup, Input,
} from 'reactstrap';
import gql from 'graphql-tag';
import './ChannelInput.scss';

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
  handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'message') {
      this.setState({
        message: value,
      });
    }
  }

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
  }

  render() {
    const { channels, match } = this.props;
    const { message, isSubmiting } = this.state;
    const channel = channels.filter(el => (el.uuid === match.params.channelId));

    return (
      <div className="input">
        <Form onSubmit={(e) => { e.preventDefault(); }}>
          <FormGroup row>
            <Col md={12}>
              <Input
                type="text"
                name="message"
                className="form-control"
                placeholder={`Message #${channel[0].name}`}
                value={message}
                autoComplete="off"
                onChange={e => this.handleChange(e)}
                onKeyUp={(e) => { if (e.keyCode === 13 && !isSubmiting) { this.handleSubmit(); } }}
              />
            </Col>
          </FormGroup>
        </Form>
      </div>
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
