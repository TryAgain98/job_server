const db = require("../models");
const Job = db.job;
const CV = db.CV;
const SavedJob = db.saved_job;
const AppliedJob = db.applied_job;
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
    const { cvId, jobId } = req.body;
    const cv = await CV.findOne({
      where: { id: cvId },
    });
    const job = await Job.findOne({
      where: { id: jobId },
    });
    if (!cv) {
      return res.status(500).send({
        message: "CV not found",
      });
    }
    if (!job) {
      return res.status(500).send({
        message: "job not found",
      });
    }
    const appliedJob = await AppliedJob.findOne({
      where: {
        cvId,
        jobId,
      },
    });
    if (!!appliedJob) {
      return res.send("This job has already been applied.");
    }
    const data = await AppliedJob.create({ ...req.body });
    if (data) {
      return res.send("Job applied successfully.");
    }
  } catch (err) {
    messageError(res, err);
  }
};
exports.savedJob = async (req, res) => {
  try {
    const { userId, jobId, isSave } = req.body;
    const job = await Job.findOne({
      where: {
        id: jobId,
      },
    });
    const user = await db.user.findOne({
      where: {
        id: userId,
      },
    });
    if (!job) {
      return res.status(500).send({
        message: "job not found",
      });
    }
    if (!user) {
      return res.status(500).send({
        message: "user not found",
      });
    }
    const savedJob = await SavedJob.findOne({
      where: {
        userId,
        jobId,
      },
    });
    if (!savedJob && !isSave) {
      return res.send({
        message: "This job has not been saved.",
      });
    }
    if (!!savedJob) {
      if (isSave) {
        return res.send("This job has already been saved.");
      } else {
        await SavedJob.destroy({
          where: { id: savedJob.id },
        });
        return res.send("This job has been removed from the save list.");
      }
    } else {
      const data = await SavedJob.create({ ...req.body });
      if (data) {
        res.send("Job saved successfully.");
      }
    }
  } catch (err) {
    messageError(res, err);
  }
};

exports.findAll = async (req, res) => {
  const { page, size, search, careerId, userId } = req.query;
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

  Job.findAndCountAll({
    where: { [Op.or]: condition },
    include: [
      {
        model: db.applied_job,
        attributes: ["cvId"],
        include: {
          model: db.CV,
          attributes: ["userId"],
        },
      },
    ],
    limit,
    offset,
  })
    .then((data) => {
      const response = getPagingData(data, page, limit);
      let formatData = [];
      if (Array.isArray(response.items)) {
        formatData = response.items.map((job) => {
          // let isApply = false;
          // for (const applied_job of job.applied_jobs) {
          //   if(applied_job.cv.userId === userId) {
          //     isApply = true;
          //   }
          // }
          // console.log("===================", JSON.stringify({
          //   ...job,
          //   isApply: isApply
          // }))
          return job.get({
            applied_jobs: true,
            isApply: true,
          });
        });
      }
      res.send({ ...response, items: formatData });
    })
    .catch((err) => {
      messageError(res, err);
    });
};

exports.getListJobSaved = async (req, res) => {
  const { page, size, userId } = req.query;
  const { limit, offset } = getPagination(page, size);

  Job.findAndCountAll({
    include: [
      {
        model: db.saved_job,
        where: {
          userId,
        },
      },
    ],
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

exports.getListJobApplied = async (req, res) => {
  const { page, size, userId } = req.query;
  const { limit, offset } = getPagination(page, size);

  Job.findAndCountAll({
    include: [
      {
        model: db.applied_job,
        attributes: ["cvId"],
        include: {
          model: db.CV,
          attributes: ["userId"],
          where: {
            userId
          }
        },
      },
    ],
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

  Job.findOne({
    include: [
      {
        model: db.company,
      },
      {
        model: db.career,
      }
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
