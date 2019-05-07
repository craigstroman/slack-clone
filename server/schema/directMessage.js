export default `
  type DirectMessage {
    id: Int!
    text: String!
    sender: User!
    receiverId: Int!
  }

  type Query {
    directMesages: [DirectMessage!]!
  }

  type mutation {
    createDirectMessage(receiverId: Int!, text: String!): Boolean!
  }
`;
