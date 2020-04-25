const Book = require('../models/book');
const Author = require('../models/author');
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
//const multer = require('multer');
//const path = require('path');
//const fs = require('fs');
//const uploadPath = path.join('public', Book.coverImageBasePath);

//const upload = multer({
//  dest: uploadPath,
//  fileFilter: (req, file, cb) => {
//    cb(null, imageMimeTypes.includes(file.mimetype));
//  },
//});

//get all books
exports.getAllBooks = async (req, res) => {
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
    return res.redirect('/');
  }
};

//get request for creating new book
exports.createNewBookGet = async (req, res) => {
  renderNewPage(res, new Book());
};

//post request for creating new book
exports.createNewBookPost = async (req, res) => {
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    publishDate: req.body.publishDate,
    pageCount: req.body.pageCount,
    description: req.body.description,
    link: req.body.link,
  });

  saveCover(book, req.body.cover);
  //console.log(book);
  //console.log(fileName);

  try {
    const newBook = await book.save();
    return res.redirect(`/books/${book.id}`);
    //res.redirect(`books`);
  } catch (error) {
    //console.log(error);
    renderNewPage(res, book, true);
  }
};

//get single book
exports.getBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id).populate('author').exec();
    res.render('books/show', { book: book });
  } catch (error) {
    console.error;
    return res.redirect('/');
  }
};

//edit book
exports.editBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    renderEditPage(res, book);
  } catch (error) {
    return res.redirect('/');
  }
};

//update book
exports.updateBook = async (req, res) => {
  let book;

  try {
    book = await Book.findById(req.params.id);
    book.title = req.body.title;
    book.author = req.body.author;
    book.publishDate = req.body.publishDate;
    book.pageCount = req.body.pageCount;
    book.description = req.body.description;
    if (req.body.cover != null && req.body.cover !== '') {
      saveCover(book, req.body.cover);
    }
    await book.save();
    return res.redirect(`/books/${book.id}`);
  } catch (error) {
    //console.log(error);
    if (book != null) {
      renderEditPage(res, book, true);
    } else {
      return res.redirect('/');
    }
  }
};

//delete book
exports.deleteBook = async (req, res) => {
  let book;
  try {
    book = await Book.findById(req.params.id);
    await book.remove();
    return res.redirect('/books');
  } catch (error) {
    if (book != null) {
      res.render('books/show', {
        book: book,
        errorMessage: 'Could Not remove bOOK',
      });
    } else {
      return res.redirect('/');
    }
  }
};

//helper functions
async function renderNewPage(res, book, hasError = false) {
  renderFormPage(res, book, 'new', hasError);
}

async function renderEditPage(res, book, hasError = false) {
  renderFormPage(res, book, 'edit', hasError);
}

async function renderFormPage(res, book, form, hasError = false) {
  try {
    const authors = await Author.find({});
    const params = {
      authors: authors,
      book: book,
    };
    if (hasError) {
      if (form === 'edit') {
        params.errorMessage = 'Error Updating book';
      } else {
        params.errorMessage = 'Error creating book';
      }
    }
    res.render(`books/${form}`, params);
  } catch {
    return res.redirect('/books');
  }
}

function saveCover(book, coverEncoded) {
  if (coverEncoded == null) return;

  const cover = JSON.parse(coverEncoded);
  if (cover != null && imageMimeTypes.includes(cover.type)) {
    book.coverImage = new Buffer.from(cover.data, 'base64');
    book.coverImageType = cover.type;
  }
}

//multer parts
//create Book with multer upload
//router.post('/', upload.single('cover'), async (req, res) => {
//  const fileName = req.file != null ? req.file.filename : null;
//  const book = new Book({
//    title: req.body.title,
//    author: req.body.author,
//    publishDate: req.body.publishDate,
//    pageCount: req.body.pageCount,
//    description: req.body.description,
//    coverImage: fileName,
//    link: req.body.link,
//  });
//console.log(book);
//console.log(fileName);

//  try {
//    const newBook = await book.save();
//res.redirect(`books/${book.id}`);
//    res.redirect(`books`);
//  } catch (error) {
//console.log(error);
//    if (book.coverImage != null) {
//      removeBookCover(book.coverImage);
//    }
//    renderNewPage(res, book, true);
//  }
//});

//function removeBookCover(filename) {
//  fs.unlink(path.join(uploadPath, filename), (err) => {
//    if (err) console.error(err);
//  });
//}
