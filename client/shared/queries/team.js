
import gql from 'graphql-tag';

const allTeamsQuery = gql`
  {
    allTeams {
      id
      name
      channels {
        id
        name
      }
    }
  }
`;

export default allTeamsQuery;
