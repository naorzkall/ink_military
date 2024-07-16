const express = require('express');
const router = express.Router();
const newsController = require('../controllers/news');
const Auth = require('../middleware/is-auth'); //isAuth: in future we will use it to athunticate user

router.get('/add-news',Auth.isAuth,Auth.isAdmin, newsController.getAddNews);

router.post('/add-news',Auth.isAuth,Auth.isAdmin,  newsController.postAddNews);

router.post('/delete-news',Auth.isAuth,Auth.isAdmin, newsController.deleteNews);

module.exports = router;
