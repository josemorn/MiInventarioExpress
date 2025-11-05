const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { registerValidation, loginValidation } = require('../middleware/validators');
const { isNotAuthenticated } = require('../middleware/auth');

router.get('/register', isNotAuthenticated, authController.showRegister);
router.post('/register', isNotAuthenticated, registerValidation, authController.register);
router.get('/login', isNotAuthenticated, authController.showLogin);
router.post('/login', isNotAuthenticated, loginValidation, authController.login);
router.get('/logout', authController.logout);

module.exports = router;
