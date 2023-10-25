let express = require('express');
let router = express.Router();
let ws = require('express-ws');
ws(router);

let userList = [];

const getUserInfo = () => {
  // 昵称池
  const nickname_pool = ['张一', '张二', '张三', '张四', '张五', '张六', '张七', '张八', '张九', '张麻子'];
  const _userList = userList.map(item => item.nickname);
  const new_arr = nickname_pool.filter(item => !_userList.includes(item));
  if (new_arr.length == 0) {
    return false;
  }
  // 过滤后昵称池的随机下标
  const random_num = Math.floor(Math.random() * new_arr.length);
  // 生成随机昵称 但不能出现重复的
  // return new_arr[random_num];
  return {
    avatarIndex: random_num,
    nickname: new_arr[random_num]
  };
}

router.post('/myapp/wsLogin', (req, res) => {
  console.log(req.clientIp);
  console.log(req.body, 'qqq');
  const { ip } = req.body;

  let userInfo;
  const msgIpIndex = msgList.map(item => item.ip).findIndex(itemIp => itemIp == ip)
  // 消息列表获取当前ip是否发过言
  if (msgIpIndex != -1) {
    const { userName, avatarIndex, ip } = msgList[msgIpIndex]
    userInfo = { nickname: userName, avatarIndex, ip }
  } else {
    const ipIndex = userList.map(item => item.ip).findIndex(itemIp => itemIp == ip)
    if (ipIndex == -1) {
      userInfo = getUserInfo()
    } else {
      res.send({
        code: 438,
        data: {
          nickname: userList[ipIndex].nickname
        },
        message: '你特么已经登陆了一次，还想干啥，老弟？'
      })
    }
  }

  if (userInfo) {
    userList.push({ ...userInfo, ip });
    res.send({
      code: 0,
      data: userInfo
    })
    const params = {
      type: 'userList',
      data: userList
    };
    wss.map(e => {
      e.send(JSON.stringify(params));
    })
  } else {
    res.send({
      code: 439,
      message: '聊天室人满了'
    })
  }
})

router.post('/myapp/wsLogout', (req, res) => {
  const { ip } = req.body;
  userList = userList.filter(item => item.ip != ip);
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