const WORK_HOUR_TYPE = {
  morning: 1,
  afternoon: 2,
  allDay: 3,
  leave: 4,
  custom: 5
};

exports.NOTIFICATION_TYPE = {
  createTimekeeping: 1,
  updateTimekeeping: 2,
  approveTimekeeping: 3,
  refuseTimekeeping: 4
}

exports.TIMEKEEPING_STATUS = {
  awaiting: 1,
  approve: 2,
  refuse: 3
}