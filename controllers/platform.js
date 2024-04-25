const fs = require('fs');
const path = require('path');
const stripe = require('stripe')('sk_test_51OtvXRRpfNdOVmP1KDdZEcpteHm0tHvc3FjhQ05DSIq9pbCjDW3pp9kdblNVbR5CYoayq8kBAblQPwkwdLg9I2vA00A5F9aTmL');
const PDFDocument = require('pdfkit');

const ITEMS_PER_PAGE = 4;

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