const fs = require('fs');
const csv = require('csv-parser');
const { Book } = require('../models');
const readCSVAndInsertData = require('./ingest-book-data');

jest.mock('fs');
jest.mock('csv-parser');
jest.mock('../models', () => ({
  Book: { bulkCreate: jest.fn() },
}));

describe('ingest-book-data script', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should parse CSV data and insert into the database', async () => {
    // Mock fs.createReadStream to not throw and to work with csv-parser
    const mockStream = {
      pipe: jest.fn().mockReturnThis(),
      on: jest.fn((event, handler) => {
        if (event === 'data') {
          handler({ title: 'Test Book', publicationYear: '2020' });
        } else if (event === 'end') {
          handler();
        }
        return mockStream;
      }),
    };
    fs.createReadStream.mockReturnValue(mockStream);

    // Mock Book.bulkCreate to resolve
    Book.bulkCreate.mockResolvedValue(true);

    // Execute the script function with a mock CSV file path
    await readCSVAndInsertData('./book_test.csv');

    // Verify Book.bulkCreate was called with the correct data
    expect(Book.bulkCreate).toHaveBeenCalledWith([
      { title: 'Test Book', publicationYear: 2020 },
    ]);
  });

  it('should handle errors when CSV file does not exist', async () => {
    // Mock fs.createReadStream to throw an error
    fs.createReadStream.mockImplementation(() => {
      throw new Error('File not found');
    });

    // Attempt to execute the script function with a non-existent file path
    await expect(readCSVAndInsertData('book_test.csv')).rejects.toThrow('File not found');
  });

  // Additional tests can be added here, such as testing error handling for Book.bulkCreate failures
});
