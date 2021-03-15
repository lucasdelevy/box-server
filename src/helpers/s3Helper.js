const AWS = require("aws-sdk");
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_KEY,
  secretAccessKey: process.env.AWS_SECRET,
  region: "us-west-2",
  apiVersion: "2012-08-10",
});

const createBucket = async (userId) =>
{
  const bucketParams = {
    Bucket: `${userId}-bucket`,

  };
  console.log(`bucketParams`);
  console.log(bucketParams);
  await s3.createBucket(bucketParams, (err, data) =>
  {
    if (err) {
      console.log(err);
      return { couldCreateBucket: false };
    } else {
      console.log(`Bucket created at ${data.Location}`);
    }
  }).promise();

  return { couldCreateBucket: true };
};

const listS3Files = async (userId, path) =>
{
  const bucketParams = {
    Bucket: `${userId}-bucket`,
    Prefix: path
  };
  return await s3.listObjects(bucketParams, (err, _) =>
  {
    if (err) {
      console.log(err);
    } else {
      console.log(`List of objects fetched successfully`);
    }
  }).promise();
};

exports.createBucket = createBucket;
exports.listS3Files = listS3Files;