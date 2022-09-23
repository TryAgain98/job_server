const CONSTANTS = require('../../constants')
module.exports = (sequelize, Sequelize, DataTypes) => {
  const Timekeeping = sequelize.define(
    "timekeeping", // Model name
    {
      // Attributes
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      date: {
        type: DataTypes.BIGINT,
      },
      start_time: {
        type: DataTypes.BIGINT,
      },
      end_time: {
        type: DataTypes.BIGINT,
      },
      status : {
          type: DataTypes.INTEGER,
          defaultValue: CONSTANTS.TIMEKEEPING_STATUS.awaiting
      }
    },
    {
      // Options
      timestamps: true,
      underscrored: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return Timekeeping;
};
