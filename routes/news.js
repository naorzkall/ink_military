const express = require('express');
const router = express.Router();
const newsController = require('../controllers/news');
const Auth = require('../middleware/is-auth'); //isAuth: in future we will use it to athunticate user

// Route to get the form to add news
router.get('/add-news',Auth.isAuth,Auth.isAdmin, newsController.getAddNews);

// Route to handle POST request to add news with image
router.post('/add-news',Auth.isAuth,Auth.isAdmin,  newsController.postAddNews);



module.exports = router;
