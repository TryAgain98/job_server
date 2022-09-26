module.exports = (sequelize, Sequelize, DataTypes) => {
  const JobCV = sequelize.define(
    "job_cv", // Model name
    {
      // Attributes
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      saved_job: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      applied_job: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      // Options
      timestamps: true,
      underscrored: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return JobCV;
};
