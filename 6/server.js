// server.js
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('./db');
const User = require('./models/User');
const Article = require('./models/Article');
const bcrypt = require('bcrypt');
const path = require('path');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); // Статические файлы

app.use(session({
  secret: 'yourSecretKey',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: 'mongodb://localhost:27017/lab6' }),
  cookie: { maxAge: 1000 * 60 * 60 * 24 },
}));

// Middleware для проверки аутентификации
function isAuthenticated(req, res, next) {
  if (req.session.userId) {
    return next();
  }
  res.redirect('/login'); // Перенаправление на страницу входа
}

// Регистрация
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'register.html'));
});

app.post('/register', async (req, res) => {
  const { email, password, name } = req.body;
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(400).send('Email уже используется');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ email, password: hashedPassword, name });
  await user.save();
  res.redirect('/login');
});

// Вход
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).send('Неверный email или пароль');
  }

  req.session.userId = user._id;
  res.redirect('/articles');
});

// CRUD для статей
app.get('/articles', isAuthenticated, async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 5;
  const skip = (page - 1) * limit;

  const articles = await Article.find().skip(skip).limit(limit);
  const totalArticles = await Article.countDocuments();

  res.render('articles.html', {
    articles,
    totalPages: Math.ceil(totalArticles / limit),
    currentPage: page,
  });
});

app.post('/articles', isAuthenticated, async (req, res) => {
  const { title, content } = req.body;
  const article = new Article({ title, content, author: req.session.userId });
  await article.save();
  res.redirect('/articles');
});

// Выход
app.post('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

// Запуск сервера
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
