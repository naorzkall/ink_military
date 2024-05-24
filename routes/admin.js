const path = require('path');
const express = require('express');
const { check, body } = require('express-validator');
const adminController = require('../controllers/admin');
const router = express.Router();
const isAuth = require('../middleware/is-auth'); //isAuth: in future we will use it to athunticate user


router.get('/SignStudent',isAuth, adminController.getSignStudent);

router.get('/SignEmployee',isAuth, adminController.getSignEmployee);

router.get('/SignAdmin',isAuth, adminController.getSignAdmin);

router.post('/SignAdmin',isAuth, adminController.postSignAdmin);

router.post('/signEmployee',isAuth, adminController.postSignEmployee);

router.post('/signStudent',isAuth, adminController.postSignStudent);


module.exports = router;
