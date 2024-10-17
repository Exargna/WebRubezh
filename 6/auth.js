// routes/auth.js
const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Страница регистрации
router.get('/register', (req, res) => {
  res.send('<form method="POST"><input name="name" placeholder="Name"/><input name="email" placeholder="Email"/><input type="password" name="password" placeholder="Password"/><button type="submit">Register</button></form>');
});

// Регистрация пользователя
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.send('Email already exists.');
  }

  const user = new User({ name, email, password });
  await user.save();

  req.session.userId = user._id;
  res.redirect('/articles');
});

module.exports = router;
// routes/auth.js
// Добавляем к существующему коду

// Страница входа
router.get('/login', (req, res) => {
    res.send('<form method="POST"><input name="email" placeholder="Email"/><input type="password" name="password" placeholder="Password"/><button type="submit">Login</button></form>');
  });
  
  // Вход пользователя
  router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
  
    if (!user || !(await user.comparePassword(password))) {
      return res.send('Invalid email or password');
    }
  
    req.session.userId = user._id;
    res.redirect('/articles');
  });
  