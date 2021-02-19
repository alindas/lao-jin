import Vue from 'vue'
import Other from './Others.vue'
import router from '@/router'
import store from '@/store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/style/elementVariables.scss'

Vue.config.productionTip = false;
Vue.use(ElementUI);

router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? to.meta.title : '捞金';
  next();
})

new Vue({
  router,
  store,
  render: h => h(Other)
}).$mount('#app')