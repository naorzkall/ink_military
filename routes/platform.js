const path = require('path');
const express = require('express');
const platformController = require('../controllers/platform');
const isAuth = require('../middleware/is-auth');


const router = express.Router();

router.get('/', platformController.getIndex);

router.get('/myrequest', platformController.getMyReq);

router.get('/incomingRequests', platformController.getIncReqs);

router.get('/InProgress', platformController.getInProgress);

router.get('/MyProfile', platformController.getProfile);

router.get('/MyWallet', platformController.getWallet);

module.exports = router;
