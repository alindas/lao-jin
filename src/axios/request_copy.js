let confirmLoginedMes = data => req.post('users/confirmLoginedMes', data);

let loginByPhone = data => req.post('loginByPhone', data);

let loginByAccount = data => req.post('loginByAccount', data);

let loginOut = data => req.post('users/loginOut', data);

let getIndexMain = data => req.get('getIndexRecommend', { params: data });

let getTagMain = data => req.get('getTagMain', { params: data });

let getChatMessage = data => req.post('users/getChatMessage', data);

let getChatMessageContent = data => req.post('users/getChatMessageContent', data);

let sendChatMessage = data => req.post('users/updateChat', data);

let userSearch = () => req.get('data/users.json');

let getCenterMessage = data => req.post('users/getCenterMessage', data);

let deleteCenterMessage = data => req.post('users/deleteCenterMessage', data);

let updateSetting = data => req.post('users/updateSetting', data);

let updateDrafts = data => req.post('users/updateDrafts', data);

let updateRelease = data => req.post('users/updateRelease', data);

let showPartTimeWork = data => req.get('showPartTimeWork', { params: data });

let updatePartTimeWork = data => req.post('users/updatePartTimeWork', data);

let updateComment = data => req.post('users/updateComment', data);

let articleApply = data => req.post('users/articleApply', data);

let showUserArticleMess = data => req.get('showUserArticleMess', { params: data });

let followAuthor = data => req.post('users/followAuthor', data);

let getFindIndex = () => req.post('getFindIndex');

let followTag = data => req.post('users/followTag', data);

let getSearchHist = data => req.post('users/getSearchHist', data);

let updateSearchHist = data => req.post('users/updateSearchHist', data);

let reportMess = data => req.post('/users/reportMess', data);

let getOthers = () => req.get('data/activities&likes.json');

let userCenterMess = data => req.post('userCenterMess', data);

let alipayRequest = data => req.post('alipay/page', data);

let getLightDemand = data => req.post('getLightDemand', data);

let confirmLightDemand = data => req.post('confirmLightDemand', data);

let getLightDemandSingle = data => req.post('getLightDemandSingle', data);

let updataLightDemand = data => req.post('updataLightDemand', data);

let releaseLightDemand = data => req.post('releaseLightDemand', data);

let updateUserAccount = data => req.post('users/updateUserAccount', data);

let createNewChat = data => req.post('createNewChat', data);

let getSysMessage = data => req.post('users/getSysMessage', data);

export {
  confirmLoginedMes, // 请求登录用户的基础信息

  loginByPhone, // 手机登录请求

  loginByAccount, // 账密登录请求

  loginOut, // 退出登录

  getIndexMain, // 获取热门内容

  getTagMain, // 获取发现页具体标签内容

  getChatMessage, // 获取用户私信信息通知

  getChatMessageContent, // 获取私信内容

  sendChatMessage, // 发送私信

  userSearch, // 用户检索

  getCenterMessage, // 获取用户个人主页数据

  deleteCenterMessage, // 删除用户个人主页数据

  updateSetting, // 更新用户设置

  updateDrafts, // 更新用户个人主页数据-草稿

  updateRelease, // 更新用户个人主页数据-发布内容

  showPartTimeWork, // 展示兼职内容

  updatePartTimeWork, // 更新用户兼职发布信息数据

  updateComment, // 更新评论内容

  articleApply, // 回复评论

  showUserArticleMess, // 兼职信息页展示作者基本信息

  followAuthor, // 关注作者

  getFindIndex, // 请求发现主页数据

  followTag, // 关注标签

  getSearchHist, // 获取查询历史

  updateSearchHist, // 更新用户查询历史

  reportMess, // 举报垃圾信息

  userCenterMess, // 获取用户主页数据

  alipayRequest, // 相应阿里支付页面

  updateUserAccount, // 更新用户账号

  getLightDemand, // 获取茶水间轻需求内容

  confirmLightDemand, // 确认轻需求是否还存在

  getLightDemandSingle, // 轻需求订单详情页

  releaseLightDemand, // 发布轻需求订单

  updataLightDemand, // 更新轻需求订单

  createNewChat, // 创建在线会话

  getSysMessage, // 获取用户系统通知

  getOthers, // 其他数据集


}