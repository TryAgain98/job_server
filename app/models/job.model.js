module.exports = (sequelize, Sequelize, DataTypes) => {
    const Job = sequelize.define(
      "job", // Model name
      {
        // Attributes
        id: {
          type: DataTypes.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
        },
        name: {
          type: DataTypes.TEXT,
        },
        salary: {
          type: DataTypes.STRING,
        },
        recruit_quantity: {
          type: DataTypes.TEXT,
        },
        sex: {
          type: DataTypes.STRING,
        },
        age: {
          type: DataTypes.STRING,
        },
        english_level: {
          type: DataTypes.STRING,
        },
        experience: {
          type: DataTypes.TEXT,
        },
        other_requirements: {
          type: DataTypes.TEXT,
        },
        contact_info: {
          type: DataTypes.TEXT,
        },
        area: {
          type: DataTypes.TEXT,
        },
        work_address: {
          type: DataTypes.TEXT,
        },
        level: {
          type: DataTypes.TEXT
        },
        start_time: {
          type: DataTypes.BIGINT,
        },
        end_time: {
          type: DataTypes.BIGINT,
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
  
    return Job;
  };
  