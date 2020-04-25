const express = require('express');
const router = express.Router();
const authController = require('../controllers/AuthController');
const Book = require('../models/book');
const Author = require('../models/author');
const bookController = require('../controllers/bookController');

const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

//router.use(authController.protect);
//All Books route
router.get('/', authController.isLoggedIn, bookController.getAllBooks);

//new Book
router.get('/new', authController.isLoggedIn, bookController.createNewBookGet);

//create Book using filepond
router.post('/', authController.isLoggedIn, bookController.createNewBookPost);

//show book route
router.get('/:id', authController.isLoggedIn, bookController.getBook);

//edit book route
router.get('/:id/edit', authController.isLoggedIn, bookController.editBook);

//update book route
router.put('/:id', authController.isLoggedIn, bookController.updateBook);

//delete book route
router.delete('/:id', authController.isLoggedIn, bookController.deleteBook);

module.exports = router;
