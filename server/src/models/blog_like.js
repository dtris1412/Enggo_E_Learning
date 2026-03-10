import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Blog_Like extends Model {
    static associate(models) {
      Blog_Like.belongsTo(models.User, {
        foreignKey: "user_id",
      });
      Blog_Like.belongsTo(models.Blog, {
        foreignKey: "blog_id",
      });
    }
  }
  Blog_Like.init(
    {
      blog_like_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "users", key: "user_id" },
      },
      blog_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "blogs", key: "blog_id" },
      },
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Blog_Like",
      tableName: "blog_likes",
      freezeTableName: true,
      timestamps: false,
    },
  );
  return Blog_Like;
};
