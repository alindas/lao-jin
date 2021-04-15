<template>
  <div id="app">
    <NavHeader ref="navHeader"/>
    <router-view v-if="routeAlive"/>
    <el-backtop title="回到顶部"></el-backtop>
    <div class="suggest" title="建议反馈"><i class="el-icon-service"></i></div>
  </div>
</template>
<script>
import NavHeader from './components/nav/navHeader';
import { confirmLoginedMes } from '@/axios/request.js';
import { getCookie, clearCookie } from '@/utils/cookie.js';


export default {
  name: 'app',
  data() {
    return {
      routeAlive: true, 
      sourse: null, // sse 实时通讯载体
    }
  },
  computed: {
    navHeaderState() {
      return this.$refs.navHeader.pickUp;
    }
  },
  components: {
    NavHeader
  },
  methods: {
    reload() {
      this.routeAlive = false; // 强制死亡
      this.$nextTick(() => this.routeAlive = true);
    }
  },
  created() {
    // 检测用户登录状态以及对应的处理
    if(localStorage.getItem('account') && getCookie('token')) {
      confirmLoginedMes({
        account: localStorage.getItem('account'),
        token: getCookie('token')
      })
      .then(res => {
        if(res.data.message != 'error') {
          this.$store.commit('initAccount', res.data.baseMess);
          this.$store.commit('initVoteUpList', res.data.likeMess);
          this.$store.commit('initCollectList', res.data.collectList);
          this.$store.commit('initFollowList', res.data.followList);
          this.$store.commit('initFansCount', res.data.fansCount);
          this.$store.commit('initFollowTagsList', res.data.followTagsList);
          // 如果浏览器不支持sse(没错，IE你这个垃圾, 说得就是你)
          if(!('EventSource' in window)) {
            alert('当前浏览器尚不支持sse 技术，请卸载它并安装Chrome 浏览器（推荐）');
          }else {
            // 开启sse 实时通讯用于接收服务端的动态信息
            this.sourse = new EventSource(`http://localhost:8888/sse/latestNotify?account=${localStorage.getItem('account')}`);
            this.sourse.onopen = () => {
              console.log('Connection Success');
            }
            // sse 连接出错处理
            this.sourse.onerror = event => {
              console.log(`sse 连接出错--${event}`);
            }
            // 监听服务端实时更新的默认事件，并作出相应处理
            this.sourse.onmessage = event => {
              console.log(event.data);
            }
            // 监听服务端自定义事件，并作出相应处理
            // 私信会话
            this.sourse.addEventListener(`${localStorage.getItem('account')}-chat`, event => {
              this.$store.commit('addChatNotice', {
                data: JSON.parse(event.data)
              })
              console.log( event.type + ' 事件已响应，数据'+ JSON.parse(event.data));
            })
            // 系统通知, 类型0
            this.sourse.addEventListener(`${localStorage.getItem('account')}-sys-0`, event => {
              this.$store.commit('addSysNotice', {
                type: 0,
                data: event.data
              });
              console.log( event.type + ' 事件已响应，数据'+ JSON.parse(event.data));
            })
            // 系统通知, 类型1
            this.sourse.addEventListener(`${localStorage.getItem('account')}-sys-1`, event => {
              this.$store.commit('addSysNotice', {
                type: 1,
                data: event.data
              })
              console.log( event.type + ' 事件已响应，数据'+ JSON.parse(event.data));

            });
            // 系统通知, 类型2
            this.sourse.addEventListener(`${localStorage.getItem('account')}-sys-2`, event => {
              this.$store.commit('addSysNotice', {
                type: 2,
                data: event.data
              });
              console.log( event.type + ' 事件已响应，数据'+ JSON.parse(event.data));
            })
          
          }
        }
        else {
          clearCookie('token');
          localStorage.removeItem('baseMess');
          localStorage.removeItem('account');
          localStorage.removeItem('release');
          localStorage.removeItem('drafts');
          window.location.href = '/';
        }
      })

    }
    
  },
  unmounted() {
    // 关闭sse 连接
    this.sourse && this.sourse.close();
  },
}
</script>
<style lang="scss">
  @import '@/style/commonValue';
  @import '@/style/common';
  .el-backtop {
    bottom: 85px !important;
    color: #909399 !important;
  }

  .suggest {
    position: fixed;
    right: 40px;
    bottom: 40px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    color: $theme-color;
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    box-shadow: 0 0 6px rgba(0, 0, 0, 0.12);
    cursor: pointer;
    z-index: 5;
  }

  .suggest:hover {
    background-color: #f2f6fc;
  }
</style>
