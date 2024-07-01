const express = require("express");
const { Sequelize } = require("sequelize");
const config = require("./config/config.json");

const PORT = process.env.PORT || 3001;

const app = express();

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
  host: dbConfig.host,
  dialect: dbConfig.dialect
});

async function testDatabaseConnection() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

testDatabaseConnection();

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
