import Axios from 'axios'

const req = Axios.create({
  baseURL: 'http://localhost:8848/system/',
  timeout: 6000
})
let systemLogin = data => req.post('login', data);

let reqLoginedUserSkip = data => req.post('reqLoginedUserSkip', data);

let reqExamineInfoSkip = data => req.post('reqExamineInfoSkip', data);


export {
  systemLogin, // 后台系统登录请求

  reqLoginedUserSkip, // 分段请求注册用户

  reqExamineInfoSkip, // 分段请求审核信息
}