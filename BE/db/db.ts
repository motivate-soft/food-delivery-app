import { Sequelize } from 'sequelize';
import { modelsArray } from './../models/index';
require('dotenv').config()
export let sequelize: Sequelize;

export async function initDatabase() {
  if (!sequelize) {
    sequelize = new Sequelize(process.env.DB_NAME as string, process.env.DB_USER as string, process.env.DB_PASS, {
      dialect: 'mysql',
      port: process.env.DB_PORT as any,
      host: process.env.DB_HOST,
      logging: false
    });
    initTables();
  }
  await sequelize.sync();
}

function initTables() {
  modelsArray.forEach((m) => m.initialize());
}
