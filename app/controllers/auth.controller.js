const config = require("../config/config")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const db = require("../models")
const User = db.user
const Role = db.role
const Op = db.Op

exports.signup = async (req, res) => {
  var exitPhone = await User.findOne({
    where: { phone: req.body.phone }
  })

  if (exitPhone) {
    res.status(401).send({ message: "Số điện thoại đã tồn tại" })
    return
  }
  var exitEmail = await User.findOne({
    where: { email: req.body.email }
  })

  if (exitEmail) {
    res.status(401).send({ message: "Email đã tồn tại" })
    return
  }
  // Save user to database
  User.create({
    ...req.body,
    password: bcrypt.hashSync(req.body.password, 8),
  })
    .then(user => {
      res.send({ message: "User was registered successfully!" })
    })
    .catch(err => {
      res.status(500).send({ message: err.message })
    })
}

exports.signIn = async (req, res) => {
  const tokenPushNoti = req.body.tokenPushNoti
  User.findOne({
    include: [
      {
        model: db.role
      }
    ],
    where: {
      phone: req.body.phone
    }
  })
    .then(async (user) => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." })
      }

      let passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      )

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        })
      }
      let token = jwt.sign({ id: user.id, isAdmin: user.Role.is_admin }, config.auth.secret, {
        expiresIn: '60d' // 24 hours
      })
      if (user.hasOwnProperty('password')) {
        delete user.password
      }

      // update token notification
      await User.update({
        token_notification: tokenPushNoti
      }, {
        where: { id: user.id }
      })

      res.status(200).send({
        user: user,
        accessToken: token
      })
      // });
    })
    .catch(err => {
      res.status(500).send({ message: err.message })
    })
}

exports.signOut = (req, res) => {
  const { token } = req.body
  console.log("signOut : ", token)
  if (token) {
    jwt.destroy(token)
    res.send({ message: "Remove token done" })
  }
  else {
    res.send.status(500)({ message: "null token" })
  }
}