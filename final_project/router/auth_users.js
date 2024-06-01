const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
return users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
return users.some(user => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
   // Retrieve the username and password from the request body
   const { username, password } = req.body;

   // Check if the username and password are provided
   if (!username || !password) {
     return res.status(400).json({ message: "Username and password are required" });
   }
 
   // Check if the username and password match an existing user
   if (!authenticatedUser(username, password)) {
     return res.status(401).json({ message: "Invalid username or password" });
   }
 
   // Generate a JWT token
   const token = jwt.sign({ username }, "your_jwt_secret_key", { expiresIn: '1h' });
 
   // Save the token in the session
   req.session.token = token;
 
   // Return the token to the user
   return res.status(200).json({ message: "Login successful", token });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    // Retrieve the ISBN from the request parameters
    const isbn = req.params.isbn;
  
    // Retrieve the username from the session
    const username = req.user.username;
  
    // Check if a review for the given ISBN exists for the current user
    if (books[isbn].reviews[username]) {
      // Delete the review
      delete books[isbn].reviews[username];
      return res.status(200).json({ message: "Review deleted successfully" });
    } else {
      return res.status(404).json({ message: "Review not found" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
   // Retrieve the review text and ISBN from the request query parameters
   const { review } = req.query;
   const isbn = req.params.isbn;
 
   // Retrieve the username from the session
   const username = req.user.username;
 
   // Check if the review text is provided
   if (!review) {
     return res.status(400).json({ message: "Review text is required" });
   }
 
   // Check if a review for the given ISBN already exists for the current user
   if (books[isbn].reviews[username]) {
     // Modify the existing review
     books[isbn].reviews[username] = review;
     return res.status(200).json({ message: "Review modified successfully", review });
   } else {
     // Add a new review
     books[isbn].reviews[username] = review;
     return res.status(200).json({ message: "Review added successfully", review });
    }
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
