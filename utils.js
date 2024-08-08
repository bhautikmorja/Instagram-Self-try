const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createhash = (password) => {
  return bcrypt.hash(password, 10);
};

const checkHash = (password, hash) => {
  return bcrypt.compare(password, hash);
};

const createToken = (data) => {
  return jwt.sign(data, process.env.SECRET_KEY);
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.SECRET_KEY);
};

module.exports = { createhash, checkHash, createToken, verifyToken };
