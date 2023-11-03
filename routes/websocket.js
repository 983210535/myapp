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
  // 消息列表获取当前ip是否发过言
  const msgIpIndex = msgList.map(item => item.ip).findIndex(itemIp => itemIp == ip)
  // 用户列表获取当前ip是否存在
  const ipIndex = userList.map(item => item.ip).findIndex(itemIp => itemIp == ip)
  if (msgIpIndex == -1 && ipIndex == -1) {
    userInfo = getUserInfo()
    if (userInfo) {
      userList.push({ ...userInfo, ip });
      res.send({
        code: 0,
        data: userInfo
      });
      const params = {
        type: 'inlineUserList',
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
    return
  }  else if (ipIndex != -1) {
    console.log(222);
    const { nickname, avatarIndex, ip } = userList[ipIndex]
    userInfo = { nickname, avatarIndex, ip }
    console.log(userInfo);
    res.send({
      code: 438,
      data: {
        nickname: userInfo.nickname,
        avatarIndex: userInfo.avatarIndex
      },
      message: '你本机已打开过一个窗口，还想干啥，老弟？'
    })
  } else if (msgIpIndex != -1) {
    console.log(111);
    const { userName, avatarIndex, ip } = msgList[msgIpIndex]
    userInfo = { nickname: userName, avatarIndex, ip }
      userList.push({ ...userInfo });
    const params = {
      type: 'userList',
      data: userList
    };
    wss.map(e => {
      e.send(JSON.stringify(params));
    })
    res.send({
      code: 438,
      data: {
        nickname: userInfo.nickname,
        avatarIndex: userInfo.avatarIndex
      },
      message: '你发过消息了，所以刷新不能切换身份'
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
    type: 'inlineUserList',
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