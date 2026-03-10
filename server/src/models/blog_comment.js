import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Blog_Comment extends Model {
    static associate(models) {
      Blog_Comment.belongsTo(models.User, {
        foreignKey: "user_id",
      });
      Blog_Comment.belongsTo(models.Blog, {
        foreignKey: "blog_id",
      });
      Blog_Comment.belongsTo(models.Blog_Comment, {
        foreignKey: "parent_comment_id",
        as: "ParentComment",
        onDelete: "CASCADE",
      });
      Blog_Comment.hasMany(models.Blog_Comment, {
        foreignKey: "parent_comment_id",
        as: "Replies",
        onDelete: "CASCADE",
      });
    }
  }
  Blog_Comment.init(
    {
      blog_comment_id: {
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
      parent_comment_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "blog_comments",
          key: "blog_comment_id",
        },
        onDelete: "CASCADE",
      },
      comment_content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Blog_Comment",
      tableName: "blog_comments",
      freezeTableName: true,
      timestamps: false,
    },
  );
  return Blog_Comment;
};
