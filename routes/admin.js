const path = require('path');
const express = require('express');
const { check, body } = require('express-validator');
const adminController = require('../controllers/admin');
const router = express.Router();
const Auth = require('../middleware/is-auth'); //isAuth: in future we will use it to athunticate user


router.get('/SignStudent',Auth.isAuth, adminController.getSignStudent);

router.get('/SignEmployee',Auth.isAuth, adminController.getSignEmployee);

router.get('/SignAdmin',Auth.isAuth, adminController.getSignAdmin);
router.get('/edit-user/:adminId',Auth.isAuth, adminController.getEditAdmin);

router.get('/manageUsers',Auth.isAuth, adminController.manageUsers);
router.post('/delete-user/:userId',Auth.isAuth,adminController.deleteUser);

router.post('/SignAdmin',Auth.isAuth, adminController.postSignAdmin);
router.post('/editAdmin',Auth.isAuth, adminController.postEditAdmin);


router.post('/signEmployee',Auth.isAuth, adminController.postSignEmployee);

router.post('/signStudent',Auth.isAuth, adminController.postSignStudent);



module.exports = router;
