const db = require("../models");
const Notification = db.notification;
const Timekeeping = db.timekeeping;
const Op = db.Op;
const sequelize = db.sequelize;
const moment = require("moment");
const { getPagination, getPagingData } = require("../helpers/pagination");
const { messageError } = require("../helpers/messageError");
const CONSTANT = require("../constants");
const NOTIFICATION_TYPE = CONSTANT.NOTIFICATION_TYPE;

exports.create = (req, res) => {
  Notification.create(req.body)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      messageError(res, err);
    });
};

exports.numberOfUnRead = async (req, res) => {
  const { userId, isAdmin } = req;
  try {
    const condition = [{ read: false }];
    if (isAdmin) {
      condition.push({
        [Op.or]: [
          { type: NOTIFICATION_TYPE.createTimekeeping },
          { type: NOTIFICATION_TYPE.updateTimekeeping },
        ],
      });
    } else {
      condition.push({
        [Op.or]: [
          { type: NOTIFICATION_TYPE.refuseTimekeeping },
          { type: NOTIFICATION_TYPE.approveTimekeeping },
        ],
        userId
      });
    }
    const data = await Notification.findOne({
      attributes: [[sequelize.fn('COUNT', sequelize.col('id')), 'count']],
      where: condition,
    });
    res.send(data);
  } catch (err) {
    return [null, err];
  }
};

exports.createNotification = async (data) => {
  try {
    const res = await Notification.create(data);
    return [res, null];
  } catch (err) {
    return [null, err];
  }
};

const getTimeKeepingIdsByStatus = async (status) => {
  try {
    const data = await Timekeeping.findAll({
      attributes: ["id"],
      where: { status },
    });
    let timekeepingIds = [];
    data.forEach((item, index) => {
      timekeepingIds[index] = item.id;
    });
    return timekeepingIds;
  } catch (err) {
    messageError(res, err);
  }
};

const getNotifications = async (req, res, condition) => {
  const { page, size, startDate, endDate, userId, status, } = req.query;
  if (!!startDate && !!endDate) {
    condition.push({
      created_at: {
        [Op.gte]: moment(parseInt(startDate)).startOf("day").toDate(),
        [Op.lte]: moment(parseInt(endDate)).endOf("day").toDate(),
      },
    });
  }
  if (!!userId) {
    condition.push({
      userId,
    });
  }
  if (!!status) {
    const timekeepingIds = await getTimeKeepingIdsByStatus(status);
    condition.push({
      timekeepingId: timekeepingIds,
    });
  }
  const { limit, offset } = getPagination(page, size);
  try {
    const data = await Notification.findAndCountAll({
      include: [
        {
          model: db.timekeeping,
        },
        {
          model: db.user,
        },
      ],
      where: condition,
      order: [["created_at", "DESC"]],
      limit,
      offset,
    });
    const response = getPagingData(data, page, limit);
    res.send(response);
  } catch (err) {
    messageError(res, err);
  }
};

exports.getNotiForAdmin = async (req, res) => {
  var condition = [];
  condition.push({
    [Op.or]: [
      { type: NOTIFICATION_TYPE.createTimekeeping },
      { type: NOTIFICATION_TYPE.updateTimekeeping },
    ],
  });

  await getNotifications(req, res, condition);
};

exports.getMyNoti = async (req, res) => {
  const {userId} = req;
  var condition = [
    {
      [Op.or]: [
        { type: NOTIFICATION_TYPE.refuseTimekeeping },
        { type: NOTIFICATION_TYPE.approveTimekeeping },
      ],
      userId,
    },
  ];

  await getNotifications(req, res, condition);
};

exports.findOne = (req, res) => {
  const id = req.params.id;

  Notification.findOne({
    where: { id: id },
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: `Error retrieving Notification with id = ${id}`,
      });
    });
};

exports.read = (req, res) => {
  const id = req.params.id;

  Notification.update(
    { read: true },
    {
      where: { id: id },
    }
  )
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Notification was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Notification with id=${id}. Maybe Notification was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Notification with id=" + id,
      });
    });
};

exports.update = (req, res) => {
  const id = req.params.id;

  Notification.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Notification was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Notification with id=${id}. Maybe Notification was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Notification with id=" + id,
      });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;

  Notification.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Notification was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Notification with id=${id}. Maybe Notification was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Notification with id=" + id,
      });
    });
};

exports.deleteAll = (req, res) => {
  Notification.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Roles were deleted successfully!` });
    })
    .catch((err) => {
      messageError(res, err);
    });
};
