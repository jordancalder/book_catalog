const fs = require('fs');
const csv = require('csv-parser');
const { Sequelize } = require('sequelize');
const config = require('../config/config.json');
const { Book } = require('../models');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const csvFilePath = process.argv[2];
if (!csvFilePath) {
  console.error('Please provide a path to the CSV file.');
  process.exit(1);
}

const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
  host: dbConfig.host,
  dialect: dbConfig.dialect,
});

async function readCSVAndInsertData(filePath) {
  const results = [];

  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', (data) => {
      // Assuming 'data' is an object with a 'publicationYear' property among others
      data.publicationYear = parseInt(data.publicationYear, 10); // Convert publicationYear to integer
      results.push(data);
    })
    .on('end', () => {
      // Insert data into the database
      Book.bulkCreate(results)
        .then(() => console.log('Data has been inserted successfully.'))
        .catch((error) => console.error('Error inserting data:', error));
    });
}

readCSVAndInsertData(csvFilePath);
