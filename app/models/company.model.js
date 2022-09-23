module.exports = (sequelize, Sequelize, DataTypes) => {
  const Company = sequelize.define(
    "company", // Model name
    {
      // Attributes
      id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
      },
      details: {
        type: DataTypes.STRING,
      },
      address: {
        type: DataTypes.STRING,
      },
      scale: {
        type: DataTypes.STRING,
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

  return Company;
};
