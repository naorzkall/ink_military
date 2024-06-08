const path = require('path');
const express = require('express');
const platformController = require('../controllers/platform');
const Auth = require('../middleware/is-auth');


const router = express.Router();

router.get('/',Auth.isAuth, platformController.getIndex);

router.get('/myrequest',Auth.isAuth, platformController.getMyReq);

router.get('/incomingRequests',Auth.isAuth, platformController.getIncReqs);

router.get('/InProgress',Auth.isAuth, platformController.getInProgress);

router.get('/MyProfile',Auth.isAuth, platformController.getProfile);

// trying Auth.isStudent
router.get('/MyWallet',Auth.isAuth, Auth.isStudent, platformController.getWallet);

router.get('/MyWallet/success/:session_id',Auth.isAuth, platformController.getCheckoutSuccess);

router.get('/MyWallet/cancel',Auth.isAuth, platformController.getWallet);

router.post('/create-checkout-session',Auth.isAuth, platformController.postcheckout);

module.exports = router;
