import router from '@/router'
import { getCookie } from '@/utils/cookie.js'

router.beforeEach((to, from, next) => {
  // 登录状态有效下任意访问
  if (window.localStorage.account && getCookie('token')) {
    router.app.$options.store.getters.initState && next();
  } else {
    // 没有登录状态下限制路由转换
    if (to.path.includes('personal') ||
      to.path.includes('letters') ||
      to.path.includes('release') ||
      to.path.includes('drafts') ||
      to.path.includes('fastservice')) {
      next({ path: '/' });
    } else {
      next();
    }
  }
})