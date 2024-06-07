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
              description: 'إضافة إلى الرصيد',
            },
            unit_amount: amount * 100, // تحويل الدولار إلى سنت
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: req.protocol + '://' + req.get('host') + '/MyWallet/success',
      cancel_url: req.protocol + '://' + req.get('host') + '/MyWallet/cancel'
    });

    res.redirect(303, session.url); // إعادة توجيه إلى صفحة الدفع في Stripe
  } catch (error) {
    console.error('خطأ في إنشاء جلسة الدفع باستخدام Stripe:', error);
    res.status(500).send('خطأ داخلي في الخادم');
  }
};
