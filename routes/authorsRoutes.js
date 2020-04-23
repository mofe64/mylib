const express = require('express');
const router = express.Router();
const Author = require('../models/author');
const Book = require('../models/book');
const authorController = require('../controllers/authorController');

//All authors route
router.get('/', authorController.getAllAuthors);

//new author
router.get('/new', authorController.newAuthorget);

//create new authors
router.post('/', authorController.createNewAuthor);

//get single author
router.get('/:id', authorController.getSingleAuthor);

//edit single author (get)
router.get('/:id/edit', authorController.editAuthorGet);

//edit single author (put)
router.put('/:id', authorController.editauthorPut);

//delete author
router.delete('/:id', authorController.deleteAuthor);

module.exports = router;
