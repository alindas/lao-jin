import Axios from 'axios'

const req = Axios.create({
  baseURL: 'http://120.79.2.17:8848/system/'
})
let systemLogin = data => req.post('login', data);

let reqLoginedUserSkip = data => req.post('reqLoginedUserSkip', data);

let reqExamineInfoSkip = data => req.post('reqExamineInfoSkip', data);

let ApprovalMessage = data => req.post('approvalMessage', data);

let sysDataAnalysis = data => {
  if(data.type == 'basic') {
    return Axios.get('/data/basicData.json');
  }
  else return Promise.resolve([]);
}

export {
  systemLogin, // 后台系统登录请求

  reqLoginedUserSkip, // 分段请求注册用户

  reqExamineInfoSkip, // 分段请求审核信息

  ApprovalMessage, // 审批信息

  sysDataAnalysis, // 平台数据可视化
}