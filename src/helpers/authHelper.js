const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const numRounds = 10;

const generateHash = async (password) => {
  const salt = await bcrypt.genSaltSync(numRounds);
  if (salt === undefined) {
    console.log(`Error generating salt for numRounds: ${numRounds}`);
  }

  const hash = bcrypt.hashSync(password, salt);
  if (hash === undefined) {
    console.log(
      `Error generating hash for password ${password} with salt ${salt}`
    );
  }

  return hash;
};

const generateToken = (email) => {
  return jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION,
  });
};

const confirmToken = (email, token) => {
  if (jwt.verify(token, process.env.JWT_SECRET)) {
    const decodedToken = jwt.decode(token);
    return email === decodedToken["email"];
  } else {
    console.log(2);
    console.log(`Could not verify received token: ${token}`);
    return false;
  }
};

exports.generateHash = generateHash;
exports.generateToken = generateToken;
exports.confirmToken = confirmToken;
