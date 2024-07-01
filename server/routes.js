const express = require('express');
const { Book, Rating } = require('./models');
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

router.get('/books/:id', async (req, res) => { 
  const book = await Book.findByPk(req.params.id, {
    include: [{
      model: Rating,
      as: 'ratings'
    }]
  });
  if (book) {
    let averageRating = 0;
    if (book.ratings.length > 0) {
      const totalRating = book.ratings.reduce((acc, rating) => acc + rating.rating, 0);
      averageRating = totalRating / book.ratings.length;
    }
    book.dataValues.averageRating = averageRating;

    res.json(book);
  } else {
    res.status(404).send('Book not found');
  }
});

// Update book rating
router.post('/books/:id/rating', async (req, res) => {
  try {
    const bookId = req.params.id;
    const { rating } = req.body;

    const book = await Book.findByPk(bookId);
    if (!book) {
      return res.status(404).send('Book not found');
    }

    const newRating = await Rating.create({
      bookId,
      rating,
    });

    const bookRatings = await Rating.findAll({
      where: {
        bookId,
      },
    });

    const totalRating = bookRatings.reduce((acc, rating) => acc + rating.rating, 0);
    const averageRating = totalRating / bookRatings.length;

    res.json({ averageRating, ...newRating });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
