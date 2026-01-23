import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Phase extends Model {
    static associate(models) {
      Phase.belongsTo(models.Roadmap, {
        foreignKey: "roadmap_id",
      });
      Phase.hasMany(models.Phase_Course, {
        foreignKey: "phase_id",
      });
      Phase.hasMany(models.Document_Phase, {
        foreignKey: "phase_id",
      });
    }
  }
  Phase.init(
    {
      phase_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      phase_name: { type: DataTypes.STRING, allowNull: false },
      phase_description: { type: DataTypes.TEXT, allowNull: false },

      order: { type: DataTypes.INTEGER, allowNull: false },
      phase_aims: { type: DataTypes.TEXT, allowNull: false },
      roadmap_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "roadmaps",
          key: "roadmap_id",
        },
      },
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Phase",
      tableName: "phases",
      freezeTableName: true,
      timestamps: false,
    },
  );
  return Phase;
};
