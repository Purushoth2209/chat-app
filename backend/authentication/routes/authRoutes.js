const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');
const { addContact } = require('../controllers/addContact');  // Import the addContact controller
const { searchUser } = require('../controllers/searchUser');  // Import the searchUser controller
const authMiddleware = require('../middleware/authMiddleware');  // Import the authentication middleware
const { fetchContact } = require('../controllers/fetchContact');

const router = express.Router();

// User Registration Route
router.post('/register', registerUser);

// User Login Route
router.post('/login', loginUser);

// Protected Route Example
router.get('/protected', authMiddleware, (req, res) => {
  res.json({ msg: 'This is a protected route', user: req.user });
});

// Route to search for a user by phone number or username (protected route)
router.get('/search',searchUser); // Only accessible to authenticated users

// Route to add a contact (protected route)
router.post('/addContact',addContact); // Only accessible to authenticated users
router.get('/fetchContact',fetchContact);
module.exports = router;
