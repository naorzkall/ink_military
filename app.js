const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: "config.env" });
const dbUrl = process.env.DB_URL;

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const flash = require('connect-flash');
const multer = require('multer');

const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();
const store = new MongoDBStore({
  uri: dbUrl,
  collection: 'sessions'
});

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// Multer middleware setup
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).fields([
  { name: 'identity', maxCount: 1 },
  { name: 'certificate', maxCount: 1 },
  {name : 'image', maxCount: 1}
]));


app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(session({
  secret: 'my secret',
  resave: false,
  saveUninitialized: false,
  store: store
}));

app.use(flash());

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
<<<<<<< HEAD
  res.locals.userType = req.session.user?.user_type || null;
  next();
});

app.use((req, res, next) => {
=======
>>>>>>> c6a2fcf (add-news)
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch(err => {
      next(err); // Pass errors to the error handler
    });
});

const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const platformRoutes = require('./routes/platform');
const reservationRoutes = require('./routes/reservationRoutes');
const defermentRequestRoutes = require('./routes/defermentRequestRoute');
const newsRoutes = require('./routes/news');

app.use('/admin', adminRoutes);
app.use(platformRoutes);
app.use(authRoutes);
app.use('/reservations', reservationRoutes);
app.use('/deferment-requests', defermentRequestRoutes);
app.use('/news', newsRoutes);

app.get('/500', errorController.get500);
app.use(errorController.get404);

mongoose.connect(dbUrl)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(3000, () => {
      console.log("Server started on port 3000");
    });
  })
  .catch(err => {
    console.error("MongoDB connection error:", err);
  });
