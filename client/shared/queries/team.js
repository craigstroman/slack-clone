
import gql from 'graphql-tag';

const meQuery = gql`
  {
    me {
      id
      username
      teams {
        id
        name
        channels {
          id
          name
        }
      }
    }
  }
`;

export default meQuery;
