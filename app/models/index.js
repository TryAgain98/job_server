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
db.career = require("./career.model.js")(sequelize, Sequelize, DataTypes)
db.company = require("./company.model.js")(sequelize, Sequelize, DataTypes)
db.CV = require("./cv.model.js")(sequelize, Sequelize, DataTypes)
db.job = require("./job.model.js")(sequelize, Sequelize, DataTypes)
db.saved_job = require("./saved_job.model.js")(sequelize, Sequelize, DataTypes)
db.applied_job = require("./applied_job.model.js")(sequelize, Sequelize, DataTypes)

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
db.CV.hasMany(db.applied_job)
db.applied_job.belongsTo(db.CV)
//reference applied_job and job
db.job.hasMany(db.applied_job)
db.applied_job.belongsTo(db.job)
//reference saved_job and user
db.user.hasMany(db.saved_job)
db.saved_job.belongsTo(db.user)
//reference saved_job and job
db.job.hasMany(db.saved_job)
db.saved_job.belongsTo(db.job)

db.PERMISSIONS = ["read", "add", "edit", "delete", "no_permission"]

module.exports = db
