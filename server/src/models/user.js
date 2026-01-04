import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {}
  }
  User.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_name: { type: DataTypes.STRING, allowNull: false },
      user_password: { type: DataTypes.STRING, allowNull: false },
      full_name: DataTypes.STRING,
      user_email: { type: DataTypes.STRING, allowNull: false },
      user_phone: DataTypes.CHAR,
      user_address: DataTypes.TEXT,
      avatar: DataTypes.STRING,
      role: { type: DataTypes.INTEGER, allowNull: false },
      user_level: DataTypes.STRING,
      user_status: { type: DataTypes.BOOLEAN, allowNull: false },
      google_id: DataTypes.STRING,
      facebook_id: DataTypes.STRING,
      created_at: { type: DataTypes.DATE, allowNull: false },
      updated_at: { type: DataTypes.DATE, allowNull: false },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
      freezeTableName: true,
      timestamps: false,
    }
  );
  return User;
};
