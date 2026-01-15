import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Part extends Model {
    static associate(models) {
      Part.belongsTo(models.Certificate, {
        foreignKey: "certificate_id",
      });
    }
  }
  Part.init(
    {
      part_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      part_name: { type: DataTypes.STRING, allowNull: false },
      part_number: { type: DataTypes.INTEGER, allowNull: false },
      exam_type: { type: DataTypes.ENUM("TOEIC", "IELTS"), allowNull: false },
      certificate_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "certificates",
          key: "certificate_id",
        },
      },
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Part",
      tableName: "parts",
      freezeTableName: true,
      timestamps: false,
    }
  );
  return Part;
};
