const { confirmToken } = require("../../helpers/authHelper");
const { listS3Files } = require("../../helpers/s3Helper");
const { getUserData } = require("./user");

const listFiles = async (email, token, path) =>
{
  if (confirmToken(email, token)) {
    userData = await getUserData(email, token);
    const s3ObjList = await listS3Files(userData.userId, path);
    console.log(s3ObjList);
    const s3KeyList = s3ObjList.Contents.map(obj =>
    {
      const noRootPath = obj.Key.replace(path, "");
      const indexOfSlash = noRootPath.indexOf("/");
      if (indexOfSlash !== -1)
        return noRootPath.substr(0, indexOfSlash + 1);
      else
        return noRootPath;
    })
      .filter(e => e);
    const s3KeyListUnique = Array.from(new Set(s3KeyList));
    return { files: [".", "..", ...s3KeyListUnique] };
  } else {
    throw "Invalid email or token";
  }
};

exports.listFiles = listFiles;
