import router from '@/router'
import { getCookie } from '@/utils/cookie.js'

router.beforeEach((to, from, next) => {
  // 登录状态有效下任意访问
  if (getCookie('manage')) {
    if (to.path === '/system/entry') {
      next({ path: '/system/home' })
    } else {
      next()
    }
  } else {
    // 无效下限制路由转换
    if (to.path === '/system' || to.path === '/system/entry') {
      next();
    } else {
      next({ path: '/system' })
    }
  }
})