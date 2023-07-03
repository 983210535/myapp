const mysql = require('mysql');

let db = mysql.createConnection({
  host: 'localhost',
  port: '3306',
  user: 'root',
  password: 'rino123',
  database: 'school'
});

module.exports = db;