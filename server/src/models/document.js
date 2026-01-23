import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Document extends Model {
    static associate(models) {
      Document.hasMany(models.Document_Phase, {
        foreignKey: "document_id",
      });
    }
  }
  Document.init(
    {
      document_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      document_type: { type: DataTypes.STRING, allowNull: false },
      document_name: { type: DataTypes.STRING, allowNull: false },
      document_description: { type: DataTypes.TEXT, allowNull: true },
      document_url: { type: DataTypes.STRING, allowNull: false },
      document_size: { type: DataTypes.STRING, allowNull: true },
      file_type: { type: DataTypes.STRING, allowNull: true },

      created_at: { type: DataTypes.DATE, allowNull: false },
      updated_at: { type: DataTypes.DATE, allowNull: false },
    },
    {
      sequelize,
      modelName: "Document",
      tableName: "documents",
      freezeTableName: true,
      timestamps: false,
    },
  );
  return Document;
};
