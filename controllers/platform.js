const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({path:"config.env"});
const stripe = require('stripe')(process.env.STRIPE_TEST_KEY);
const PDFDocument = require('pdfkit');

exports.getIndex = (req, res, next) => {
  res.render('platform/index', {
    path: '/index',
    pageTitle: 'index',
  });
};

exports.getMyReq = (req, res, next) => {
  res.render('platform/myrequest', {
    path: '/myrequest',
    pageTitle: 'myrequest'
  });
};

exports.getIncReqs = (req, res, next) => {
  res.render('platform/incomingRequests', {
    path: '/incomingRequests',
    pageTitle: 'incomingRequests'
  });
};

exports.getInProgress = (req, res, next) => {
  res.render('platform/InProgress', {
    path: '/InProgress',
    pageTitle: 'InProgress Requests'
  });
};

exports.getProfile = (req, res, next) => {
  res.render('platform/MyProfile', {
    path: '/MyProfile',
    pageTitle: 'my profile'
  });
};

exports.getWallet = (req, res, next) => {
  res.render('platform/MyWallet', {
    path: '/MyWallet',
    pageTitle: 'my Wallet'
  });
};