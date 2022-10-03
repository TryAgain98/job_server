const config = require("../config/config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../models");
const User = db.user;
const Role = db.role;
const Op = db.Op;
const axios = require("axios");

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

exports.signIn = async (req, res) => {
  const tokenPushNoti = req.body.tokenPushNoti;
  User.findOne({
    include: [
      {
        model: db.role,
      },
    ],
    where: {
      phone: req.body.phone,
    },
  })
    .then(async (user) => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      let passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!",
        });
      }
      let token = jwt.sign(
        { id: user.id, isAdmin: user.Role.is_admin },
        config.auth.secret,
        {
          expiresIn: "60d", // 24 hours
        }
      );
      if (user.hasOwnProperty("password")) {
        delete user.password;
      }

      // update token notification
      await User.update(
        {
          token_notification: tokenPushNoti,
        },
        {
          where: { id: user.id },
        }
      );

      res.status(200).send({
        user: user,
        accessToken: token,
      });
      // });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.signOut = (req, res) => {
  const { token } = req.body;
  console.log("signOut : ", token);
  if (token) {
    jwt.destroy(token);
    res.send({ message: "Remove token done" });
  } else {
    res.send.status(500)({ message: "null token" });
  }
};
