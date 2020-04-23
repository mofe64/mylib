const express = require('express');
const router = express.Router();

const Book = require('../models/book');
const Author = require('../models/author');
const bookController = require('../controllers/bookController');

const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

//All Books route
router.get('/', bookController.getAllBooks);

//new Book
router.get('/new', bookController.createNewBookGet);

//create Book using filepond
router.post('/', bookController.createNewBookPost);

//show book route
router.get('/:id', bookController.getBook);

//edit book route
router.get('/:id/edit', bookController.editBook);

//update book route
router.put('/:id', bookController.updateBook);

//delete book route
router.delete('/:id', bookController.deleteBook);

module.exports = router;
