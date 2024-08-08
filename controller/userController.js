const jwt = require("jsonwebtoken");
const { createToken, createhash, checkHash, verifyToken } = require("../utils");
const User = require("../model/userSchema");

const secure = async (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (!token) {
      throw new Error("Token is not Valid");
    }
    const checkToken = verifyToken(token);
    let checkUser = await User.findById(checkToken.id);
    if (!checkUser) {
      throw new Error("user not Find");
    }
    req.user = checkUser;
    next();
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const registerUser = async (req, res) => {
  try {
    let { name, email, password } = req.body;
    findUser = await User.findOne({ email });
    if (findUser) {
      throw new Error("User is Already Register");
    }
    password = await createhash(password);
    let createUser = await User.create({ name, email, password });
    let token = createToken({ id: createUser._id });
    res.status(201).json({ message: "User Created Successfully", token });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const loginuser = async (req, res) => {
  try {
    let { email, password } = req.body;
    let checkUser = await User.findOne({ email });
    if (!checkUser) {
      throw new Error("User not Found");
    }
    let checkPassword = await checkHash(password, checkUser.password);
    if (!checkPassword) {
      throw new Error("Invalid password");
    }
    let token = await createToken({ id: checkUser._id });
    res.status(200).json({ message: "Login Successful", token });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = { secure, registerUser, loginuser };
