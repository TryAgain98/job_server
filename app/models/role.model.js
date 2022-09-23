module.exports = (sequelize, Sequelize, DataTypes) => {
  const Role = sequelize.define(
    "Roles", // Model name
    {
      // Attributes
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING
      },
      description: {
        type: DataTypes.STRING
      },
      is_admin: {
        type: DataTypes.BOOLEAN
      }
    },
    {
      // Options
      timestamps: true,
      underscrored: true,
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  );

  return Role;
};
