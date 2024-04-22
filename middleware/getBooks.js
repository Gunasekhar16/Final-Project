const Book = require('../schema/book');

async function getBook(req, res, next) {
    let book;
    try {
      console.log("req. params", req.params)
      book = await Book.findById(req.params.id);
      console.log("Book", book)
      if (book == null) {
        return res.status(404).send({ success: false, message: 'Cannot find book' });
      }
    } catch (err) {
      return res.status(500).send({ success: false, message: err.message });
    }
  
    res.book = book;
    next();
}

module.exports = getBook;