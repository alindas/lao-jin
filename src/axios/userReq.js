import Axios from 'axios'

const req = Axios.create({
  baseURL: 'http://localhost:8848/users/',
  timeout: 6000,
})

let confirmLoginedMes = data => req.post('confirmLoginedMes', data);

let loginOut = data => req.post('loginOut', data);

let getChatMessage = data => req.post('getChatMessage', data);

let getChatMessageContent = data => req.post('getChatMessageContent', data);

let sendChatMessage = data => req.post('updateChat', data);

let getCenterMessage = data => req.post('getCenterMessage', data);

let deleteCenterMessage = data => req.post('deleteCenterMessage', data);

let updateSetting = data => req.post('updateSetting', data);

let updateDrafts = data => req.post('updateDrafts', data);

let updateRelease = data => req.post('updateRelease', data);

let updatePartTimeWork = data => req.post('updatePartTimeWork', data);

let updateComment = data => req.post('updateComment', data);

let articleApply = data => req.post('articleApply', data);

let followAuthor = data => req.post('followAuthor', data);

let followTag = data => req.post('followTag', data);

let getSearchHist = data => req.post('getSearchHist', data);

let updateSearchHist = data => req.post('updateSearchHist', data);

let reportMess = data => req.post('/reportMess', data);

let updateUserAccount = data => req.post('updateUserAccount', data);

let getSysMessage = data => req.post('getSysMessage', data);

export {
  confirmLoginedMes, // 请求登录用户的基础信息

  loginOut, // 退出登录

  getChatMessage, // 获取用户私信信息通知

  getChatMessageContent, // 获取私信内容

  sendChatMessage, // 发送私信

  getCenterMessage, // 获取用户个人主页数据

  deleteCenterMessage, // 删除用户个人主页数据

  updateSetting, // 更新用户设置

  updateDrafts, // 更新用户个人主页数据-草稿

  updateRelease, // 更新用户个人主页数据-发布内容

  updatePartTimeWork, // 更新用户兼职发布信息数据

  updateComment, // 更新评论内容

  articleApply, // 回复评论

  followAuthor, // 关注作者

  followTag, // 关注标签

  getSearchHist, // 获取查询历史

  updateSearchHist, // 更新用户查询历史

  reportMess, // 举报垃圾信息

  updateUserAccount, // 更新用户账号

  getSysMessage, // 获取用户系统通知


}