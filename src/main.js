import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import '@/assets/icon/iconfont.css'
import 'element-ui/lib/theme-chalk/index.css'
import './style/elementVariables.scss'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import Icon from 'vue-svg-icon/Icon.vue'
import './router/permission'
import VEmojiPicker from 'v-emoji-picker';
// 解决EleUI Dialog 对话框默认锁定滚动条对页面产生抖动问题
// ElementUI.Dialog.props.lockScroll.defalut = false;
Vue.config.productionTip = true;
Vue.use(ElementUI);
// 全局使用Icon 组件
Vue.component('icon', Icon);
// 全局使用vemojiPicker 组件
Vue.use(VEmojiPicker);
// 配置路由导航前置守卫
router.beforeEach((to, from, next) => {
  NProgress.start();
  document.title = to.meta.title ? to.meta.title : '捞金';
  next();
})

// 配置路由导航后置钩子
router.afterEach(() => {
  NProgress.done();
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')