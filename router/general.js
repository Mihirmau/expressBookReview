const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// Task 10: Get the list of books available in the shop using Async/Await with Axios
public_users.get('/', async function (req, res) {
  try {
    const response = await axios.get('http://localhost:5000/');
    return res.status(200).send(JSON.stringify(response.data, null, 4));
  } catch (error) {
    return res.status(500).json({ message: "Error fetching book list" });
  }
});

// Task 11: Get book details based on ISBN using Promises with Axios
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  axios.get(`http://localhost:5000/`)
    .then((response) => {
      const bookList = response.data;
      if (bookList[isbn]) {
        return res.status(200).send(JSON.stringify(bookList[isbn], null, 4));
      } else {
        return res.status(404).json({ message: "Book not found" });
      }
    })
    .catch((error) => {
      return res.status(500).json({ message: "Error fetching book details by ISBN" });
    });
});

// Task 12: Get book details based on Author using Promises with Axios
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  axios.get('http://localhost:5000/')
    .then((response) => {
      const bookList = response.data;
      let matchingBooks = [];
      Object.keys(bookList).forEach((key) => {
        if (bookList[key].author.toLowerCase() === author.toLowerCase()) {
          matchingBooks.push({ isbn: key, ...bookList[key] });
        }
      });
      if (matchingBooks.length > 0) {
        return res.status(200).send(JSON.stringify(matchingBooks, null, 4));
      } else {
        return res.status(404).json({ message: "No books found by this author" });
      }
    })
    .catch((error) => {
      return res.status(500).json({ message: "Error fetching books by author" });
    });
});

// Task 13: Get book details based on Title using Promises with Axios
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  axios.get('http://localhost:5000/')
    .then((response) => {
      const bookList = response.data;
      let matchingBooks = [];
      Object.keys(bookList).forEach((key) => {
        if (bookList[key].title.toLowerCase() === title.toLowerCase()) {
          matchingBooks.push({ isbn: key, ...bookList[key] });
        }
      });
      if (matchingBooks.length > 0) {
        return res.status(200).send(JSON.stringify(matchingBooks, null, 4));
      } else {
        return res.status(404).json({ message: "No books found with this title" });
      }
    })
    .catch((error) => {
      return res.status(500).json({ message: "Error fetching books by title" });
    });
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
