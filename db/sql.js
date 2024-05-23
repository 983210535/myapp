const mysql = require('mysql2');

let db = mysql.createConnection({
  host: '139.196.174.228',
  port: '3306',
  user: 'root',
  password: '123456',
  database: 'gpt',
  authPlugins: {
    mysql_clear_password: () => () => Buffer.from(password + '\0')
  }
});

module.exports = db;