import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Certificate extends Model {
    static associate(models) {
      Certificate.hasMany(models.Part, {
        foreignKey: "certificate_id",
      });
      Certificate.hasMany(models.Certificate_Skill, {
        foreignKey: "certificate_id",
        as: "Certificate_Skills",
      });
    }
  }
  Certificate.init(
    {
      certificate_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      certificate_name: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: false },
      total_score: { type: DataTypes.INTEGER, allowNull: false },
      certificate_status: { type: DataTypes.BOOLEAN, defaultValue: true },
      created_at: { type: DataTypes.DATE, allowNull: false },
    },
    {
      sequelize,
      modelName: "Certificate",
      tableName: "certificates",
      freezeTableName: true,
      timestamps: false,
    }
  );
  return Certificate;
};
