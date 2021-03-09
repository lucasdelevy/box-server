const { gql } = require('apollo-server');

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
    type SaveLogin {
        couldSave: Boolean!
        token: String
    }

    type ConfirmLogin {
        authenticated: Boolean!,
        token: String
    }

    type ListFiles {
        files: [String],
    }

    type Mutation {
        saveLogin(email: String!, password: String!): SaveLogin
    }

    type Query {
        confirmLogin(email: String!, password: String!): ConfirmLogin,
        listFiles(email: String!, token: String!, path: String!): ListFiles
    }
`;

module.exports = typeDefs;