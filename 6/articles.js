// routes/articles.js
const express = require('express');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Показать все статьи
router.get('/', (req, res) => {
  res.send('Вот здесь все статьи...');
});

// Создание статьи (только для авторизованных пользователей)
router.get('/create', authMiddleware, (req, res) => {
  res.send('<form method="POST"><input name="title" placeholder="Title"/><textarea name="content" placeholder="Content"></textarea><button type="submit">Create</button></form>');
});

router.post('/create', authMiddleware, (req, res) => {
  // Логика создания статьи
  res.redirect('/articles');
});

module.exports = router;
