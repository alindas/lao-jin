import Vue from 'vue'
import router from '@/router'
import store from '@/store'
import System from '@/system/System.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/style/elementVariables.scss'
import Icon from 'vue-svg-icon/Icon.vue'
import '@/router/syspermission'
import visibility from 'vue-visibility-change'



Vue.component('icon', Icon);
Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.use(visibility); // 监听tab 页切换动作

router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? to.meta.title : '捞金-后台管理';
  next();
})

new Vue({
  router,
  store,
  render: h => h(System)
}).$mount('#app')