const express = require('express');
const viewContoller = require('../controllers/viewController');
const authController = require('../controllers/AuthController');

const router = express.Router();

//router.use(authController.protect);

router.get('/login', viewContoller.getLoginForm);

module.exports = router;
