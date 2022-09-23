const db = require("../models")
const User = db.user
const Role = db.role
const Op = db.Op
const { getPagination, getPagingData } = require("../helpers/pagination")
const { messageError } = require("../helpers/messageError")
const bcrypt = require("bcryptjs")

exports.updatePassWord = async (req, res) => {
  let { userId, oldPass, newPass } = req.body
  var user = await User.findOne({
    where: { id: userId }
  })

  let passwordIsValid = bcrypt.compareSync(
    oldPass,
    user.password
  )

  if (!passwordIsValid) {
    return res.status(401).send({
      message: "Mật khẩu cũ không đúng",
      error: true
    })
  }
  var password = bcrypt.hashSync(newPass, 8)
  user.gender = "female"
  delete user.id
  User.update({
    password: password
  }, {
    where: { id: userId }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Cập nhật mật khẩu thành công.",
          error: false
        })
      } else {
        res.send({
          message: `Cannot update User with . Maybe User was not found or req.body is empty!`
        })
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating User with id="
      })
    })

}

exports.findAll = (req, res) => {
  const display_name = req.query.display_name
  const { page, size } = req.query
  const { limit, offset } = getPagination(page, size)

  var condition = display_name ? { display_name: { [Op.eq]: display_name } } : null

  User.findAndCountAll({
    include: [
    ], where: condition, limit, offset
  })
    .then(data => {
      const response = getPagingData(data, page, limit)
      res.send(response)
    })
    .catch(err => {
      messageError(res, err)
    })
}
exports.getForSelector = (req, res) => {
  Role.findAll({include: [
      {
        model: db.user
      }
    ], where: {is_admin: false}})
    .then(data => {
      const formatData = []
      if(!!data && data.length > 0 && data[0]?.users) {
        data[0]?.users.forEach((user) => {
          const newData = {
            value: user.id,
            label: user.display_name
          }
          formatData.push(newData)
        })
      }
      res.send(formatData)
    })
    .catch(err => {
      messageError(res, err)
    })
  // User.findAll({
  //   attributes: [['id', 'value'], ['display_name', 'label']]
  // })
  //   .then(data => {
  //     res.send(data)
  //   })
  //   .catch(err => {
  //     messageError(res, err)
  //   })
}

exports.findOne = (req, res) => {
  const id = req.params.id

  User.findByPk(id)
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      res.status(500).send({
        message: `Error`
      })
    })
}

exports.getByUserId = async (id) => {
  return await User.findByPk(id)
}

exports.update = (req, res) => {
  const id = req.params.id
  // let {display_name, email, phone, birthday, gender, avatar, address, RoleId} = req.body
  // if (req.body.hasOwnProperty('password')) {
  //   newUser.password = bcrypt.hashSync(req.body.password, 8)
  // }
  User.update({
    ... req.body
  }, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "User was updated successfully."
        })
      } else {
        res.send({
          message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`
        })
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating User with id=" + id
      })
    })
}

exports.delete = (req, res) => {
  const id = req.params.id

  User.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "User was deleted successfully!"
        })
      } else {
        res.send({
          message: `Cannot delete User with id=${id}. Maybe User was not found!`
        })
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete User with id=" + id
      })
    })
}

exports.deleteAll = (req, res) => {
  User.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} Users were deleted successfully!` })
    })
    .catch(err => {
      messageError(res, err)
    })
}

exports.resetPassWord = async (req, res) => {
  let { userId, newPass } = req.body
  var user = await User.findOne({
    where: { id: userId }
  })

  var password = bcrypt.hashSync(newPass, 8)
  User.update({
    password: password
  }, {
    where: { id: userId }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Cập nhật mật khẩu thành công.",
          error: false
        })
      } else {
        res.send({
          message: `Cannot update User with . Maybe User was not found or req.body is empty!`
        })
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating User with id="
      })
    })

}