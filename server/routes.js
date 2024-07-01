const express = require('express');
const { Book } = require('./models');
const router = express.Router();
const { Op } = require('sequelize');

// List all books
router.get('/books', async (req, res) => {
  try {
    const books = await Book.findAll();
    res.json(books);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Search for a book by title, author, or ISBN
router.get('/books/search', async (req, res) => {
  const { query } = req.query;
  try {
    const books = await Book.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.like]: `%${query}%` } },
          { author: { [Op.like]: `%${query}%` } },
          { isbn: { [Op.like]: `%${query}%` } }
        ]
      }
    });
    if (books.length) {
      res.json(books);
    } else {
      res.status(404).send('No books found matching the criteria');
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Update book rating
router.put('/books/:id/rating', async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (book) {
      const updatedBook = await book.update({ rating: req.body.rating });
      res.json(updatedBook);
    } else {
      res.status(404).send('Book not found');
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
