import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Document_Phase extends Model {
    static associate(models) {
      Document_Phase.belongsTo(models.Document, {
        foreignKey: "document_id",
      });
      Document_Phase.belongsTo(models.Phase, {
        foreignKey: "phase_id",
      });
    }
  }
  Document_Phase.init(
    {
      document_phase_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      order_index: { type: DataTypes.INTEGER, allowNull: true },
      phase_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "phases",
          key: "phase_id",
        },
      },
      document_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "documents",
          key: "document_id",
        },
      },

      created_at: { type: DataTypes.DATE, allowNull: false },
      updated_at: { type: DataTypes.DATE, allowNull: false },
    },
    {
      sequelize,
      modelName: "Document_Phase",
      tableName: "document_phases",
      freezeTableName: true,
      timestamps: false,
    },
  );
  return Document_Phase;
};
