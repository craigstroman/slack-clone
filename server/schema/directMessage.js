export default `
  type DirectMessage {
    id: Int!
    text: String!
    sender: User!
    receiverId: Int!
    senderId: Int!
    createdAt: String!
  }

  type Subscription {
    newDirectMessage(teamId: Int!, userId: Int!): DirectMessage!
  }

  type Query {
    directMessages(teamId: Int!, otherUserId: Int!): [DirectMessage!]!
  }

  type Mutation {
    createDirectMessage(receiverId: Int!, text: String!, teamId: Int!): Boolean!
  }
`;
