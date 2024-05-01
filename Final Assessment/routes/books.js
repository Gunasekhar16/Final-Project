const express = require("express");
const router = express.Router();
const Book = require("../schema/book");
const getBook = require("../middleware/getBooks");
const auth = require("../middleware/auth");

router.get("/books-list", (req, res) => {
  res.render("books");
});

router.get("/new", (req, res) => {
  res.render("addBook");
});

router.get("/", auth, async (req, res) => {
  try {
    const books = await Book.find();
    res.render("books", { books });
  } catch (err) {
    if (JSON.parse(err).messag == "Unauthorized") {
      res.render("login", { error: "Unauthorized" });
    } else {
      res.status(400).send({ success: false, message: err.message });
    }
  }
});

// Get one book
router.get("/:id", auth, getBook, async (req, res) => {
  try {
    res.render("viewBook", { book: res.book });
  } catch (err) {

    if (JSON.parse(err).message == "Unauthorized") {
      res.render("login", { error: "Unauthorized" });
    } else {
      res.status(400).send({ success: false, message: err.message });
    }
  }
});

router.get("/:id/edit", auth, getBook, (req, res) => {
  try {
    res.render("editBook", { book: res.book });
  } catch (err) {
    if ((err.message = "Unauthorized")) {
      res.render("login", { error: "Unauthorized" });
    } else {
      res.status(400).send({ success: false, message: err.message });
    }
  }
});

// Create a book
router.post("/", auth, async (req, res) => {
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    description: req.body.description,
    pageCount: req.body.pageCount,
    publishDate: req.body.publishDate,
  });

  try {
    await book.save();
    const books = await Book.find();
    res.render("books", { books }); // Pass the books array to the template
  } catch (err) {
    if ((err.message = "Unauthorized")) {
      res.render("login", { error: "Unauthorized" });
    } else {
      res.status(400).send({ success: false, message: err.message });
    }
  }
});

// Update a book
router.post("/:id", auth, getBook, async (req, res) => {
  if (req.body.title != null) {
    res.book.title = req.body.title;
  }
  if (req.body.author != null) {
    res.book.author = req.body.author;
  }
  if (req.body.description != null) {
    res.book.description = req.body.description;
  }
  if (req.body.pageCount != null) {
    res.book.pageCount = req.body.pageCount;
  }
  if (req.body.publishDate != null) {
    res.book.publishDate = req.body.publishDate;
  }
  try {
    await res.book.save();
    res.redirect("/books-list");
  } catch (err) {
    if ((err.message = "Unauthorized")) {
      res.render("login", { error: "Unauthorized" });
    } else {
      res.status(400).send({ success: false, message: err.message });
    }
  }
});

// Delete a book
router.post("/:id/delete", auth, getBook, async (req, res) => {
  try {
    await res.book.deleteOne();
    const books = await Book.find();
    res.redirect("/books-list");
  } catch (err) {
    if ((err.message = "Unauthorized")) {
      res.render("login", { error: "Unauthorized" });
    } else {
      res.status(400).send({ success: false, message: err.message });
    }
  }
});

module.exports = router;
