import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Skill extends Model {
    static associate(models) {
      Skill.hasMany(models.Lesson, {
        foreignKey: "skill_id",
      });
      Skill.hasMany(models.Certificate_Skill, {
        foreignKey: "skill_id",
        as: "Certificate_Skills",
      });
    }
  }
  Skill.init(
    {
      skill_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      skill_name: { type: DataTypes.STRING, allowNull: false },
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Skill",
      tableName: "skills",
      freezeTableName: true,
      timestamps: false,
    }
  );
  return Skill;
};
