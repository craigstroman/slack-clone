import React from 'react';
import PropTypes from 'prop-types';
import { compose, graphql } from 'react-apollo';
import {
  Col, Form, FormGroup, Input,
} from 'reactstrap';
import gql from 'graphql-tag';
import meQuery from '../../../shared/queries/team';
import './UserInput.scss';

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

    const { mutate } = this.props;

    const response = await mutate({
      variables: {
        text: message,
        receiverId: 3,
        teamId: 8,
      },
    });

    const { data } = response;

    if (data.createDirectMessage) {
      this.setState({ message: '' });
    }
  }

  render() {
    const { itemName } = this.props;
    const { message, isSubmiting } = this.state;

    return (
      <div className="input">
        <Form onSubmit={(e) => { e.preventDefault(); }}>
          <FormGroup row>
            <Col md={12}>
              <Input
                type="text"
                name="message"
                className="form-control"
                placeholder={`Message ${itemName}`}
                value={message || ''}
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

const createDirectMessageMutation = gql`
  mutation($receiverId: Int!, $text: String!, $teamId: Int!) {
    createDirectMessage(receiverId: $receiverId, text: $text, teamId: $teamId)
  }
`;

UserInput.defaultProps = {
  itemName: '',
};

UserInput.propTypes = {
  itemName: PropTypes.string,
};

export default compose(
  graphql(meQuery, { options: { fetchPolicy: 'network-only' } }),
  graphql(createDirectMessageMutation),
)(UserInput);
