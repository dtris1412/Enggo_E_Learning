import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import Sequelize from "sequelize";
dotenv.config();

const basename = path.basename(new URL(import.meta.url).pathname);
const env = process.env.NODE_ENV || "development";
import configFile from "../config/config.js";

const config = configFile[env];

const db = {};

let sequelize;

// Ưu tiên: DB_HOST (Railway private network) → MYSQL_URL → DB_NAME → config file
if (process.env.DB_HOST && process.env.DB_NAME) {
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER || "root",
    process.env.DB_PASS || null,
    {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || "3306"),
      dialect: "mysql",
      logging: process.env.NODE_ENV === "development" ? console.log : false,
      pool: { max: 5, min: 0, acquire: 30000, idle: 10000 },
      dialectOptions: { connectTimeout: 60000 },
    },
  );
} else if (process.env.MYSQL_URL) {
  sequelize = new Sequelize(process.env.MYSQL_URL, {
    dialect: "mysql",
    logging: process.env.NODE_ENV === "development" ? console.log : false,
    pool: { max: 5, min: 0, acquire: 30000, idle: 10000 },
    dialectOptions: { connectTimeout: 60000 },
  });
} else if (process.env.DB_NAME) {
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER || "root",
    process.env.DB_PASS || null,
    {
      host: process.env.DB_HOST || "127.0.0.1",
      port: parseInt(process.env.DB_PORT || "3306"),
      dialect: "mysql",
      logging: process.env.NODE_ENV === "development" ? console.log : false,
      pool: { max: 5, min: 0, acquire: 30000, idle: 10000 },
    },
  );
} else if (config && config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else if (config) {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config,
  );
} else {
  throw new Error(
    `No database config found for environment: ${env}. Set MYSQL_URL or DB_NAME env variable.`,
  );
}

const modelsDir = path.resolve(
  path
    .dirname(new URL(import.meta.url).pathname)
    .replace(/^\/([A-Za-z]:)/, "$1"),
);
const files = fs
  .readdirSync(modelsDir)
  .filter(
    (file) =>
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js",
  );

for (const file of files) {
  const { default: modelFunc } = await import(new URL(file, import.meta.url));
  const model = modelFunc(sequelize, Sequelize.DataTypes);
  db[model.name] = model;
}

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
