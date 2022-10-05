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
    const { jobId, isSave } = req.body;
    const { userId } = req;
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
      const data = await SavedJob.create({ ...req.body, userId });
      if (data) {
        res.send("Job saved successfully.");
      }
    }
  } catch (err) {
    messageError(res, err);
  }
};

exports.findAll = async (req, res) => {
  const { page, size, search, careerId } = req.query;
  const {userId} = req;
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
    ],
    limit,
    offset,
  })
    .then(async(data) => {
      const response = getPagingData(data, page, limit);
      let formatData = JSON.parse(JSON.stringify(response));
      let formatItems = formatData.items;
      if(Array.isArray(formatItems)) {
        for (let job of formatItems) {
          const applied_job = await db.applied_job.findOne({
            include: [
              {
                model: db.CV,
                where: { userId },
              },
            ],
            where: {
              jobId: job.id,
            },
          });
          const saved_job = await db.saved_job.findOne({
            where: { userId, jobId: job.id },
          });
          job.applied_job = !!applied_job;
          job.saved_job = !!saved_job;
        }
      }
      res.send(formatData);
    })
    .catch((err) => {
      messageError(res, err);
    });
};

exports.getListJobSaved = async (req, res) => {
  const { page, size } = req.query;
  const { userId } = req;
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
  const { page, size } = req.query;
  const { userId } = req;
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
            userId,
          },
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

exports.findOne = async (req, res) => {
  const id = req.params.id;
  const { userId } = req;

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
    .then(async (data) => {
      const applied_job = await db.applied_job.findOne({
        include: [
          {
            model: db.CV,
            where: { userId },
          },
        ],
        where: {
          jobId: data.id,
        },
      });
      const saved_job = await db.saved_job.findOne({
        where: { userId, jobId: data.id },
      });
      let formatData = JSON.parse(JSON.stringify(data));
      formatData = {
        ...formatData,
        applied_job: !!applied_job,
        saved_job: !!saved_job,
      };

      res.json(formatData);
    })
    .catch((err) => {
      messageError(res, err);
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
      messageError(res, err);
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
