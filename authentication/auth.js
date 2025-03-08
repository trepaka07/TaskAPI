require("dotenv").config();
const jwt = require("jsonwebtoken");

const generateToken = (userId) => {
  return jwt.sign(userId, process.env.TOKEN_SECRET, {
    expiresIn: 1800,
  });
};

const validateToken = (token, result) => {
  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    if (err) {
      result(err, null);
    } else {
      result(null, user);
    }
  });
};

module.exports = { generateToken, validateToken };
