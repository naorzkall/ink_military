const path = require('path');
const express = require('express');
const platformController = require('../controllers/platform');
const Auth = require('../middleware/is-auth');
const newsController = require('../controllers/news');


const router = express.Router();

router.get('/',Auth.isAuth, newsController.getAllNews);

router.get('/addRequest',Auth.isAuth, platformController.addRequest);

router.get('/incomingRequests',Auth.isAuth, platformController.getIncReqs);

router.get('/InProgress',Auth.isAuth, platformController.getInProgress);

router.get('/MyProfile',Auth.isAuth,Auth.isStudent, platformController.getProfile);

// trying Auth.isStudent
router.get('/MyWallet',Auth.isAuth, Auth.isStudent, platformController.getWallet);

router.get('/MyWallet/success/:session_id',Auth.isAuth, platformController.getCheckoutSuccess);

router.get('/MyWallet/cancel',Auth.isAuth, platformController.getWallet);

router.post('/create-checkout-session',Auth.isAuth, platformController.postcheckout);

module.exports = router;
