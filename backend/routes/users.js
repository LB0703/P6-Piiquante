// Importing express
const express = require('express');
// Creating router with the Router() function
const router = express.Router();

// Importing user controller
const userCtrl = require('../controllers/users');

// Importing validPassword
const validPassword = require('../middlewares/valid-password');

// Creating the signup and login routes
router.post('/signup', validPassword, userCtrl.signup);
router.post('/login', userCtrl.login);

// Exporting router
module.exports = router;

