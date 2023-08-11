import { SequelizeModuleOptions } from "@nestjs/sequelize";
import * as config from "config";

const dbConfig = config.get("db");

// sequelize 옵션
export const sequelizeConfig: SequelizeModuleOptions = {
  dialect: dbConfig.type,
  host: process.env.RDS_HOSTNAME || dbConfig.host,
  port: process.env.RDS_PORT || dbConfig.port,
  username: process.env.RDS_USERNAME || dbConfig.username,
  password: process.env.RDS_PASSWORD || dbConfig.password,
  database: process.env.RDS_DB_NAME || dbConfig.database,
  models: [__dirname + "/../**/*.model.ts"],
  autoLoadModels: dbConfig.autoLoadModels,
  synchronize: dbConfig.synchronize,
};
