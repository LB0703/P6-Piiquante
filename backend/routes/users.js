// Importing express
const express = require('express');
// Creating router with the Router() function
const router = express.Router();

// Importing user controller
const userCtrl = require('../controllers/users');

// Creating the signup and login routes
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

// Exporting router
module.exports = router;
