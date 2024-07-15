
const News = require('../models/News');
const path = require('path');
const fs = require('fs');
// Get all news
exports.getAllNews = async (req, res) => {
    try {
        const news = await News.find();
        res.render('news/all-news', { 
          path: '/all-news',
          pageTitle: 'Signin Student',
          news,
         });
    } catch (error) {
        console.error(error);
        res.status(500).send('خطأ في السيرفر');
    }
};

// Get the form to add news
exports.getAddNews = (req, res) => {
    console.log("gg");
    res.render('news/add-news', { pageTitle: 'إضافة خبر', path: '/news/add-news' });
};


// Handle POST request to add news
exports.postAddNews = (req, res) => {
    try {
        console.log(req.files)
        const { title, body } = req.body;
        const {division} = req.user;
        const imageFile = req.files['image'] ? req.files['image'][0] : null;
  
      
        // Save news item to database or perform other operations
        const news = new News({
          title,
          body,
          division,
          imageUrl: imageFile.path // Save file name or path in database
        });
  
        news.save()
          .then(() => {
            res.redirect('/');
          })
          .catch(err => {
            console.error(err);
            res.status(500).send('Failed to save news item');
          });
      
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  };