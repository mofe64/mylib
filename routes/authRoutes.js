const express = require('express');
const authController = require('../controllers/AuthController');

const router = express.Router();

router.post('/signup', authController.signUp);
router.post('/login', authController.logIn);

module.exports = router;
