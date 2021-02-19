<template>
  <div id="app">
    <NavHeader ref="navHeader"/>
    <router-view/>
    <el-backtop title="回到顶部"></el-backtop>
    <div class="suggest" title="建议反馈"><i class="el-icon-service"></i></div>
  </div>
</template>
<script>
import NavHeader from './components/nav/navHeader';
import {confirmLoginedMes} from '@/axios/request';
import {getCookie} from '@/assets/utils/cookie';

export default {
  name: 'app',
  computed: {
    navHeaderState() {
      return this.$refs.navHeader.pickUp;
    }
  },
  components: {
    NavHeader
  },
  created() {
    if(localStorage.getItem('account')) {
      confirmLoginedMes({account: localStorage.getItem('account'), token: getCookie('token')})
      .then(res => {
        if(res.data.message == 'success') {
          this.$store.commit('initAccount', res.data.baseMess);
          this.$store.commit('initVoteUpList', res.data.likeMess);
          this.$store.commit('initCollectList', res.data.collectList);
          this.$store.commit('initFollowList', res.data.followList);
          this.$store.commit('initFansCount', res.data.fansCount);
        }
      })
    }
  }
  
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
