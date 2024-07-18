const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({path:"config.env"});
const stripe = require('stripe')(process.env.STRIPE_TEST_KEY);
const PDFDocument = require('pdfkit');
const Student = require('../models/student');
const DefermentRequest = require('../models/defermentRequest'); // Adjust the path as needed


exports.addRequest = async (req, res, next) => {
  try {
    const studentId = req.user._id;

    //const existingRequest = await DefermentRequest.findOne({ userId: studentId });
    const currentYear = new Date().getFullYear();
    const startOfYear = new Date(currentYear, 0, 1); // بداية السنة الحالية
    const endOfYear = new Date(currentYear + 1, 0, 1); // بداية السنة القادمة
    
    const request = await DefermentRequest.findOne({
      userId: studentId,
      status: { $ne: 'مرفوض - للتعديل' },
      createdAt: { $gte: startOfYear, $lt: endOfYear }
    }).populate('userId', 'name email');
    console.log(request)

    if (request) {
        res.render('deferment-requests/user-request', { 
            mes: "لديك طلب تأجيل قيد المعالجة أو تم إنجازه.",
            request,
            pageTitle: 'طلباتي',
            path: 'deferment-requests/user-request'
        });
        return;
      }
    res.render('platform/addRequest', {
      path: '/addRequest',
      pageTitle: 'addRequest'
    });
  } catch (error) {
    console.error('Error checking for existing deferment request:', error);
    res.status(500).render('404', {
      pageTitle: 'Error',
      path: '/error',
      error: 'An error occurred while processing your request.'
    });
  }
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
  const student = req.user;
  res.render('platform/MyProfile', {
    path: '/MyProfile',
    pageTitle: 'my profile',
    student:student
  });
};

exports.getWallet = (req, res, next) => {
  let balance = req.user.balance;
  res.render('platform/MyWallet', {
    path: '/MyWallet',
    pageTitle: 'my Wallet',
    balance:balance
  });
};

exports.postcheckout = async (req, res, next) => {
  const amount = req.body.amount;
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'إضافة رصيد',
              description: 'الرصيد يستخدم لدفع  الرسوم والطوابع',
            },
            unit_amount: amount * 100, // تحويل الدولار إلى سنت
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: req.protocol + '://' + req.get('host') + '/MyWallet/success/{CHECKOUT_SESSION_ID}',
      cancel_url: req.protocol + '://' + req.get('host') + '/MyWallet/cancel'
    });

    res.redirect(303, session.url); // إعادة توجيه إلى صفحة الدفع في Stripe
  } catch (error) {
    console.error('خطأ في إنشاء جلسة الدفع باستخدام Stripe', error);
    res.status(500).send('خطأ داخلي في الخادم');
  }
};

exports.getCheckoutSuccess = async (req, res, next) => {
  const sessionId = req.params.session_id;
  console.log(sessionId);
  const userId = req.user._id;
  const balance = req.user.balance;
  console.log( stripe.checkout.sessions.retrieve(sessionId))
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === 'paid') {
      const amount = session.amount_total / 100; // تحويل من سنتات إلى دولارات
      console.log(amount);

      Student.findOne({ _id: userId })
      .then(user => {
          user.balance = balance + amount;
          return user.save();
        })
      .then(result => {
          res.redirect('/');
      })
      .catch(err => {
        console.log(err);
        res.status(500).send('Error saving user balance');
      });
    } else {
      res.redirect('/MyWallet');
    }
  } catch (error) {
    console.error('Error retrieving payment session details from Stripe:', error);
    res.status(500).send('Internal Server Error');
  }
};
