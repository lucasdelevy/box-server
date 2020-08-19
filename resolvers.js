async function saveLogin(email, hash) {
    const AWS = require('aws-sdk');
    AWS.config.loadFromPath('./.env.json');

    const ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

    const putParams = {
        TableName: "BoxLogin",
        Item: {
            email: { S: email },
            hash: { S: hash }
          }
    };

    const getParams = {
        TableName: 'BoxLogin',
        Key: {
          'email': {S: email}
        }
    };

    // Saving in DDB
    ddb.putItem(putParams, function(err, data) {
        if (err) {
            console.log("Error saving in DDB: ", err);
        } else {
            console.log("Saving...")
        }
    });

    // Querying from DDB
    try {
        const result = await ddb.getItem(getParams, function(err, data) {
            if (err) {
              console.log("Error querying from DDB: ", err);
            }
        }).promise();

        if (result.Item === undefined) {
            console.log("Could not load data: undefined");
            return { couldSave: false }
        }

        console.log("Done!");
        return { couldSave: true }
    } catch(err) {
        console.log(err);
    }
}

async function confirmLogin(email, hash) {
    const AWS = require('aws-sdk');
    AWS.config.loadFromPath('./.env.json');

    const ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

    const getParams = {
        TableName: 'BoxLogin',
        Key: {
          'email': {S: email}
        }
    };

    // Querying from DDB
    try {
        const result = await ddb.getItem(getParams, function(err, data) {
            if (err) {
              console.log("Error querying from DDB: ", err);
            }
        }).promise();

        if (result.Item.hash.S === hash) {
            console.log("Hashes match!");
            return { authenticated: true }
        }

        console.log("Hashes don't match...");
        return { authenticated: false }
    } catch(err) {
        console.log(err);
    }
}

// Provide resolver functions for your schema fields
const resolvers = {
    Mutation: {
        saveLogin: async (_, args, __, ___) => await saveLogin(args.email, args.hash),
    },
    Query: {
        confirmLogin: async (_, args, __, ___) => await confirmLogin(args.email, args.hash),
    },
};

module.exports = resolvers;