const mongoose = require('mongoose');
const fileHelper = require('../util/file');
const { validationResult } = require('express-validator');

exports.getSignStudent = (req, res, next) => {
    res.render('admin/SignStudent', {
      path: '/SignStudent',
      pageTitle: 'Signin Student',
      // errorMessage: message,
      oldInput: {
        email: '',
        password: ''
      },
      validationErrors: []
    });
};

exports.getSignEmployee= (req, res, next) => {
  res.render('admin/SignEmployee', {
    path: '/SignEmployee',
    pageTitle: 'Signin Employee',
    // errorMessage: message,
    oldInput: {
      email: '',
      password: ''
    },
    validationErrors: []
  });
};

exports.getSignAdmin= (req, res, next) => {
  res.render('admin/SignAdmin', {
    path: '/Signadmin',
    pageTitle: 'Signin Amin',
    // errorMessage: message,
    oldInput: {
      email: '',
      password: ''
    },
    validationErrors: []
  });
};

