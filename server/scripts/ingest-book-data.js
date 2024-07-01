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

async function readCSVAndInsertData() {
  const results = [];
  const batchSize = 100;

  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', (data) => {
      data.publicationYear = parseInt(data.publicationYear, 10);
      results.push(data);

      if (results.length >= batchSize) {
        Book.bulkCreate(results.splice(0, batchSize))
          .then(() => console.log('Batch has been inserted successfully.'))
          .catch((error) => console.error('Error inserting batch:', error));
      }
    })
    .on('end', () => {
      if (results.length > 0) {
        Book.bulkCreate(results)
          .then(() => console.log('Final batch has been inserted successfully.'))
          .catch((error) => console.error('Error inserting final batch:', error));
      }
    });
}

readCSVAndInsertData(csvFilePath);
