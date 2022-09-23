const db = require("../models");
const Role = db.role;
const Op = db.Op;
const { getPagination, getPagingData } = require("../helpers/pagination");
const { messageError } = require("../helpers/messageError");

exports.create = (req, res) => {
  Role.create(req.body)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      messageError(res, err)
    });
};

exports.findAll = (req, res) => {
  const name = req.query.name;
  const { page, size } = req.query;
  const { limit, offset } = getPagination(page, size);

  var condition = name ? { name: { [Op.like]: '%' + name + '%' } } : null;

  Role.findAndCountAll({ where: condition, limit, offset })
    .then(data => {
      const response = getPagingData(data, page, limit);
      res.send(response);
    })
    .catch(err => {
      messageError(res, err)
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;

  Role.findOne({
    where: { id: id }
  })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: `Error retrieving Role with id = ${id}`
      });
    });
};

exports.update = (req, res) => {
  const id = req.params.id;

  Role.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Role was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Role with id=${id}. Maybe Role was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Role with id=" + id
      });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;

  Role.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Role was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Role with id=${id}. Maybe Role was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Role with id=" + id
      });
    });
};

exports.deleteAll = (req, res) => {
  Role.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} Roles were deleted successfully!` });
    })
    .catch(err => {
      messageError(res, err)
    });
};