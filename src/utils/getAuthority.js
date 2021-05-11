import { getCookie } from './cookie';


/**
 * 使用该方法需要绑定this 上下文
 * @returns 
 * 
 */
const getAuthority = function() {
  if (localStorage.getItem('account') && getCookie('token')) {
    return true; // 已登录返回真
  } else {
    this.$store.commit('showLoginedDialog');
    return false; // 未登录返回false
  }
}
export default getAuthority;