const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./shop.db');

db.serialize(() => {
    // Таблица для заказов
    db.run(`CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER,
        name TEXT,
        phone TEXT,
        address TEXT,
        cart TEXT
    )`, (err) => {
        if (err) {
            console.error('Ошибка при создании таблицы orders: ' + err.message);
        } else {
            console.log('Таблица orders создана.');
        }
    });

    // Таблица для пользователей
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        isAdmin INTEGER
    )`, (err) => {
        if (err) {
            console.error('Ошибка при создании таблицы users: ' + err.message);
        } else {
            console.log('Таблица users создана.');
        }
    });

    // Таблица для товаров
    db.run(`CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category TEXT,
        name TEXT,
        price INTEGER,
        image TEXT
    )`, (err) => {
        if (err) {
            console.error('Ошибка при создании таблицы products: ' + err.message);
        } else {
            console.log('Таблица products создана.');
        }
    });
});

db.close((err) => {
    if (err) {
        console.error('Ошибка при закрытии базы данных: ' + err.message);
    } else {
        console.log('База данных закрыта.');
    }
});
