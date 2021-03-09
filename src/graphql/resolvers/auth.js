/** DECLARATIONS */

const AWS = require("aws-sdk");

const ddb = new AWS.DynamoDB({
  accessKeyId: process.env.AWS_KEY,
  secretAccessKey: process.env.AWS_SECRET,
  region: "us-west-2",
  apiVersion: "2012-08-10",
});
const bcrypt = require("bcrypt");

const { generateHash, generateToken } = require("../../helpers/authHelper");

/** AUX FUNCTIONS */

const persistLoginInfo = async (email, hash) => {
  const putParams = {
    TableName: "BoxLogin",
    Item: {
      email: { S: email },
      hash: { S: hash },
    },
  };

  // Saving in DDB
  await ddb
    .putItem(putParams, function (err, _) {
      if (err) {
        console.log("Error saving in DDB: ", err);
      }
    })
    .promise();
};

/** RESOLVERS */

const saveLogin = async (email, password) => {
  const hash = await generateHash(password);

  await persistLoginInfo(email, hash);

  // Querying from DDB
  const getParams = {
    TableName: "BoxLogin",
    Key: {
      email: { S: email },
    },
  };

  try {
    const result = await ddb
      .getItem(getParams, function (err, _) {
        if (err) {
          console.log("Error querying from DDB: ", err);
        }
      })
      .promise();

    if (result.Item === undefined) {
      console.log("Could not load data: undefined");
      return { couldSave: false };
    }

    console.log("Save successful!");
    return { couldSave: true, token: generateToken(email) };
  } catch (err) {
    console.log(err);
  }
};

const confirmLogin = async (email, password) => {
  const getParams = {
    TableName: "BoxLogin",
    Key: {
      email: { S: email },
    },
  };

  // Querying from DDB
  try {
    const result = await ddb
      .getItem(getParams, function (err, _) {
        if (err) {
          console.log("Error querying from DDB: ", err);
        }
      })
      .promise();

    if (result === undefined) {
      console.log("Could not find user: undefined");
      return { authenticated: false };
    }

    const isSame = (await bcrypt.compare(password, result.Item.hash.S)).valueOf();
    if (isSame) {
      console.log("Password matches!");
      return { authenticated: true, token: generateToken(email) };
    } else {
      console.log("Password does not match...");
      return { authenticated: false };
    }
  } catch (err) {
    console.log(err);
  }
};

exports.saveLogin = saveLogin;
exports.confirmLogin = confirmLogin;
