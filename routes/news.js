const express = require('express');
const router = express.Router();
const newsController = require('../controllers/news');

// Route to get all news
router.get('/', newsController.getAllNews);

// Route to get the form to add news
router.get('/add-news', newsController.getAddNews);

// Route to handle POST request to add news with image
router.post('/add-news',  newsController.postAddNews);



module.exports = router;
