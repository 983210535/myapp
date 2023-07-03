let express = require('express');
let router = express.Router();
let ws = require('express-ws');
ws(router);

const wss = [];
const msgList = [];

router.ws('/websocket', (ws, req) => {
  console.log('链接成功');
  wss.push(ws);
  ws.send('你链接成功了');
  const params = JSON.stringify(msgList);
  ws.send(params);

  ws.on('message', (msg) => {
    console.log(msg);
    msgList.push(JSON.parse(msg));
    console.log(msgList);
    const params = JSON.stringify(msgList);
    wss.map(e => {
      e.send(params);
    })
  })
  
  ws.on('close', e => {
    console.log('close');
  })
})

module.exports = router;