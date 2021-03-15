const { confirmToken } = require("../../helpers/authHelper");
const { generateGetParams, loadFromDDB } = require("../../helpers/ddbHelper");

const ddbTableName = "BoxUsers";

const getUserData = async (email, token) => {
  const validToken = confirmToken(email, token);

  if (validToken != true) {
    return { validToken: false };
  }

  const getParams = generateGetParams(ddbTableName, {
    email: { S: email },
  });

  try {
    const result = await loadFromDDB(getParams);
    return {
      validToken: true,
      email: result.Item.email.S,
      userId: result.Item.userId.S,
    };
  } catch (err) {
    console.log(err);
  }
};

exports.getUserData = getUserData;
