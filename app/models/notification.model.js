module.exports = (sequelize, Sequelize, DataTypes) => {
    const Notification = sequelize.define(
      "notifications", // Model name
      {
        // Attributes
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          allowNull: false,
          autoIncrement: true,
        },
        type: {
          type: DataTypes.BIGINT
        },
        read: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        content: {
          type: DataTypes.STRING
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
    return Notification;
  };
  