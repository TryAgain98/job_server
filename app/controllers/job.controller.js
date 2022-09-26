const db = require("../models");
const Job = db.job;
const JobCV = db.job_cv;
const Op = db.Op;
const { getPagination, getPagingData } = require("../helpers/pagination");
const { messageError } = require("../helpers/messageError");

exports.create = (req, res) => {
  Job.create(req.body)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      messageError(res, err);
    });
};

exports.appliedJob = async (req, res) => {
  try {
    const { cvId, jobId, saved_job, applied_job } = req.body;
    const jobCV = await JobCV.findOne({
      where: {
        cvId,
        jobId,
      },
    });
    if (!!jobCV) {
      await JobCV.update(
        { cvId, jobId, applied_job },
        {
          where: { id: jobCV?.id },
        }
      );
      return res.send("Job applied successfully.");
    }
    const data = await JobCV.create({ ...req.body });
    if (data) {
      res.send(data);
    }
  } catch (err) {
    messageError(res, err);
  }
};
exports.savedJob = async (req, res) => {
  try {
    const { cvId, jobId, saved_job, applied_job } = req.body;
    const jobCV = await JobCV.findOne({
      where: {
        cvId,
        jobId,
      },
    });
    if (!!jobCV) {
      await JobCV.update(
        { cvId, jobId, saved_job },
        {
          where: { id: jobCV?.id },
        }
      );
      res.send("Job saved successfully.");
    }
    else {
      const data = await JobCV.create({ ...req.body });
      if (data) {
        res.send(data);
      }
    }
  } catch (err) {
    messageError(res, err);
  }
};

exports.findAll = (req, res) => {
  const { page, size, search, careerId } = req.query;
  const { limit, offset } = getPagination(page, size);

  var condition = [];
  if (!!search) {
    condition.push({
      name: { [Op.like]: "%" + search + "%" },
    });
    //area
    condition.push({
      area: { [Op.like]: "%" + search + "%" },
    });
    //salary
    condition.push({
      salary: { [Op.like]: "%" + search + "%" },
    });
    //age
    condition.push({
      age: { [Op.like]: "%" + search + "%" },
    });
    //level
    condition.push({
      level: { [Op.like]: "%" + search + "%" },
    });
  }
  if (!!careerId) {
    condition.push({
      careerId: Number(careerId),
    });
  }

  Job.findAndCountAll({ where: { [Op.or]: condition }, limit, offset })
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

  Job.findOne({
    include: [
      {
        model: db.company,
      },
      {
        model: db.career,
      },
    ],
    where: { id: id },
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: `Error retrieving Job with id = ${id}`,
      });
    });
};

exports.update = (req, res) => {
  const id = req.params.id;

  Job.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Job was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Job with id=${id}. Maybe Job was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Job with id=" + id,
      });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;

  Job.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Job was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Job with id=${id}. Maybe Job was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Job with id=" + id,
      });
    });
};

exports.deleteAll = (req, res) => {
  Job.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Jobs were deleted successfully!` });
    })
    .catch((err) => {
      messageError(res, err);
    });
};
