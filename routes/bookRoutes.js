const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Book = require('../models/book');
const Author = require('../models/author');
const uploadPath = path.join('public', Book.coverImageBasePath);
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

const upload = multer({
  dest: uploadPath,
  fileFilter: (req, file, cb) => {
    cb(null, imageMimeTypes.includes(file.mimetype));
  },
});

//All Books route
router.get('/', async (req, res) => {
  let query = Book.find();
  if (req.query.title != null && req.query.title != '') {
    query = query.regex('title', new RegExp(req.query.title, 'i'));
  }
  if (req.query.publishedBefore != null && req.query.publishedBefore != '') {
    query = query.lte('publishDate', req.query, publishedBefore);
  }
  if (req.query.publishedAfter != null && req.query.publishedAfter != '') {
    query = query.gte('publishDate', req.query, publishedAfter);
  }
  try {
    const books = await query.exec();
    res.render('books/index', {
      books: books,
      searchOptions: req.query,
    });
  } catch (error) {
    res.redirect('/');
  }
});

//new Book
router.get('/new', async (req, res) => {
  renderNewPage(res, new Book());
});

//create Book
router.post('/', upload.single('cover'), async (req, res) => {
  const fileName = req.file != null ? req.file.filename : null;
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    publishDate: req.body.publishDate,
    pageCount: req.body.pageCount,
    description: req.body.description,
    coverImage: fileName,
    link: req.body.link,
  });
  //console.log(book);
  //console.log(fileName);

  try {
    const newBook = await book.save();
    //res.redirect(`books/${book.id}`);
    res.redirect(`books`);
  } catch (error) {
    //console.log(error);
    if (book.coverImage != null) {
      removeBookCover(book.coverImage);
    }
    renderNewPage(res, book, true);
  }
});

function removeBookCover(filename) {
  fs.unlink(path.join(uploadPath, filename), (err) => {
    if (err) console.error(err);
  });
}

async function renderNewPage(res, book, hasError = false) {
  try {
    const authors = await Author.find({});
    const params = {
      authors: authors,
      book: book,
    };
    if (hasError) params.errorMessage = 'Error creating book';
    res.render('books/new', params);
  } catch {
    res.redirect('/books');
  }
}

module.exports = router;
