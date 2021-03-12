const { saveLogin, confirmLogin } = require("./resolvers/auth");
const { listFiles } = require("./resolvers/fs");
const { getUserData } = require("./resolvers/user");

// Provide resolver functions for your schema fields
const resolvers = {
    Mutation: {
        saveLogin: async (_, args, __, ___) => await saveLogin(args.email, args.password),
    },
    Query: {
        confirmLogin: async (_, args, __, ___) => await confirmLogin(args.email, args.password),
        getUserData: async (_, args, __, ___) => await getUserData(args.email, args.token),
        listFiles: async (_, args, __, ___) => await listFiles(args.email, args.token, args.path)
    },
};

module.exports = resolvers;
