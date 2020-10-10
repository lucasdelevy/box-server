const AWS = require('aws-sdk');

const ddb = new AWS.DynamoDB({
    accessKeyId: process.env.AWS_KEY,
    secretAccessKey: process.env.AWS_SECRET,
    region: "us-west-2",
    apiVersion: '2012-08-10'
});

const bcrypt = require('bcrypt');
const numRounds = 10;

const saveLogin = async (email, password) =>
{

    const hash = await createHash(password);

    await saveInDDB(email, hash);

    // Querying from DDB
    const getParams = {
        TableName: 'BoxLogin',
        Key: {
            'email': { S: email }
        }
    };

    try {
        const result = await ddb.getItem(getParams, function (err, _)
        {
            if (err) {
                console.log("Error querying from DDB: ", err);
            }
        }).promise();

        if (result.Item === undefined) {
            console.log("Could not load data: undefined");
            return { couldSave: false };
        }

        console.log("Save successful!");
        return { couldSave: true };
    } catch (err) {
        console.log(err);
    }
};

const confirmLogin = async (email, password) =>
{
    const getParams = {
        TableName: 'BoxLogin',
        Key: {
            'email': { S: email }
        }
    };

    // Querying from DDB
    try {
        const result = await ddb.getItem(getParams, function (err, _)
        {
            if (err) {
                console.log("Error querying from DDB: ", err);
            }
        }).promise();

        if (result === undefined) {
            console.log("Could not find user: undefined");
            return { authenticated: false };
        }

        const same = (await bcrypt.compare(password, result.Item.hash.S)).valueOf();
        if (same) {
            console.log("Password matches!");
            return { authenticated: true };
        } else {
            console.log("Password does not match...");
            return { authenticated: false };
        }
    } catch (err) {
        console.log(err);
    }
};

const saveInDDB = async (email, hash) =>
{
    console.log("email", email);
    console.log("hash", hash);
    const putParams = {
        TableName: "BoxLogin",
        Item: {
            email: { S: email },
            hash: { S: hash }
        }
    };

    // Saving in DDB
    await ddb.putItem(putParams, function (err, _)
    {
        if (err) {
            console.log("Error saving in DDB: ", err);
        }
    }).promise();
};

const createHash = async (password) =>
{
    const salt = await bcrypt.genSaltSync(numRounds);
    if (salt === undefined) {
        console.log("Error generating salt...");
    }

    const hash = bcrypt.hashSync(password, salt);
    if (hash === undefined) {
        console.log("Error generating hash...");
    }

    return hash;
};

// Provide resolver functions for your schema fields
const resolvers = {
    Mutation: {
        saveLogin: async (_, args, __, ___) => await saveLogin(args.email, args.password),
    },
    Query: {
        confirmLogin: async (_, args, __, ___) => await confirmLogin(args.email, args.password),
    },
};

module.exports = resolvers;
