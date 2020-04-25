const express = require('express');
const router = express.Router();
const Author = require('../models/author');
const Book = require('../models/book');
const authorController = require('../controllers/authorController');
const authContoller = require('../controllers/AuthController');

//router.use(authContoller.protect);

//All authors route
router.get('/', authContoller.isLoggedIn, authorController.getAllAuthors);

//new author
router.get(
  '/new',
  //authContoller.protect,
  authContoller.isLoggedIn,
  authorController.newAuthorget
);

//create new authors
router.post(
  '/',
  //authContoller.protect,
  authContoller.isLoggedIn,
  authorController.createNewAuthor
);

//get single author
router.get('/:id', authorController.getSingleAuthor);

//edit single author (get)
router.get(
  '/:id/edit',
  //authContoller.protect,
  authContoller.isLoggedIn,
  authorController.editAuthorGet
);

//edit single author (put)
router.put(
  '/:id',
  //authContoller.protect,
  authContoller.isLoggedIn,
  authorController.editauthorPut
);

//delete author
router.delete(
  '/:id',
  //authContoller.protect,
  authContoller.isLoggedIn,
  authorController.deleteAuthor
);

module.exports = router;
