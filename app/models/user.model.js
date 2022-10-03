module.exports = (sequelize, Sequelize, DataTypes) => {
  const User = sequelize.define(
    "users", // Model name
    {
      // Attributes
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
        unique: true
      },
      email: {
        type: DataTypes.STRING,
        unique: true
      },
      display_name: {
        type: DataTypes.STRING
      },
      birthday: {
        type: DataTypes.BIGINT
      },
      gender: {
        type: DataTypes.STRING
      },
      avatar: {
        type: DataTypes.STRING
      },
      password: {
        type: DataTypes.STRING
      },
    },
    {
      // Options
      timestamps: true,
      underscrored: true,
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  )

  return User
}
