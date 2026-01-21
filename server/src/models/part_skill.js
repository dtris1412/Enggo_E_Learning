import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Part_Skill extends Model {
    static associate(models) {}
  }
  Part_Skill.init(
    {
      part_skill_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      part_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "parts",
          key: "part_id",
        },
      },
      skill_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "skills",
          key: "skill_id",
        },
      },
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Part_Skill",
      tableName: "part_skills",
      freezeTableName: true,
      timestamps: false,
    },
  );
  return Part_Skill;
};
