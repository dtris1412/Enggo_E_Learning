import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Certificate_Skill extends Model {
    static associate(models) {
      Certificate_Skill.belongsTo(models.Certificate, {
        foreignKey: "certificate_id",
      });
      Certificate_Skill.belongsTo(models.Skill, {
        foreignKey: "skill_id",
      });
    }
  }

  Certificate_Skill.init(
    {
      certificate_skill_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      certificate_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "certificates",
          key: "certificate_id",
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
      weight: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "Certificate_Skill",
      tableName: "certificate_skills",
      freezeTableName: true,
      timestamps: false,
    }
  );
  return Certificate_Skill;
};
