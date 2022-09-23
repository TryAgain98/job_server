const db = require("../models");
const moment = require("moment");
const Timekeeping = db.timekeeping;
const Op = db.Op;
const { getPagination, getPagingData } = require("../helpers/pagination");
const { messageError } = require("../helpers/messageError");
const notificationController = require("./notification.controller.js");
const CONSTANT = require("../constants");

exports.create = async (req, res) => {
  try {
    const { date, userId } = req.body;
    const startDate = moment(date).startOf("day").valueOf();
    const endDate = moment(date).endOf("day").valueOf();
    const timekeeping = await Timekeeping.findOne({
      where: {
        date: {
          [Op.gte]: parseInt(startDate),
          [Op.lte]: parseInt(endDate),
          userId
        },
      },
    });
    if (timekeeping) {
      if (timekeeping.status === CONSTANT.TIMEKEEPING_STATUS.approve) {
        return res.send({
          message: `This timekeeping has been approved by the administrator`,
        });
      }
      if (timekeeping.status === CONSTANT.TIMEKEEPING_STATUS.refuse) {
        return res.send({
          message: `This timekeeping has been refuse by the administrator`,
        });
      }
      const notificationData = {
        userId: timekeeping.userId,
        type: CONSTANT.NOTIFICATION_TYPE.updateTimekeeping,
        timekeepingId: timekeeping.id,
      };
      await notificationController.createNotification(notificationData);
      return updateTimekeeping(req, res, timekeeping?.id);
    }
    const data = await Timekeeping.create({ ...req.body, date: startDate });
    if (data) {
      const notificationData = {
        userId: data.userId,
        type: CONSTANT.NOTIFICATION_TYPE.createTimekeeping,
        timekeepingId: data.id,
      };
      await notificationController.createNotification(notificationData);
      res.send(data);
    }
  } catch (err) {
    messageError(res, err);
  }
};

exports.findAll = (req, res) => {
  const { page, size, date, userId } = req.query;
  const { limit, offset } = getPagination(page, size);

  var condition = [];
  if (!!date) {
    let customDate = new Date(Number(date));
    var firstDay = new Date(
      customDate.getFullYear(),
      customDate.getMonth(),
      1
    ).setHours(00, 00, 00);
    var lastDay = new Date(
      customDate.getFullYear(),
      customDate.getMonth() + 1,
      0
    ).setHours(23, 59, 59);
    condition.push({
      date: {
        [Op.gte]: parseInt(firstDay),
        [Op.lte]: parseInt(lastDay),
      },
    });
  }
  if (!!userId) {
    condition.push({
      userId,
    });
  }

  Timekeeping.findAndCountAll({
    include: [
      {
        model: db.work_hour_type,
      },
      {
        model: db.user,
      },
    ],
    where: condition,
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
  const data = await findOneNotification(req, res, id);
  if (data) {
    res.send(data);
  }
};

const findOneNotification = async (req, res, id) => {
  try {
    const data = await Timekeeping.findOne({
      where: { id: id },
    });
    return data;
  } catch (err) {
    messageError(res, err);
  }
};

exports.updateStatus = async (req, res) => {
  const id = req.params.id;
  const { status } = req.body;
  try {
    const data = await Timekeeping.update(
      { status },
      {
        where: { id: id },
      }
    );
    if (data) {
      const timekeeping = await findOneNotification(req, res, id);
      let type = status;
      if( status == CONSTANT.TIMEKEEPING_STATUS.approve) {
        type = CONSTANT.NOTIFICATION_TYPE.approveTimekeeping 
      } else if( status == CONSTANT.TIMEKEEPING_STATUS.refuse) {
        type = CONSTANT.NOTIFICATION_TYPE.refuseTimekeeping 
      }
      const notificationData = {
        userId: timekeeping.userId,
        type,
        timekeepingId: timekeeping.id,
      };
      await notificationController.createNotification(notificationData);
      res.send(timekeeping);
    }
  } catch (err) {}
};

exports.update = (req, res) => {
  const id = req.params.id;
  updateTimekeeping(req.body, res, id);
};

const updateTimekeeping = async (data, res, id) => {
  Timekeeping.update(data, {
    where: { id: id },
  })
    .then(async (num) => {
      if (num == 1) {
        res.send({
          message: "Timekeeping was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Timekeeping with id=${id}. Maybe Timekeeping was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Timekeeping with id=" + id,
      });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;

  Timekeeping.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Timekeeping was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Timekeeping with id=${id}. Maybe Timekeeping was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Timekeeping with id=" + id,
      });
    });
};

exports.deleteAll = (req, res) => {
  Timekeeping.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Timekeepings were deleted successfully!` });
    })
    .catch((err) => {
      messageError(res, err);
    });
};
