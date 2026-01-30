import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Blog extends Model {
    static associate(models) {
      Blog.belongsTo(models.User, {
        foreignKey: "user_id",
      });
    }
  }
  Blog.init(
    {
      blog_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      blog_title: { type: DataTypes.STRING, allowNull: false },
      slug: { type: DataTypes.STRING(255), allowNull: false },
      excerpt: { type: DataTypes.TEXT, allowNull: false },

      blog_content: { type: DataTypes.TEXT, allowNull: false },
      blog_thumbnail: { type: DataTypes.STRING, allowNull: false },
      category: {
        type: DataTypes.ENUM(
          "Mẹo học tập",
          "TOEIC",
          "IELTS",
          "Ngữ pháp",
          "Từ vựng",
        ),
        allowNull: false,
      },
      blog_status: {
        type: DataTypes.ENUM("draft", "published", "hidden"),
        allowNull: false,
        defaultValue: "draft",
      },
      views_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "user_id",
        },
      },
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Blog",
      tableName: "blogs",
      freezeTableName: true,
      timestamps: false,
    },
  );
  return Blog;
};
