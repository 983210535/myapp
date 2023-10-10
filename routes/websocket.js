let express = require('express');
let router = express.Router();
let ws = require('express-ws');
ws(router);

function getClientIp(req) {
	let ip =  req.headers['x-forwarded-for'] 　||　req.headers['x-real-ip']
	if(ip){
	    // 拿到ip进行下一步操作
	    // res.send({ip:ip})
      console.log(ip);
	}else{ 
	    //获取不到时
	    // res.send(req.ip().substring(req.ip().lastIndexOf(":") + 1);)		
      console.log(req.ip.substring(req.ip.lastIndexOf(":") + 1));
	}
}

let userList = [];

router.get('/myapp/wsLogin/:nickname', (req, res) => {
  // console.log(req.ip);
  // console.log(req.headers);
  getClientIp(req)
  const nickname = req.params.nickname;
  console.log(nickname);
  userList.push(nickname);
  res.send({
    code: 0
  })
  const params = {
    type: 'userList',
    data: userList
  };
  wss.map(e => {
    e.send(JSON.stringify(params));
  })
})

router.get('/myapp/wsLogout/:nickname', (req, res) => {
  const nickname = req.params.nickname;
  userList = userList.filter(item => item != nickname);
  console.log(userList);
  res.send({
    code: 0
  })
  const params = {
    type: 'userList',
    data: userList
  };
  wss.map(e => {
    e.send(JSON.stringify(params));
  })
})

const wss = [];
const msgList = [];

router.ws('/websocket', (ws, req) => {
  console.log('链接成功');
  wss.push(ws);
  const params = JSON.stringify({
    type: 'msg',
    text: '你链接成功了',
    data: userList
  })
  ws.send(params);
  sendMsg();

  ws.on('message', (msg) => {
    console.log(msg);
    msgList.push(JSON.parse(msg));
    console.log(msgList);
    sendMsg();
  })
  
  ws.on('close', e => {
    console.log(e);
    console.log('close');
  })
})

function sendMsg() {
  const params = {
    type: 'msgList',
    data: msgList
  };
  console.log(params);
  wss.map(e => {
    e.send(JSON.stringify(params));
  })
}

module.exports = router;