module.exports = (sequelize, Sequelize, DataTypes) => {
    const SavedJob = sequelize.define(
      "saved_job", // Model name
      {
        // Attributes
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          allowNull: false,
          autoIncrement: true,
        },
        // saved: {
        //   type: DataTypes.BOOLEAN,
        //   defaultValue: false,
        // }
      },
      {
        // Options
        timestamps: true,
        underscrored: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
      }
    );
  
    return SavedJob;
  };
  