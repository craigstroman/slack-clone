import React from 'react';
import PropTypes from 'prop-types';
import { compose, graphql } from 'react-apollo';
import {
  Col, Form, FormGroup, Input,
} from 'reactstrap';
import gql from 'graphql-tag';
import jwt from 'jsonwebtoken';
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
  }

  render() {
    const { users, match } = this.props;
    const { message, isSubmiting } = this.state;
    const token = jwt.decode(localStorage.getItem('token'));
    const user = users.filter(el => (el.uuid === match.params.userId));

    let placeHolderText = null;

    if (token.user.id === user[0].id) {
      placeHolderText = 'Jot something down';
    } else {
      placeHolderText = `Message ${user[0].username}`;
    }

    return (
      <div className="input">
        <Form onSubmit={(e) => { e.preventDefault(); }}>
          <FormGroup row>
            <Col md={12}>
              <Input
                type="text"
                name="message"
                className="form-control"
                placeholder={placeHolderText}
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
