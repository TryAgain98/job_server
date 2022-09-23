module.exports = (sequelize, Sequelize, DataTypes) => {
  const WorkSchedule = sequelize.define(
    "work_schedule", // Model name
    {
      // Attributes
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      start_date: {
        type: DataTypes.BIGINT,
      },
      end_date: {
        type: DataTypes.BIGINT,
      },
      details: {
        type: DataTypes.JSON
        //value: [{type: 1, object: monday}]
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

  return WorkSchedule;
};
