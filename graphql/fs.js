/** DECLARATIONS */

const jwt = require('jsonwebtoken');

/** AUX FUNCTIONS */

const confirmToken = (email, token) =>
{
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    if (email !== decodedToken.userId) {
        return false;
    } else {
        return true;
    }
}

/** RESOLVERS */

const listFiles = async (email, token, path) =>
{
    if (confirmToken(email, token)) {
        return { files: [path, "file1", "file2"] }
    } else {
        throw "Invalid email";
    }
}

exports.listFiles = listFiles;