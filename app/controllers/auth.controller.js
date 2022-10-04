const config = require("../config/config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../models");
const User = db.user;
const Role = db.role;
const Op = db.Op;
const axios = require("axios");
const { messageError } = require("../helpers/messageError");

const signUpFromOtherService = async (req, res) => {
  const { account, hash } = req.body;
  try {
    const response = await axios.post("https://cvnl.me/uuid/v1/user/create", {
      account,
      hash,
    });
    const { data } = response;
    return data;
  } catch (err) {
    messageError(res, err);
  }
};

exports.signup = async (req, res) => {
  try {
    const { account, hash, display_name } = req.body;
    const response = await signUpFromOtherService(req, res);
    if (response.error) {
      return res.status(500).send({
        message: "User existed",
      });
    }
    const { _id } = response.data.userInfo;
    var exitEmail = await User.findOne({
      where: { email: account },
    });

    if (exitEmail) {
      return res.status(401).send({ message: "Email đã tồn tại" });
    }
    const newUser = await User.create({
      id: _id,
      email: account,
      display_name: display_name,
      password: bcrypt.hashSync(hash, 8),
    });
    res.send(newUser);
    // res.send({ message: "User was registered successfully!" });
  } catch (err) {
    messageError(res, err);
  }
};

const signInFromOtherService = async (req, res) => {
  const { account, hash } = req.body;
  try {
    const response = await axios.post("https://cvnl.me/uuid/v1/user/hash", {
      account,
      hash,
    });
    const { data } = response;
    return data;
  } catch (err) {
    messageError(res, err);
  }
};

exports.signIn = async (req, res) => {
  try {
    const { account, hash } = req.body;
    const response = await signInFromOtherService(req, res);
    if (response.error) {
      return res.status(500).send({
        message: "Incorrect account or password",
      });
    }
    const { _id } = response.data.userInfo;
    var user = await User.findOne({
      where: { id: _id },
    });
    if (!user) {
      return res.status(500).send({
        message: "User not found",
      });
    }
    let token = jwt.sign({ id: user.id }, config.auth.secret, {
      expiresIn: "60d",
    });
    res.status(200).send({
      user,
      token,
    });
  } catch (err) {
    messageError(res, err);
  }
};
