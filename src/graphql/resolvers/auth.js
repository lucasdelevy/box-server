/** DECLARATIONS */

const bcrypt = require("bcrypt");
const { generateHash, generateToken } = require("../../helpers/authHelper");
const {
  loadFromDDB,
  saveInDDB,
  generateGetParams,
  generatePutParams,
} = require("../../helpers/ddbHelper");

const ddbTableName = "BoxUsers";

/** AUX FUNCTIONS */

const persistLoginInfo = async (email, hash) => {
  const putParams = generatePutParams(ddbTableName, {
    email: { S: email },
    hash: { S: hash },
  });

  // Saving in DDB
  await saveInDDB(putParams);
};

/** RESOLVERS */

const saveLogin = async (email, password) => {
  const hash = await generateHash(password);

  await persistLoginInfo(email, hash);

  // Querying from DDB
  const getParams = generateGetParams(ddbTableName, {
    email: { S: email },
  });

  try {
    const result = await loadFromDDB(getParams);

    if (result.Item === undefined) {
      console.log(`Could not load data: ${result}`);
      return { couldSave: false };
    }

    console.log("Save successful!");
    return { couldSave: true, token: generateToken(email) };
  } catch (err) {
    console.log(err);
  }
};

const confirmLogin = async (email, password) => {
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
