const path = require('path');
const express = require('express');
const platformController = require('../controllers/platform');
const isAuth = require('../middleware/is-auth');


const router = express.Router();

router.get('/',isAuth, platformController.getIndex);

router.get('/myrequest',isAuth, platformController.getMyReq);

router.get('/incomingRequests',isAuth, platformController.getIncReqs);

router.get('/InProgress',isAuth, platformController.getInProgress);

router.get('/MyProfile',isAuth, platformController.getProfile);

router.get('/MyWallet',isAuth, platformController.getWallet);

module.exports = router;
