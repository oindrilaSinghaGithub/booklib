const express = require("express");
const Book = require("../models/Book");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();


// ✅ Add a Book
router.post("/",protect,adminOnly, async (req, res) => {
  try {
    const { title, author, genre, rating } = req.body;

    if (!title || !author || !genre) {
      return res.status(400).json({
        message: "Title, Author and Genre are required",
      });
    }

    const book = await Book.create({
      title,
      author,
      genre,
      rating,
    });

    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ✅ Get All Books (Pagination + Filters)
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10, genre, rating } = req.query;

    let filter = {};

    if (genre) {
      filter.genre = genre;
    }

    if (rating) {
      filter.rating = { $gte: Number(rating) };
    }

    const books = await Book.find(filter)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ✅ Get Specific Book by ID
router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json(book);
  } catch (error) {
    res.status(400).json({ message: "Invalid Book ID" });
  }
});

module.exports = router;