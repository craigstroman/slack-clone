
import gql from 'graphql-tag';

const meQuery = gql`
  {
    me {
      id
      username
      teams {
        id
        name
        admin
        channels {
          id
          name
        }
      }
    }
  }
`;

export default meQuery;
