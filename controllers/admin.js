const mongoose = require('mongoose');
const fileHelper = require('../util/file');
const { validationResult } = require('express-validator');
const crypto = require('crypto');
const dotenv = require('dotenv');
dotenv.config({path:"config.env"});
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer'); 

const User = require('../models/user');
const Student = require('../models/student');
const Employee = require('../models/employee');

const transporter = nodemailer.createTransport({
  service: 'gmail', // your email domain
  auth: {
      user: process.env.NODEJS_GMAIL_APP_USER,   // your email address
      pass: process.env.NODEJS_GMAIL_APP_PASSWORD // your password
  }
});

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

exports.postSignAdmin = (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  bcrypt
  .hash(password, 12)
  .then(hashedPassword => {
    const user = new User({
      email: email,
      name:name,
      password: hashedPassword,
      user_type:"Admin"
    });
    return user.save();
  })
  .then(result => {
    res.redirect('/admin/SignAdmin');
    return transporter.sendMail({
      from: process.env.NODEJS_GMAIL_APP_USER,
      to: email,
      subject: 'Signup succeeded!',
      html: "<h1>you successfully signed up.</h1>"
    });
  })
  .catch(err => {
    console.log(err);
    // const error = new Error(err);
    // error.httpStatusCode = 500;
    // return next(error);
  });  
};

exports.postSignEmployee = (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const division = req.body.division;

  res.redirect('/admin/SignEmployee');
  bcrypt
  .hash(password, 12)
  .then(hashedPassword => {
    const employee = new Employee({
      email: email,
      name:name,
      password: hashedPassword,
      // userType:usertype,
      division:division
    });
    return employee.save();
  })
  .then(result => {
    res.redirect('/admin/SignEmployee');
    return transporter.sendMail({
      from: process.env.NODEJS_GMAIL_APP_USER,
      to: email,
      subject: 'Signup succeeded!',
      html: "<h1>you successfully signed up.</h1>"
    });
  })
  .catch(err => {
    console.log(err);
    // const error = new Error(err);
    // error.httpStatusCode = 500;
    // return next(error);
  });  
};

exports.postSignStudent = (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const nationalNumber=req.body.nationalNumber;
  const militaryNumber=req.body.militaryNumber;
  const birthdate=req.body.birthdate;
  const phoneNumber=req.body.phoneNumber;
  const delayedTo=req.body.delayedTo;
  const division=req.body.division;
  const address=req.body.address;

  res.redirect('/admin/SignEmployee');
  bcrypt
  .hash(password, 12)
  .then(hashedPassword => {
    const employee = new Student({
      email: email,
      name:name,
      password: hashedPassword,
      nationalNumber:nationalNumber,
      militaryNumber:militaryNumber,
      birthdate:birthdate,
      phoneNumber:phoneNumber,
      delayedTo:delayedTo,
      division:division,
      address:address,
      balance:0,
    });
    return employee.save();
  })
  .then(result => {
    res.redirect('/admin/SignStudent');
    return transporter.sendMail({
      from: process.env.NODEJS_GMAIL_APP_USER,
      to: email,
      subject: 'Signup succeeded!',
      html: "<h1>you successfully signed up.</h1>"
    });
  })
  .catch(err => {
    console.log(err);
    // const error = new Error(err);
    // error.httpStatusCode = 500;
    // return next(error);
  });  
};