const db = require("../models");
const Career = db.career;
const Op = db.Op;
const { getPagination, getPagingData } = require("../helpers/pagination");
const { messageError } = require("../helpers/messageError");

exports.create = (req, res) => {
  Career.create(req.body)
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

  Career.findAndCountAll({ where: condition, limit, offset })
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

  Career.findOne({
    where: { id: id }
  })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: `Error retrieving Career with id = ${id}`
      });
    });
};

exports.update = (req, res) => {
  const id = req.params.id;

  Career.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Career was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Career with id=${id}. Maybe Career was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Career with id=" + id
      });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;

  Career.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Career was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Career with id=${id}. Maybe Career was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Career with id=" + id
      });
    });
};

exports.deleteAll = (req, res) => {
  Career.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} Careers were deleted successfully!` });
    })
    .catch(err => {
      messageError(res, err)
    });
};