const { gql } = require('apollo-server');

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
    type SaveLogin {
        couldSave: Boolean!
    }

    type ConfirmLogin {
        authenticated: Boolean!
    }

    type Mutation {
        saveLogin(email: String!, hash: String!): SaveLogin
    }

    type Query {
        confirmLogin(email: String!, hash: String!): ConfirmLogin
    }
`;

module.exports = typeDefs;