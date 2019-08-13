// CRUD
// Create
// Read
// Update
// Delete

export default `

  type User {
    id: Int!
    uuid: String!
    username: String!
    email: String!
    teams: [Team!]!
  }

  type Query {
    me: User!
    allUsers: [User!]!
    getUser(userId: Int!): User
  }

  type RegisterResponse {
    ok: Boolean!
    user: User
    errors: [Error!]
  }

  type LoginResponse {
    ok: Boolean!
    teamUUID: String
    channelUUID: String
    token: String
    refreshToken: String
    errors: [Error!]
  }

  type Mutation {
    register(username: String!, email: String!, password: String!): RegisterResponse!
    login(email: String!, password: String!): LoginResponse!
  }

`;
