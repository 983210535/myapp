var express = require('express');
var router = express.Router();

var db = require('../db/sql.js');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

// 获取总数
const getCount = (tel) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT
        Count(*) AS total
      FROM
        students
      ${tel ? 'WHERE students.tel LIKE ?' : ''}
    `;
    const sqlParams = `%${tel}%`
    db.query(sql, sqlParams, (error, result) => {
      if (error) {
        console.log(error);
      } else {
        console.log(result);
        resolve(result[0]?.total);
      }
    })
  });
}

router.get('/myapp/getStudent', function(req, res) {
  const { tel, currentPage, size } = req.query;
  const sql = `
    SELECT
      * 
    FROM
      students 
    ${tel ? 'WHERE students.tel LIKE ?' : ''}
    LIMIt ${(currentPage - 1) * size}, ${size}
  `;
  const sqlParams = `%${tel}%`;
  console.log(req.query);
  console.log(sql);
  getCount(tel).then(total => {
    console.log(total);
    db.query(sql, sqlParams, (error, result)  => {
      if (error) {
        console.log(error);
      } else {
        res.send({
          code: 0, 
          data: result,
          total
        });
      }
    });
  })
  
});

router.post('/myapp/insertStudent', (req, res) => {
  console.log(req.body);
  const { name, sex, age, tel } = req.body;
  const sql = `
    INSERT INTO students ( name, sex, age, tel )
    VALUES
      (
        ${name},
        ${sex},
        ${age},
        ${tel})
  `;
  const sqlParams = req.body;
  db.query(sql, sqlParams, (error, result) => {
    if (error) {
      console.log(error);
    } else {
      res.send({
        code: 0,
        data: '新增成功'
      });
    }
  })
});

router.post('/myapp/updateStudent', (req, res) => {
  console.log(req.body);
  const { name, sex, age, tel, id } = req.body;
  const sql = `
    UPDATE students 
    SET name = ${name},
    sex = ${sex}, 
    age = ${age}, 
    tel = ${tel} 
    WHERE
      id = ${id}
  `;
  db.query(sql, (error, result) => {
    if (error) {
      console.log(error);
    } else {
      res.send({
        code: 0,
        data: '修改成功'
      });
    }
  })
});

router.post('/myapp/deleteStudent', (req, res) => {
  console.log(req.body);
  const { id } = req.body;
  const sql = `
    DELETE
    FROM
      students
    WHERE
      id = ?
  `;
  db.query(sql, id, (error, result) => {
    if (error) {
      console.log(error);
    } else {
      res.send({
        code: 0,
        data: '删除成功'
      });
    }
  })
})

router.post('/myapp/login', (req, res) => {
  console.log(req.body);
  res.send({
    code: 0
  })
})

router.post('/myapp/getMenu', (req, res) => {
  console.log(req.body);
  res.send({
    code: 0,
    data: []
  })
})

module.exports = router;
