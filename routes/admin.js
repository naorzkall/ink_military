const path = require('path');
const express = require('express');
const { check, body } = require('express-validator');
const adminController = require('../controllers/admin');
const router = express.Router();
const isAuth = require('../middleware/is-auth'); //isAuth: in future we will use it to athunticate user


router.get('/SignStudent', adminController.getSignStudent);

router.get('/SignEmployee', adminController.getSignEmployee);

router.get('/SignAdmin', adminController.getSignAdmin);

router.post('/SignAdmin', adminController.postSignAdmin);

router.post('/signEmployee', adminController.postSignEmployee);

router.post('/signStudent', adminController.postSignStudent);


module.exports = router;
