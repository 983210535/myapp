var express = require('express');
var router = express.Router();
const { body, validationResult } = require('express-validator');

var db = require('../db/sql.js');

// 封装数据库查询函数
function executeQuery(sql, params, res, singleResult = false) {
  db.query(sql, params, (error, result) => {
    if (error) {
      console.error('Error executing SQL query:', error);
      res.status(500).send('Internal Server Error');
    } else {
      console.log(result);
      if (Array.isArray(result)) {
        if (singleResult) {
          res.send({
            code: 0,
            data: result.length === 1 ? result[0] : {}
          });
        } else {
          res.send({
            code: 0,
            data: result
          });
        }
      } else {
        res.send({
          code: 0,
          data: true
        });
      }
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

router.get('/merchants/:id', function(req, res) {
  const { id } = req.params
  const sql = `
    SELECT
      * 
    FROM
      Merchants 
    WHERE
      MerchantID = ?
  `
  executeQuery(sql, [id], res, true);
});

router.get('/categories/page', function(req, res) {
  const { name, id } = req.query
  const params = [];
  let sql = `SELECT * FROM Categories `

  if (name) {
    sql += `WHERE CategoryName LIKE ? `
    params.push(`%${name}%`)
  }
  if (id) {
    sql += `${name ? 'AND' : 'WHERE'} MerchantID = ? `
    params.push(id)
  }
  console.log(sql);
  executeQuery(sql, params, res);
});

router.post('/categories', [
  body('name').notEmpty().withMessage('商户id不能为空'),
  body('id').notEmpty().withMessage('分类名称不能为空')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ msg: errors.array().map(item => item.msg).join(', ') });
  }

  const { name, id } = req.body;
  const sql = `
    INSERT INTO Categories (CategoryName, MerchantID)
    VALUES(?, ?);
  `;
  executeQuery(sql, [name, id], res);
});

router.delete('/categories', function(req, res) {
  console.log(req.body);
  const ids = req.body
  const sql = `
    DELETE 
    FROM
      Categories 
    WHERE
      CategoryID IN (?)
  `
  executeQuery(sql, [ids], res);
});

router.delete('/categories/:id', function(req, res) {
  const { id } = req.params
  const sql = `
    DELETE 
    FROM
      Categories 
    WHERE
      CategoryID = ?
  `
  executeQuery(sql, [id], res);
});

router.put('/categories', function(req, res) {
  const { name, id } = req.body
  console.log(name, id);
  const sql = `
    UPDATE Categories 
    SET CategoryName = ?
    WHERE
      CategoryID = ?
  `
  executeQuery(sql, [name, id], res);
});

router.get('/categories/:id', function(req, res) {
  const { id } = req.params
  const sql = `
    SELECT
      * 
    FROM
      Categories 
    WHERE
      CategoryID = ?
  `
  executeQuery(sql, [id], res, true);
});

module.exports = router;
