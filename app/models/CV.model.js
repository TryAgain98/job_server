module.exports = (sequelize, Sequelize, DataTypes) => {
  const CV = sequelize.define(
    "CV", // Model name
    {
      // Attributes
      id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        unique: true,
      },
      height: {
        type: DataTypes.STRING,
      },
      weight: {
        type: DataTypes.STRING,
      },
      experience: {
        type: DataTypes.STRING,
      },
      name_high_school: {
        type: DataTypes.STRING,
      },
      household_number: { // so ho khau
        type: DataTypes.STRING,
      },
      CMND: {
        type: DataTypes.STRING,
      },
      interests: {
        type: DataTypes.STRING,
      },
      character: {
        type: DataTypes.STRING,
      },
      home_town: { 
        type: DataTypes.BIGINT,
      },
      educational_level: {
        type: DataTypes.STRING,
      },
      wish: {
        type: DataTypes.STRING,
      },
      special_conditions: {
        type: DataTypes.STRING,
      },
      salary: {
        type: DataTypes.STRING,
      },
      conscious: {
        type: DataTypes.STRING,
      },
      region: {
        type: DataTypes.STRING,
      },
      current_job_information: {
        type: DataTypes.STRING,
      },
      current_address: {
        type: DataTypes.STRING,
      },
      working_company: {
        type: DataTypes.STRING,
      },
      certificate_photo: {
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

  return CV;
};
