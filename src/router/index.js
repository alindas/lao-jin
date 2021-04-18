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
        redirect: '/index/recommend',
        children: [{
            name: 'indexContent',
            path: '/index/:type',
            component: () =>
                import ('@/components/content/index/indexMain')
        }, ]
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
                path: 'follows',
                meta: { title: '个人主页 - 关注列表' },
                component: () =>
                    import ('@/components/content/user/centerShow'),
            },
            {
                path: 'fans',
                meta: { title: '个人主页 - 粉丝列表' },
                component: () =>
                    import ('@/components/content/user/centerShow'),
            },
            {
                path: 'collect',
                meta: { title: '个人主页 - 收藏' },
                component: () =>
                    import ('@/components/content/user/centerShow'),
            },
        ]
    },
    // 个人设置路由
    {
        path: '/personal/:account/settings/:type',
        meta: { title: '设置' },
        component: () =>
            import ('@/components/content/user/setting'),
    },
    // 用户主页路由
    {
        path: '/users/:id',
        name: 'user',
        component: () =>
            import ('@/views/personal/user')
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
        component: () =>
            import ('@/views/fastService/index'),
    },
    // 跑腿服务订单准备页
    {
        path: '/fastservice/:id',
        name: 'fastService',
        meta: { title: '订单确认' },
        component: () =>
            import ('@/views/fastService/orderBody')
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
    // 系统后台管理页面
    {
        path: '/system',
        redirect: '/system/entry'
    },
    // 后台登录页
    {
        path: '/system/entry',
        meta: { title: '捞金-系统登录' },
        component: () =>
            import ('@/system/components/Entry')
    },
    // 后台首页
    {
        path: '/system',
        component: () =>
            import ('@/system/components/Home'),
        children: [{
            path: 'home',
            name: 'SysHome',
            meta: { title: '捞金-系统首页' },
            component: () =>
                import ('@/system/components/Index')
        }, {
            path: 'verifyInfo',
            name: 'VerifyInfo',
            component: () =>
                import ('@/system/components/InfoManage'),
            childrend: [{}]
        }, {
            path: 'userList',
            name: 'SysUserList',
            meta: { title: '捞金-用户列表' },
            component: () =>
                import ('@/system/components/SysUserList'),
        }, {
            path: 'planList',
            name: 'SysPlanList',
            meta: { title: '捞金-任务计划列表' },
            component: () =>
                import ('@/system/components/SysPlanList'),
        }, {
            path: 'set',
            name: 'SysSetUp',
            meta: { title: '捞金-系统管理' },
            component: () =>
                import ('@/system/components/Setup')
        }]
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