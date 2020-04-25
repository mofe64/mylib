const express = require('express');
const router = express.Router();
const Book = require('../models/book');
const authController = require('../controllers/AuthController');

//router.use(authController.isLoggedIn);

router.get('/', authController.isLoggedIn, async (req, res) => {
  let books = [];
  try {
    books = await Book.find().sort({ createdAt: 'desc' }).limit(20).exec();
  } catch (error) {
    console.error;
    books = [];
  }
  res.render('index', { books: books });
});

module.exports = router;
