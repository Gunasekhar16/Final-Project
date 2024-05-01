const Book = require('../schema/book');

async function getBook(req, res, next) {
    let book;
    try {
      book = await Book.findById(req.params.id);
      if (book == null) {
        return res.status(404).send({ success: false, message: 'Cannot find book' });
      }
    } catch (err) {
      if ((err.message = "Unauthorized")) {
        res.render("login", { error: "Unauthorized" });
      } else {
        res.status(400).send({ success: false, message: err.message });
      }      return res.status(500).send({ success: false, message: err.message });
    }
  
    res.book = book;
    next();
}

module.exports = getBook;