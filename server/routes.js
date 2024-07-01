const express = require('express');
const { Book } = require('./models');
const router = express.Router();
const { Op } = require('sequelize');

async function getBooksFromDatabase({ searchTerm, skip, limit }) {
  let whereCondition = {};
  if (searchTerm) {
    whereCondition = {
      [Op.or]: [
        { author: { [Op.like]: `%${searchTerm}%` } },
        { title: { [Op.like]: `%${searchTerm}%` } },
        { ISBN: { [Op.like]: `%${searchTerm}%` } }
      ]
    };
  }
  const fetchBooks = Book.findAll({
    where: whereCondition,
    offset: skip,
    limit: limit,
  });
  const countTotal = Book.count({
    where: whereCondition,
  });
  const [data, totalCount] = await Promise.all([fetchBooks, countTotal]);

  return { data, totalCount };
}

router.get('/books', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10; 
  const { searchTerm } = req.query;
  const skip = (page - 1) * limit;

  try {
    const { data, totalCount } = await getBooksFromDatabase({ searchTerm, skip, limit});
    res.json({
      page,
      limit,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      data,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching books', error: error.message });
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
