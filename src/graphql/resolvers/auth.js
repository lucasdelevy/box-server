const bcrypt = require("bcrypt");
const { generateHash, generateToken } = require("../../helpers/authHelper");
const {
  loadFromDDB,
  saveInDDB,
  generateGetParams,
  generatePutParams,
} = require("../../helpers/ddbHelper");
const { v4: uuidv4 } = require("uuid");
const { createBucket } = require("../../helpers/s3Helper");

const ddbTableName = "BoxUsers";

/** AUX FUNCTIONS */

const persistLoginInfo = async (email, hash) =>
{
  const userId = uuidv4();

  const putParams = generatePutParams(ddbTableName, {
    email: { S: email },
    hash: { S: hash },
    userId: { S: userId },
  });

  // Saving in DDB
  await saveInDDB(putParams);
};

/** RESOLVERS */

const saveLogin = async (email, password) =>
{
  // First check if user already exists
  const getParams = generateGetParams(ddbTableName, {
    email: { S: email },
  });
  const user = await loadFromDDB(getParams);

  if (user === undefined) {
    const hash = await generateHash(password);
    await persistLoginInfo(email, hash);
  
    try {
      const result = await loadFromDDB(getParams);
  
      if (result.Item === undefined) {
        console.log(`Could not load data: ${result}`);
        return { couldSave: false };
      }
      console.log("Save successful!");
    } catch (err) {
      console.log(err);
    }
  } else {
    result = user;
  }

  const { couldCreateBucket } = await createBucket(result.Item.userId.S);
  console.log(`Bucket created: ${couldCreateBucket}`);

  if (couldCreateBucket) {
    return { couldSave: true, token: generateToken(email) };
  } else {
    return { couldSave: false };
  }
};

const confirmLogin = async (email, password) =>
{
  const getParams = generateGetParams(ddbTableName, {
    email: { S: email },
  });

  try {
    const result = await loadFromDDB(getParams);

    if (result === undefined) {
      console.log("Could not find user: undefined");
      return { authenticated: false };
    }

    const isSame = (
      await bcrypt.compare(password, result.Item.hash.S)
    ).valueOf();
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
