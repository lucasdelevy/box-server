const AWS = require("aws-sdk");
const ddb = new AWS.DynamoDB({
  accessKeyId: process.env.AWS_KEY,
  secretAccessKey: process.env.AWS_SECRET,
  region: "us-west-2",
  apiVersion: "2012-08-10",
});

const generatePutParams = (tableName, obj) => {
  return {
    TableName: tableName,
    Item: obj,
  };
};

const generateGetParams = (tableName, obj) => {
  return {
    TableName: tableName,
    Key: obj,
  };
};

const loadFromDDB = async (getParams) => {
  return await ddb
    .getItem(getParams, function (err, _) {
      if (err) {
        console.log("Error querying from DDB: ", err);
      }
    })
    .promise();
};

const saveInDDB = async (putParams) => {
  return await ddb
    .putItem(putParams, function (err, _) {
      if (err) {
        console.log("Error saving in DDB: ", err);
      }
    })
    .promise();
};

exports.loadFromDDB = loadFromDDB;
exports.saveInDDB = saveInDDB;
exports.generateGetParams = generateGetParams;
exports.generatePutParams = generatePutParams;
