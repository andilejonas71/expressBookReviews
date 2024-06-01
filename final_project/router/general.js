const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  // Retrieve the username and password from the request body
  const { username, password } = req.body;

  // Check if the username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if the username already exists
  const userExists = users.some(user => user.username === username);
  if (userExists) {
    return res.status(400).json({ message: "Username already exists" });
  }

  // Add the new user to the users array
  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  const booksList = JSON.stringify(books, null, 2);
  res.setHeader('Content-Type', 'application/json');
  return res.status(200).send(booksList);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  // Retrieve the ISBN from the request parameters
  const isbn = req.params.isbn;
  
  // Find the book with the matching ISBN
  const book = books[isbn];
  
  // Check if the book exists
  if (book) {
    return res.status(200).json(book);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  // Retrieve the author from the request parameters
  const author = req.params.author;

  // Initialize an array to hold books by the specified author
  let booksByAuthor = [];

  // Iterate through the books object
  for (let key in books) {
    if (books[key].author === author) {
      booksByAuthor.push(books[key]);
    }
  }

  // Check if any books were found
  if (booksByAuthor.length > 0) {
    return res.status(200).json(booksByAuthor);
  } else {
    return res.status(404).json({ message: "No books found by this author" });
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
// Retrieve the title from the request parameters
const title = req.params.title;

// Initialize an array to hold books with the specified title
let booksByTitle = [];

// Iterate through the books object
for (let key in books) {
  if (books[key].title === title) {
    booksByTitle.push(books[key]);
  }
}

// Check if any books were found
if (booksByTitle.length > 0) {
  return res.status(200).json(booksByTitle);
} else {
  return res.status(404).json({ message: "No books found with this title" });
}
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
   // Retrieve the ISBN from the request parameters
   const isbn = req.params.isbn;

   // Find the book with the matching ISBN
   const book = books[isbn];
 
   // Check if the book exists
   if (book) {
     return res.status(200).json(book.reviews);
   } else {
     return res.status(404).json({ message: "Book not found" });
   }
});

module.exports.general = public_users;