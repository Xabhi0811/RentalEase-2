const express = require("express");
const router = express.Router();
const { body } = require("express-validator"); 
const {registerUser , login} = require("../controllers/UserController")

// SIGNIN route
router.post('/signin', [
  body('fullname').isLength({ min: 3 }).withMessage('Name must be at least 3 characters long'),
  body('email').isEmail().withMessage('Please provide a valid email address'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
], registerUser);

// LOGIN route
// Fix your route definition - remove the intermediate handler
router.post('/login', [
  body('email')
    .isEmail()
    .withMessage('Invalid email address'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
], login); // Directly use the login controller

// LOGOUT route
router.get('/logout', (req, res) => {
  res.send("Logged out successfully");
});

module.exports = router;
