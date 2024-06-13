const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false
}));

const db = new sqlite3.Database('./shop.db');

// Регистрация нового пользователя
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            return res.status(500).json({ error: 'Ошибка при хэшировании пароля.' });
        }
        db.run(`INSERT INTO users (username, password, isAdmin) VALUES (?, ?, 0)`, [username, hash], (err) => {
            if (err) {
                return res.status(500).json({ error: 'Ошибка при регистрации пользователя.' });
            }
            res.redirect('/login'); // Перенаправляем на страницу логина после успешной регистрации
        });
    });
});

// Страница регистрации
app.get('/register', (req, res) => {
    res.send('Форма регистрации');
});

// Логин пользователя
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, user) => {
        if (err) {
            return res.status(500).json({ error: 'Ошибка при логине.' });
        }
        if (!user) {
            return res.status(400).json({ error: 'Неверное имя пользователя или пароль.' });
        }
        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Ошибка при проверке пароля.' });
            }
            if (result) {
                req.session.userId = user.id;
                req.session.isAdmin = user.isAdmin;
                res.redirect('/shop'); // Перенаправляем на главную страницу магазина после успешного входа
            } else {
                res.status(400).json({ error: 'Неверное имя пользователя или пароль.' });
            }
        });
    });
});

// Страница логина
app.get('/login', (req, res) => {
    res.send('Форма логина');
});

// Главная страница магазина (доступна только для авторизованных пользователей)
app.get('/shop', (req, res) => {
    if (req.session.userId) {
        // Здесь отображаем страницу магазина для авторизованных пользователей
        res.send('Главная страница магазина для пользователя');
    } else {
        res.redirect('/login'); // Перенаправляем на страницу логина для неавторизованных пользователей
    }
});

// Страница заказов пользователя (доступна только для авторизованных пользователей)
app.get('/orders', (req, res) => {
    if (req.session.userId) {
        // Здесь отображаем страницу заказов для авторизованных пользователей
        res.send('Страница заказов пользователя');
    } else {
        res.redirect('/login'); // Перенаправляем на страницу логина для неавторизованных пользователей
    }
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
