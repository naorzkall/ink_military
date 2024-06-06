const express = require('express');
const { check, body } = require('express-validator');
const User = require('../models/user');
const authController = require('../controllers/auth');


const router = express.Router();

router.get('/login', authController.getLogin);

router.post('/login',[
    check('email')
      .isEmail()
      .withMessage('Please enter a valid email address.')
      .normalizeEmail(),
    body('password', 'Password has to be valid.')
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim()
  ],
 authController.postLogin);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;