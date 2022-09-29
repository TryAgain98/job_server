module.exports = (sequelize, Sequelize, DataTypes) => {
  const AppliedJob = sequelize.define(
    "applied_job", // Model name
    {
      // Attributes
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      introducing_letter: {
        type: DataTypes.TEXT
      }
      // applied: {
      //   type: DataTypes.BOOLEAN,
      //   defaultValue: false,
      // },
    },
    {
      // Options
      timestamps: true,
      underscrored: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return AppliedJob;
};
