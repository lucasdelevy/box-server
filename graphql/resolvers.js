const { saveLogin, confirmLogin } = require("./auth");
const { listFiles } = require("./fs");

// Provide resolver functions for your schema fields
const resolvers = {
    Mutation: {
        saveLogin: async (_, args, __, ___) => await saveLogin(args.email, args.password),
    },
    Query: {
        confirmLogin: async (_, args, __, ___) => await confirmLogin(args.email, args.password),
        listFiles: async (_, args, __, ___) => await listFiles(args.email, args.token, args.path)
    },
};

module.exports = resolvers;
