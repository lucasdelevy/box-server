const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const numRounds = 10;

const generateHash = async (password) => {
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

const generateToken = (email) => {
    return jwt.sign({ userId: email }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRATION,
    });
};

exports.generateHash = generateHash;
exports.generateToken = generateToken;