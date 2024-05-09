const mysql = require('mysql2');

let db = mysql.createConnection({
  host: 'localhost',
  port: '3306',
  user: 'root',
  password: '12345678',
  database: 'gpt',
  authPlugins: {
    mysql_clear_password: () => () => Buffer.from(password + '\0')
  }
});

module.exports = db;