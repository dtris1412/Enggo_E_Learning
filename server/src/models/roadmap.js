import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Roadmap extends Model {
    static associate(models) {
      Roadmap.belongsTo(models.Certificate, {
        foreignKey: "certificate_id",
      });
      Roadmap.hasMany(models.Phase, {
        foreignKey: "roadmap_id",
      });
    }
  }
  Roadmap.init(
    {
      roadmap_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      roadmap_title: { type: DataTypes.STRING, allowNull: false },
      roadmap_description: { type: DataTypes.TEXT, allowNull: true },
      roadmap_aim: { type: DataTypes.TEXT, allowNull: true },
      roadmap_level: {
        type: DataTypes.ENUM("Beginner", "Intermediate", "Advanced"),
        allowNull: false,
      },
      estimated_duration: { type: DataTypes.INTEGER, allowNull: true },
      roadmap_status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      certificate_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "certificates",
          key: "certificate_id",
        },
      },
      discount_percent: { type: DataTypes.INTEGER, allowNull: true },
      roadmap_price: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
      created_at: { type: DataTypes.DATE },
      updated_at: { type: DataTypes.DATE },
    },
    {
      sequelize,
      modelName: "Roadmap",
      tableName: "roadmaps",
      freezeTableName: true,
      timestamps: false,
    },
  );
  return Roadmap;
};
