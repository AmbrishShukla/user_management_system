const mysql = require("mysql");

// connection pool, shared by app.js and the controllers
const pool = mysql.createPool({
    // 100 connections per process exhausted the database once several instances ran.
    connectionLimit: Number(process.env.DB_POOL_SIZE) || 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

module.exports = pool;
