const Author = require('../models/author');
const Book = require('../models/book');

exports.getAllAuthors = async (req, res) => {
  let searchOptions = {};
  if (req.query.name != null && req.query.name !== '') {
    searchOptions.name = new RegExp(req.query.name, 'i');
    //console.log(searchOptions);
  }
  try {
    // console.log(searchOptions);
    const authors = await Author.find(searchOptions);
    //console.log(authors);
    res.render('authors/index', {
      authors: authors,
      searchOptions: req.query,
    });
  } catch (error) {
    return res.redirect('/');
  }
};

exports.newAuthorget = async (req, res) => {
  res.render('authors/new', { author: new Author() });
};

exports.createNewAuthor = async (req, res) => {
  const author = new Author({
    name: req.body.name,
  });
  try {
    const newAuthor = await author.save();
    return res.redirect(`authors/${newAuthor.id}`);
    //res.redirect(`authors`);
  } catch (error) {
    res.render('authors/new', {
      author: author,
      errorMessage: 'Error Creating Author',
    });
  }
};

exports.getSingleAuthor = async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    const books = await Book.find({ author: author.id }).limit(6).exec();
    res.render('authors/show', {
      author: author,
      booksByAuthor: books,
    });
  } catch (error) {
    return res.redirect('/');
  }
};

exports.editAuthorGet = async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    res.render('authors/edit', { author: author });
  } catch (error) {
    console.log(error);
    return res.redirect('/authors');
  }
};

exports.editauthorPut = async (req, res) => {
  let author;
  try {
    author = await Author.findById(req.params.id);
    author.name = req.body.name;
    await author.save();
    return res.redirect(`/authors/${author.id}`);
  } catch (error) {
    console.log(error);
    if (author == null) {
      return res.redirect('/');
    } else {
      res.render('authors/edit', {
        author: author,
        errorMessage: 'Error updating author',
      });
    }
  }
};

exports.deleteAuthor = async (req, res) => {
  let author;
  try {
    author = await Author.findById(req.params.id);
    await author.remove();
    return res.redirect('/authors');
  } catch (error) {
    console.log(error);
    if (author == null) {
      return res.redirect('/');
    } else {
      return res.redirect(`/authors/${author.id}`);
    }
  }
};
