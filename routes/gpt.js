var express = require('express');
var router = express.Router();

var db = require('../db/sql.js');

// 封装数据库查询函数
function executeQuery(sql, params, res) {
  db.query(sql, params, (error, result) => {
    if (error) {
      console.error('Error executing SQL query:', error);
      res.status(500).send('Internal Server Error');
    } else {
      console.log(result);
      res.send({
        code: 0,
        data: true
      });
    }
  });
}


router.get('/merchants/page', function(req, res) {
  const { name } = req.query
  const sql = `
  SELECT
    * 
  FROM
    Merchants 
  WHERE
    MerchantName LIKE ?
  `
  executeQuery(sql, [`%${name}%`], res);
});

router.post('/merchants', function(req, res) {
  const { name } = req.body;
  console.log(name);
  const sql = `
    INSERT INTO Merchants (MerchantName)
    VALUES(?);
  `;
  executeQuery(sql, [name], res);
});

router.delete('/merchants', function(req, res) {
  console.log(req.body);
  const ids = req.body
  const sql = `
    DELETE 
    FROM
      Merchants 
    WHERE
      MerchantID IN (?)
  `
  executeQuery(sql, [ids], res);
});

router.delete('/merchants/:id', function(req, res) {
  const { id } = req.params
  const sql = `
    DELETE 
    FROM
      Merchants 
    WHERE
      MerchantID = ?
  `
  executeQuery(sql, [id], res);
});

router.put('/merchants', function(req, res) {
  const { name, id } = req.body
  console.log(name, id);
  const sql = `
    UPDATE Merchants 
    SET MerchantName = ?
    WHERE
      MerchantID = ?
  `
  executeQuery(sql, [name, id], res);
});

module.exports = router;
