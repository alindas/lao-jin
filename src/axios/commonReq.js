import Axios from 'axios';

const req = Axios.create({
  baseURL: 'http://120.79.2.17:8848/'
})

let loginByPhone = data => req.post('loginByPhone', data);

let loginByAccount = data => req.post('loginByAccount', data);

let getIndexMain = data => req.get('getIndexRecommend', { params: data });

let getTagMain = data => req.get('getTagMain', { params: data });

let userSearch = () => req.get('data/users.json');

let showPartTimeWork = data => req.get('showPartTimeWork', { params: data });

let showUserArticleMess = data => req.get('showUserArticleMess', { params: data });

let getFindIndex = () => req.post('getFindIndex');

let getOthers = () => req.get('data/activities&likes.json');

let userCenterMess = data => req.post('userCenterMess', data);

let alipayRequest = data => req.post('alipay/page', data);

let getLightDemand = data => req.post('getLightDemand', data);

let confirmLightDemand = data => req.post('confirmLightDemand', data);

let getLightDemandSingle = data => req.post('getLightDemandSingle', data);

let updataLightDemand = data => req.post('updataLightDemand', data);

let releaseLightDemand = data => req.post('releaseLightDemand', data);

let createNewChat = data => req.post('createNewChat', data);

export {
  loginByPhone, // 手机登录请求

  loginByAccount, // 账密登录请求

  getIndexMain, // 获取热门内容

  getTagMain, // 获取发现页具体标签内容

  userSearch, // 用户检索

  showPartTimeWork, // 展示兼职内容

  showUserArticleMess, // 兼职信息页展示作者基本信息

  getFindIndex, // 请求发现主页数据

  userCenterMess, // 获取用户主页数据

  alipayRequest, // 相应阿里支付页面

  getLightDemand, // 获取茶水间轻需求内容

  confirmLightDemand, // 确认轻需求是否还存在

  getLightDemandSingle, // 轻需求订单详情页

  releaseLightDemand, // 发布轻需求订单

  updataLightDemand, // 更新轻需求订单

  createNewChat, // 创建在线会话

  getOthers, // 其他数据集

}