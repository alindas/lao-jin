import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '@/views/index/index'
import OthersIndex from '@/others/Content'
import Demo from '@/components/Demo'

// 解决Element UI 导航栏中的vue-router 在3.0+ 版本重复点菜单报错的问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
}

const originalReplace = VueRouter.prototype.replace;
VueRouter.prototype.replace = function replace(location) {
  return originalReplace.call(this, location).catch(err => err);
}

Vue.use(VueRouter)

const routes = [{
    path: '/',
    redirect: '/index'
  },
  // 首页路由
  {
    path: '/index',
    component: Index,
    beforeEnter: (to, from, next) => {
      router.app.$options.store.getters.initState && next();
    },
    redirect: '/index/recommend',
    children: [{
        path: 'recommend',
        meta: { title: '首页 - 推荐' },
        component: () =>
          import ('@/components/content/index/indexMain'),
      },
      {
        path: 'inside',
        meta: { title: '首页 - 校内兼职' },
        component: Demo,
      },
      {
        path: 'outside',
        meta: { title: '首页 - 校外兼职' },
        component: Demo,
      },
      {
        path: 'lwork',
        meta: { title: '首页 - 长期工' },
        component: Demo,
      },
      {
        path: 'swork',
        meta: { title: '首页 - 短期工' },
        component: Demo,
      }
    ]
  },
  // 信息页面主体
  {
    path: '/post/:key',
    meta: { title: '内容页' },
    component: () =>
      import ('@/views/content/messContent'),
  },
  // 个人主页路由
  {
    path: '/personal/:id',
    name: 'personal',
    redirect: { name: 'activities' },
    component: () =>
      import ('@/views/personal/personal'),
    children: [{
        path: 'activities',
        name: 'activities',
        meta: { title: '个人主页 - 动态' },
        component: () =>
          import ('@/components/content/user/centerShow'),
      },
      {
        path: 'release',
        meta: { title: '个人主页 - 发布内容' },
        component: () =>
          import ('@/components/content/user/centerShow'),
      },
      {
        path: 'drafts',
        meta: { title: '个人主页 - 草稿' },
        component: () =>
          import ('@/components/content/user/centerShow'),
      },
      {
        path: 'likes',
        meta: { title: '个人主页 - 喜欢' },
        component: () =>
          import ('@/components/content/user/centerShow'),
      },
    ]
  },
  // 个人设置路由
  {
    path: '/personal/settings/:type',
    meta: { title: '设置' },
    component: () =>
      import ('@/components/content/user/setting'),
  },
  // 私信聊天路由
  {
    path: '/letters',
    meta: { title: '私信-捞金' },
    component: () =>
      import ('@/views/content/letter'),
  },
  {
    path: '/letters/:key',
    name: 'lettersWKey',
    meta: { title: '私信-捞金' },
    component: () =>
      import ('@/views/content/letter'),
  },
  // 发现页路由
  {
    path: '/fun',
    meta: { title: '发现' },
    component: () =>
      import ('@/views/find/findIndex')
  },
  {
    path: '/fun/:tag',
    name: 'funWithTag',
    meta: { title: '发现' },
    component: () =>
      import ('@/views/find/findContent')
  },
  // 茶水间路由
  {
    path: '/relax',
    meta: { title: '茶水间' },
    component: Demo,
  },
  // 第二页面路由
  {
    path: '/others',
    component: OthersIndex,
    redirect: '/others/error',
    children: [{
        path: 'release',
        meta: { title: '信息发布-捞金' },
        component: () =>
          import ('@/views/expand/release'),
      },
      {
        path: 'drafts',
        meta: { title: '草稿箱-捞金' },
        component: () =>
          import ('@/views/expand/drafts'),
      },
      {
        path: 'links',
        meta: { title: '拓展内容-捞金' },
        component: () =>
          import ('@/components/common/Special'),
      },
      {
        path: '*',
        meta: { title: '404错误-捞金' },
        component: () =>
          import ('@/components/common/Error')
      }
    ]
  },
  // 错误url 返回首页
  {
    path: '*',
    redirect: '/',
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router