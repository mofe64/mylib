const mongoose = require('mongoose');
const path = require('path');

const coverImageBasePath = 'uploads/bookCovers';

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  publishDate: {
    type: Date,
  },
  pageCount: {
    type: Number,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  coverImage: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author',
  },
  link: {
    type: String,
  },
});

bookSchema.virtual('coverImagePath').get(function () {
  if (this.coverImage != null) {
    return path.join('/', coverImageBasePath, this.coverImage);
  }
});

const Book = mongoose.model('Book', bookSchema);
module.exports = Book;
module.exports.coverImageBasePath = coverImageBasePath;
