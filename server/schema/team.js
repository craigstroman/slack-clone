export default `
  type Team {
    id: Int!
    uuid: String!
    name: String!
    members: [User!]!
    channels: [Channel!]!
    admin: Boolean!
  }

  type CreateTeamResponse {
    ok: Boolean!
    team: Team
    uuid: String!
    errors: [Error!]
  }

  type Query {
    allTeams: [Team!]!
    inviteTeams: [Team!]!
  }

  type VoidResponse {
    ok: Boolean!
    errors: [Error!]
  }

  type Mutation {
    createTeam(name: String!): CreateTeamResponse!
    addTeamMember(email: String!, teamId: Int!): VoidResponse!
  }
`;
