const mongoose = require('mongoose');
const fileHelper = require('../util/file');
const { validationResult } = require('express-validator');
const crypto = require('crypto');
const dotenv = require('dotenv');
dotenv.config({path:"config.env"});
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer'); 

const Settings = require('../models/settings');
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
      editing: false,
      hasError: false,
      errorMessage: null,
      validationErrors: []
    });
};

exports.getEditStudent = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const userId = req.params.studentId;
  User.findById(userId)
    .then(student => {
      if (!student) {
        return res.redirect('/');
      }
      res.render('admin/SignStudent', {
        pageTitle: 'Edit Student',
        path: '/admin/SignAdmin',
        editing: editMode,
        student: student,
        hasError: false,
        errorMessage: null,
        validationErrors: []
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getSignEmployee= (req, res, next) => {
  res.render('admin/SignEmployee', {
    path: '/SignEmployee',
    pageTitle: 'Signin Employee',
    editing: false,
    hasError: false,
    errorMessage: null,
    validationErrors: []
  });
};

exports.getEditEmployee = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const userId = req.params.employeeId;
  User.findById(userId)
    .then(employee => {
      if (!employee) {
        return res.redirect('/');
      }
      res.render('admin/SignEmployee', {
        pageTitle: 'Edit Employee',
        path: '/admin/SignAdmin',
        editing: editMode,
        employee: employee,
        hasError: false,
        errorMessage: null,
        validationErrors: []
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getSignAdmin= (req, res, next) => {
  res.render('admin/SignAdmin', {
    path: '/Signadmin',
    pageTitle: 'Signin Amin',
    editing: false,
    hasError: false,
    errorMessage: null,
    validationErrors: []
  });
};

exports.getEditAdmin = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const userId = req.params.adminId;
  User.findById(userId)
    .then(admin => {
      if (!admin) {
        return res.redirect('/');
      }
      res.render('admin/SignAdmin', {
        pageTitle: 'Edit Admin',
        path: '/admin/SignAdmin',
        editing: editMode,
        admin: admin,
        hasError: false,
        errorMessage: null,
        validationErrors: []
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};


exports.manageUsers = async (req, res, next) => {
  try {
    const userType = req.query.userType || 'all';
    const searchQuery = req.query.search || '';

    // console.log('User Type:', userType);
    // console.log('Search Query:', searchQuery);

    let query = {};

    if (userType !== 'all') {
      query.user_type = userType;
    }

    if (searchQuery) {
      query.$or = [
        { name: { $regex: searchQuery, $options: 'i' } },
        { email: { $regex: searchQuery, $options: 'i' } }
      ];
    }
    // console.log('Query:', query);

    const users = await User.find(query).limit(10);

    res.render('admin/manageUsers', {
      path: '/manageUsers',
      pageTitle: 'إدارة المستخدمين',
      users: users,
      currentUserType: userType,
      searchQuery: searchQuery
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  const userId = req.params.userId;
  try {
    await User.findByIdAndDelete(userId);
    res.redirect('/admin/Settings');
  } catch (error) {
    console.error('Error deleting user:', error);
    next(error);
  }
};

// **************************************post request***************************************************88

exports.postSignAdmin = (req, res, next) => {
  const {name,email,password,division}=req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('admin/SignAdmin', {
      pageTitle: 'Sign Admin',
      path: '/admin/edit-product',
      editing: false,
      hasError: true,
      admin: {
        name: name,
        email: email,
        password: password,
        division: division
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array()
    });
  }

  bcrypt
  .hash(password, 12)
  .then(hashedPassword => {
    const user = new User({
      email: email,
      name:name,
      password: hashedPassword,
      division:division,
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
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });  
};

exports.postEditAdmin = (req, res, next) => {
  const {name,email,password:newPassword,division,adminId}=req.body;

  let admin = null;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render('admin/SignAdmin', {
      pageTitle: 'Sign Admin',
      path: '/admin/SignAdmin',
      editing: true,
      hasError: true,
      admin: {
        name: name,
        email: email,
        password: newPassword,
        division: division,
        _id:adminId
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array()
    });
  }

  User.findById(adminId)
    .then(user => {
      admin = user;
      admin.name=name;
      admin.email=email;
      admin.division=division;
      return bcrypt.hash(newPassword, 12);
      })
      .then(hashedPassword => {
        admin.password = hashedPassword;
        return admin.save();
      })
      .then(result => {
        res.redirect('/');
        return transporter.sendMail({
          to: email,
          from: process.env.NODEJS_GMAIL_APP_USER, // sender address,
          subject: 'your acccount have been edit',
          html: `
            <p>info changed successfuly</p>
          `
        });
      })
      .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
};

exports.postSignEmployee = (req, res, next) => {
  const {name,email,password,division}=req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('admin/SignEmployee', {
      pageTitle: 'Sign Employee',
      path: '/admin/SignEmployee',
      editing: false,
      hasError: true,
      employee: {
        name: name,
        email: email,
        password: password,
        division: division
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array()
    });
  }

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
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });  
};

exports.postEditEmployee = (req, res, next) => {
  const {name,email,password:newPassword,division,employeeId}=req.body;
  let employee = null;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render('admin/SignEmployee', {
      pageTitle: 'Edit Employee',
      path: '/admin/SignEmployee',
      editing: true,
      hasError: true,
      employee: {
        name: name,
        email: email,
        password: newPassword,
        division: division,
        _id:employeeId
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array()
    });
  }

  User.findById(employeeId)
    .then(user => {
      employee = user;
      employee.name=name;
      employee.email=email;
      employee.division=division;
      return bcrypt.hash(newPassword, 12);
      })
      .then(hashedPassword => {
        employee.password = hashedPassword;
        return employee.save();
      })
      .then(result => {
        res.redirect('/');
        return transporter.sendMail({
          to: email,
          from: process.env.NODEJS_GMAIL_APP_USER, // sender address,
          subject: 'your acccount have been edit',
          html: `
            <p>info changed successfuly</p>
          `
        });
      })
      .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
};

exports.postSignStudent = (req, res, next) => {
  const {name,email,password,nationalNumber,militaryNumber,birthdate,phoneNumber, delayedTo,division,address} = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('admin/SignStudent', {
      pageTitle: 'Sign Student',
      path: '/admin/SignStudent',
      editing: false,
      hasError: true,
      student: {
        name: name,
        email: email,
        password: password,
        nationalNumber:nationalNumber,
        militaryNumber:militaryNumber,
        birthdate:birthdate,
        phoneNumber:phoneNumber,
        delayedTo:delayedTo,
        division: division,
        address:address
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array()
    });
  }

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
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });  
};

exports.postEditStudent = (req, res, next) => {
  const {name,email,password: newPassword,nationalNumber,militaryNumber,birthdate,phoneNumber, delayedTo,division,address,studentId} = req.body;
  let student = null;  

  const errors = validationResult(req);

  User.findById(studentId)
    .then(user => {
      student = user;
      student.name = name;
      student.email = email;
      student.nationalNumber = nationalNumber;
      student.militaryNumber = militaryNumber;
      student.birthdate = birthdate;
      student.phoneNumber = phoneNumber;
      student.delayedTo= delayedTo;
      student.division = division;
      student.address = address;
      return bcrypt.hash(newPassword, 12);
      })
      .then(hashedPassword => {
        student.password = hashedPassword;
        return student.save();
      })
      .then(result => {
        res.redirect('/');
        return transporter.sendMail({
          to: email,
          from: process.env.NODEJS_GMAIL_APP_USER, // sender address,
          subject: 'your acccount have been edit',
          html: `
            <p>info changed successfuly</p>
          `
        });
      })
      .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
}