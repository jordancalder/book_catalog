const express = require('express');
const { Book, Rating } = require('./models');
const router = express.Router();
const { Op } = require('sequelize');
const Joi = require('joi');

async function getBooksFromDatabase({ search, skip, limit }) {
  let whereCondition = {};
  if (search) {
    const parsedSearch = parseInt(search);
    if (isNaN(parsedSearch)) {
      whereCondition = {
        [Op.or]: [
          { author: { [Op.iLike]: `%${search}%` } },
          { title: { [Op.iLike]: `%${search}%` } },
        ]
      };
    } else {
      whereCondition = { ISBN: parsedSearch }
    }
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

const querySchema = Joi.object({
  page: Joi.number().integer().min(1),
  limit: Joi.number().integer().min(1).max(100),
  search: Joi.string().trim().allow('').optional()
    .regex(/^[a-zA-Z0-9\s]+$/)
    .message('Search term contains invalid characters'),
});

router.get('/books', async (req, res) => {
  // Validate and sanitize the request query
  const { error, value } = querySchema.validate(req.query, { abortEarly: false, stripUnknown: true });
  if (error) {
    return res.status(400).json({ message: 'Validation error', details: error.details });
  }

  const { page = 1, limit = 10, search = '' } = value;
  const skip = (page - 1) * limit;

  try {
    const { data, totalCount } = await getBooksFromDatabase({ search, skip, limit });
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

const ratingSchema = Joi.object({
  rating: Joi.number().min(1).max(5).required(),
});

// Update book rating
router.post('/books/:id/rating', async (req, res) => {
  try {
    const { error, value } = ratingSchema.validate(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    const bookId = req.params.id;
    const { rating } = value;

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
