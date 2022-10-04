const db = require("../models");
const CV = db.CV;
const Op = db.Op;
const { getPagination, getPagingData } = require("../helpers/pagination");
const { messageError } = require("../helpers/messageError");

exports.create = (req, res) => {
  CV.create(req.body)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      messageError(res, err);
    });
};

exports.addPrimaryCV = async (req, res) => {
  const { cvId } = req.body;
  const {userId} = req;
  const user = await db.user.findOne({
    where: {
      id: userId,
    },
  });
  if (!user) {
    return res.status(500).send({
      message: "user not found",
    });
  }
  const cv = await db.CV.findOne({
    where: {
      id: cvId,
      userId
    },
  });
  if (!cv) {
    return res.status(500).send({
      message: "cv not found or you are not the owner cv",
    });
  }
  try {
    await CV.update(
      {
        is_primary: false,
      },
      {
        where: { userId, is_primary: true },
      }
    );
    await CV.update(
      {
        is_primary: true,
      },
      {
        where: { userId, id: cvId },
      }
    );
    res.send("Update successfully.");
  } catch (err) {
    messageError(res, err);
  }
};

exports.findAll = (req, res) => {
  const { name } = req.query;
  const {userId} = req
  const { page, size } = req.query;
  const { limit, offset } = getPagination(page, size);

  var condition = name ? { name: { [Op.like]: "%" + name + "%" } } : null;

  CV.findAndCountAll({
    where: {
      userId,
    },
    limit,
    offset,
  })
    .then((data) => {
      const response = getPagingData(data, page, limit);
      res.send(response);
    })
    .catch((err) => {
      messageError(res, err);
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;

  CV.findOne({
    where: { id: id },
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: `Error retrieving CV with id = ${id}`,
      });
    });
};

exports.update = (req, res) => {
  const id = req.params.id;

  CV.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "CV was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update CV with id=${id}. Maybe CV was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating CV with id=" + id,
      });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;

  CV.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "CV was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete CV with id=${id}. Maybe CV was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete CV with id=" + id,
      });
    });
};

exports.deleteAll = (req, res) => {
  CV.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} CVs were deleted successfully!` });
    })
    .catch((err) => {
      messageError(res, err);
    });
};
