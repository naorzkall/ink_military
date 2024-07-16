
const News = require('../models/News');
const path = require('path');
const fs = require('fs');
// Get all news
exports.getAllNews = async (req, res) => {
    const userType= req.user.user_type;
    try {
        const news = await News.find();
        res.render('news/all-news', { 
          path: '/all-news',
          pageTitle: 'Signin Student',
          news,
          userType:userType
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

  exports.deleteNews = async (req, res, next) => {
    // console.log("gg")
    const newsId = req.body.newsId;
    try {
      const result = await News.findByIdAndDelete(newsId);
  
      if (!result) {
        return res.status(404).json({ message: 'News item not found' });
      }
      res.redirect('/');
    } catch (error) {
      console.error('Error deleting news item:', error);
      res.status(500).json({ message: 'An error occurred while deleting the news item' });
    }
  };