
import gql from 'graphql-tag';

const meQuery = gql`
  {
    me {
      id
      uuid
      username
      teams {
        id
        uuid
        name
        admin
        channels {
          id
          uuid
          name
        }
      }
    }
  }
`;

export default meQuery;
