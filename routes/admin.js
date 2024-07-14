const path = require('path');
const express = require('express');
const { check, body } = require('express-validator');
const adminController = require('../controllers/admin');
const router = express.Router();
const Auth = require('../middleware/is-auth'); //isAuth: in future we will use it to athunticate user
const validators = require('../middleware/validators');

router.get('/SignStudent',Auth.isAuth, adminController.getSignStudent);
router.get('/editStudent/:studentId',Auth.isAuth, adminController.getEditStudent);

router.get('/SignEmployee',Auth.isAuth, adminController.getSignEmployee);
router.get('/editEmployee/:employeeId',Auth.isAuth, adminController.getEditEmployee);

router.get('/SignAdmin',Auth.isAuth, adminController.getSignAdmin);
router.get('/editAdmin/:adminId',Auth.isAuth, adminController.getEditAdmin);

router.get('/manageUsers',Auth.isAuth, adminController.manageUsers);
router.post('/delete-user/:userId',Auth.isAuth,adminController.deleteUser);

router.post('/SignAdmin',validators.validateSignUp,Auth.isAuth, adminController.postSignAdmin);
router.post('/editAdmin',Auth.isAuth, adminController.postEditAdmin);

router.post('/signEmployee',validators.validateSignUp,Auth.isAuth, adminController.postSignEmployee);
router.post('/editEmployee',Auth.isAuth, adminController.postEditEmployee);

router.post('/signStudent',Auth.isAuth, adminController.postSignStudent);
router.post('/editStudent',Auth.isAuth, adminController.postEditStudent);


module.exports = router;
