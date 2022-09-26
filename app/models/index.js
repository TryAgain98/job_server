const config = require("../config/config.js")
const { Sequelize, DataTypes, Op } = require("sequelize")

const sequelize = new Sequelize(
  config.db.DB_NAME,
  config.db.DB_USER,
  config.db.DB_PASS,
  {
    host: config.db.DB_HOST,
    dialect: config.db.dialect,
    operatorsAliases: false,

    poll: {
      max: config.db.pool.max,
      min: config.db.pool.min,
      acquire: config.db.pool.acquire,
      idle: config.db.pool.idle
    }
  }
)

const db = {}

db.Sequelize = Sequelize
db.Op = Op
db.sequelize = sequelize

db.user = require("./user.model.js")(sequelize, Sequelize, DataTypes)
// db.role = require("./role.model.js")(sequelize, Sequelize, DataTypes)
// db.timekeeping =  require("./timekeeping/timekeeping.model.js")(sequelize, Sequelize, DataTypes)
// db.work_hour_type =  require("./timekeeping/work_hour_type.model.js")(sequelize, Sequelize, DataTypes)
// db.work_schedule =  require("./timekeeping/work_schedule.model.js")(sequelize, Sequelize, DataTypes)
// db.notification =  require("./notification.model.js")(sequelize, Sequelize, DataTypes)
db.career = require("./career.model.js")(sequelize, Sequelize, DataTypes)
db.company = require("./company.model.js")(sequelize, Sequelize, DataTypes)
db.CV = require("./cv.model.js")(sequelize, Sequelize, DataTypes)
db.job = require("./job.model.js")(sequelize, Sequelize, DataTypes)
db.job_cv = require("./jov_cv.model.js")(sequelize, Sequelize, DataTypes)

//reference user and cv
db.user.hasMany(db.CV)
db.CV.belongsTo(db.user)
//reference career and cv
db.career.hasMany(db.CV)
db.CV.belongsTo(db.career)
//reference job and career
db.career.hasMany(db.job)
db.job.belongsTo(db.career)
//reference job and company
db.company.hasMany(db.job)
db.job.belongsTo(db.company)
//reference job_cv and cv
db.CV.hasMany(db.job_cv)
db.job_cv.belongsTo(db.CV)
//reference job_cv and job
db.job.hasMany(db.job_cv)
db.job_cv.belongsTo(db.job)

//reference work_hour_type and timekeeping
// db.work_hour_type.hasMany(db.timekeeping)
// db.timekeeping.belongsTo(db.work_hour_type)

// ////reference timekeeping and user
// db.user.hasMany(db.timekeeping)
// db.timekeeping.belongsTo(db.user)

// ////reference timekeeping and user
// db.user.hasMany(db.work_schedule)
// db.work_schedule.belongsTo(db.user)

// ////reference timekeeping and notification
// db.timekeeping.hasMany(db.notification)
// db.notification.belongsTo(db.timekeeping)

// ////reference notification and user
// db.user.hasMany(db.notification)
// db.notification.belongsTo(db.user)

// // reference user and role
// db.user.belongsTo(db.role)
// db.role.hasMany(db.user)

db.PERMISSIONS = ["read", "add", "edit", "delete", "no_permission"]

module.exports = db
