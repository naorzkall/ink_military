const mongoose = require('mongoose');
const fileHelper = require('../util/file');
const { validationResult } = require('express-validator');
const crypto = require('crypto');
const dotenv = require('dotenv');
dotenv.config({path:"config.env"});
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer'); 
const generateEmailTemplate = require('../controllers/email');


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

exports.getSignStudent = async(req, res, next) => {
  const settings = await Settings.findOne();
  const divisions = settings ? settings.divisions : [];
  const userId = req.params.adminId;
    res.render('admin/SignStudent', {
      path: '/SignStudent',
      pageTitle: 'Signin Student',
      editing: false,
      hasError: false,
      errorMessage: null,
      validationErrors: [],
      divisions:divisions
    });
};

exports.getEditStudent = async(req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }

  const settings = await Settings.findOne();
  const divisions = settings ? settings.divisions : [];
  const userId = req.params.studentId;
  User.findById(userId)
    .then(student => {
      if (!student) {
        return res.redirect('/');
      }
      res.render('admin/SignStudent', {
        pageTitle: 'Edit Student',
        path: '/admin/SignStudent',
        editing: editMode,
        student: student,
        hasError: false,
        errorMessage: null,
        validationErrors: [],
        divisions:divisions
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getSignEmployee= async(req, res, next) => {
  const settings = await Settings.findOne();
  const divisions = settings ? settings.divisions : [];
  res.render('admin/SignEmployee', {
    path: '/SignEmployee',
    pageTitle: 'Signin Employee',
    editing: false,
    hasError: false,
    errorMessage: null,
    validationErrors: [],
    divisions:divisions
  });
};

exports.getEditEmployee = async(req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }

  const settings = await Settings.findOne();
  const divisions = settings ? settings.divisions : [];
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
        validationErrors: [],
        divisions:divisions
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getSignAdmin= async (req, res, next) => {
  const settings = await Settings.findOne();
  const divisions = settings ? settings.divisions : [];
  res.render('admin/SignAdmin', {
    path: '/Signadmin',
    pageTitle: 'Signin Amin',
    editing: false,
    hasError: false,
    errorMessage: null,
    validationErrors: [],
    divisions:divisions
  });
};

exports.getEditAdmin = async(req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const settings = await Settings.findOne();
  const divisions = settings ? settings.divisions : [];
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
        validationErrors: [],
        divisions:divisions
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
    res.redirect('/admin/manageUsers');
  } catch (error) {
    console.error('Error deleting user:', error);
    next(error);
  }
};

// **************************************post request***************************************************88

exports.postSignAdmin = async (req, res, next) => {
  const {name,email,password,division}=req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const settings = await Settings.findOne();
    const divisions = settings ? settings.divisions : [];
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
      validationErrors: errors.array(),
      divisions:divisions
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
    const emailHtml = generateEmailTemplate('Signup succeeded!', '<p>تم إنشاء حسابك بنجاح في منصة التأجيل العكسري</p>');
    return transporter.sendMail({
      from: process.env.NODEJS_GMAIL_APP_USER,
      to: email,
      subject: 'تم التسجيل بنجاح - ink military',
      html: emailHtml
    });
  })
  .catch(err => {
    console.log(err);
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });  
};

exports.postEditAdmin = async(req, res, next) => {
  const {name,email,password:newPassword,division,adminId}=req.body;

  let admin = null;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const settings = await Settings.findOne();
    const divisions = settings ? settings.divisions : [];
    return res.status(422).render('admin/SignAdmin', {
      pageTitle: 'Edit Admin',
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
      validationErrors: errors.array(),
      divisions:divisions
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
        const emailHtml = generateEmailTemplate('update info succeeded!', 'تم تعدبل تعدبل المعلومات في منصة التأجيل العكسري');
        return transporter.sendMail({
          from: process.env.NODEJS_GMAIL_APP_USER,
          to: email,
          subject: 'تم تعدبل المعلومات بنجاح - ink military',
          html: emailHtml
        });
      })
      .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
};

exports.postSignEmployee = async(req, res, next) => {
  const {name,email,password,division}=req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const settings = await Settings.findOne();
    const divisions = settings ? settings.divisions : [];
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
      validationErrors: errors.array(),
      divisions:divisions
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
    const emailHtml = generateEmailTemplate('Signup succeeded!', 'تم إنشاء حسابك بنجاح في منصة التأجيل العكسري');
    return transporter.sendMail({
      from: process.env.NODEJS_GMAIL_APP_USER,
      to: email,
      subject: 'تم التسجيل بنجاح - ink military',
      html: emailHtml
    });
  })
  .catch(err => {
    console.log(err);
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });  
};

exports.postEditEmployee = async (req, res, next) => {
  const {name,email,password:newPassword,division,employeeId}=req.body;
  let employee = null;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const settings = await Settings.findOne();
    const divisions = settings ? settings.divisions : [];
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
      validationErrors: errors.array(),
      divisions:divisions
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
        const emailHtml = generateEmailTemplate('update info succeeded!', 'تم تعدبل تعدبل المعلومات في منصة التأجيل العكسري');
        return transporter.sendMail({
          from: process.env.NODEJS_GMAIL_APP_USER,
          to: email,
          subject: 'تم تعدبل المعلومات بنجاح - ink military',
          html: emailHtml
        });
      })
      .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
};

exports.postSignStudent = async(req, res, next) => {
  const {name,email,password,nationalNumber,militaryNumber,birthdate,phoneNumber, delayedTo,division,address} = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const settings = await Settings.findOne();
    const divisions = settings ? settings.divisions : [];
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
      validationErrors: errors.array(),
      divisions:divisions
    });
  }

  bcrypt
  .hash(password, 12)
  .then(hashedPassword => {
    const student = new Student({
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
    return student.save();
  })
  .then(result => {
    res.redirect('/admin/SignStudent');
    const emailHtml = generateEmailTemplate('Signup succeeded!', 'تم إنشاء حسابك بنجاح في منصة التأجيل العكسري');
    return transporter.sendMail({
      from: process.env.NODEJS_GMAIL_APP_USER,
      to: email,
      subject: 'تم التسجيل بنجاح - ink military',
      html: emailHtml
    });
  })
  .catch(err => {
    console.log(err);
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });  
};

exports.postEditStudent = async(req, res, next) => {
  const {name,email,password: newPassword,nationalNumber,militaryNumber,birthdate,phoneNumber, delayedTo,division,address,studentId} = req.body;
  let student = null;  

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const settings = await Settings.findOne();
    const divisions = settings ? settings.divisions : [];
    return res.status(422).render('admin/SignStudent', {
      pageTitle: 'Edit Student',
      path: '/admin/SignAdmin',
      editing: true,
      hasError: true,
      student: {
        name: name,
        email: email,
        password: newPassword,
        nationalNumber:nationalNumber,
        militaryNumber:militaryNumber,
        birthdate:birthdate,
        phoneNumber:phoneNumber,
        delayedTo:delayedTo,
        division: division,
        address:address,
        _id:studentId
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
      divisions:divisions
    });
  }

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
        const emailHtml = generateEmailTemplate('update info succeeded!', 'تم تعدبل تعدبل المعلومات في منصة التأجيل العكسري');
        return transporter.sendMail({
          from: process.env.NODEJS_GMAIL_APP_USER,
          to: email,
          subject: 'تم تعدبل المعلومات بنجاح - ink military',
          html: emailHtml
        });
      })
      .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
}
//***************************** division managment ****************************
exports.getDivisions = async (req, res) => {
  try {
    const settings = await Settings.findOne();
    const divisions = settings ? settings.divisions : [];
    res.render('admin/manageDivisions', {
      divisions: divisions,
      pageTitle: 'إدارة الأقسام',
      path: '/admin/manageDivisions'
    });
  } catch (error) {
    console.error('Error fetching divisions:', error);
    res.status(500).send('حدث خطأ أثناء جلب الأقسام');
  }
};

exports.addDivision = async (req, res) => {
  const { divisionName } = req.body;
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings({ divisions: [] });
    }
    if (!settings.divisions.includes(divisionName)) {
      settings.divisions.push(divisionName);
      await settings.save();
    }
    res.redirect('/admin/manageDivisions');
  } catch (error) {
    console.error('Error adding division:', error);
    res.status(500).send('حدث خطأ أثناء إضافة القسم');
  }
};

exports.deleteDivision = async (req, res) => {
  const { divisionName } = req.body;
  try {
    const settings = await Settings.findOne();
    if (settings) {
      settings.divisions = settings.divisions.filter(dept => dept !== divisionName);
      await settings.save();
    }
    res.redirect('/admin/manageDivisions');
  } catch (error) {
    console.error('Error deleting division:', error);
    res.status(500).send('حدث خطأ أثناء حذف القسم');
  }
};