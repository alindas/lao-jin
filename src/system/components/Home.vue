<template>
  <div class="container" v-visibility-change="tabChange">
    <div class="sidebar" :style="barSideStyle">
      <div class="sidebar-wrapper" :style="barSideWrapperStyle" 
        @mouseenter="enterSideBar" @mouseleave="leaverSideBar">
        <div class="logo">
          <h1 v-show="isLock || sidebarHover">捞金管理系统</h1>
          <div class="action" @click="retract" >
            <span class="icon" :style="actionStyle"><icon :name="isLock ? 'lock' : 'unlock'" scale="2"></icon></span>
          </div>
        </div>
        <div class="menu">
          <el-menu
              :default-active="currentMenu"
              class="el-menu-vertical-demo"
              background-color="#053f5e"
              text-color="#b4c6cf"
              active-text-color="#ffd04b">
              <el-menu-item index="1" @click="changeMenu('1', '信息审核', 'VerifyInfo', 1)">
                <i class="el-icon-s-check"></i>
                <span slot="title" v-show="isLock || sidebarHover">信息审核</span>
              </el-menu-item>
              <el-menu-item index="2" @click="changeMenu('2', '用户列表', 'SysUserList', 1)">
                <i class="el-icon-s-custom"></i>
                <span slot="title" v-show="isLock || sidebarHover">用户列表</span>
              </el-menu-item>
              <el-menu-item index="3" @click="changeMenu('3', '任务计划列表', 'SysPlanList', 1)">
                <i class="el-icon-document"></i>
                <span slot="title" v-show="isLock || sidebarHover">任务计划列表</span>
              </el-menu-item>
              <el-menu-item index="4" @click="changeMenu('4', '系统管理', 'SysSetUp', 1)">
                <i class="el-icon-setting"></i>
                <span slot="title" v-show="isLock || sidebarHover">系统管理</span>
              </el-menu-item>
            </el-menu>
        </div>
      </div>
    </div>
    <div class="main">
      <div class="header">
        <div class="status">
          <div class="time">
            {{today}}
          </div>
          <div class="user-avatar">
            <el-popover
              placement="bottom"
              width="80"
              trigger="hover">
              <div class="personal">
                <div >
                  <i class="el-icon-user-solid"></i>
                  <span>个人中心</span>
                </div>
                <div @click="loginout">
                  <i class="el-icon-switch-button"></i>
                  <span>退出登录</span>
                </div>
              </div>
              <el-avatar slot="reference"> {{userName}} </el-avatar>
            </el-popover>
          </div>
        </div>
      </div>
      <div class="nav">
        <div class="left-btn"><i class="el-icon-arrow-left"></i></div>
        <div class="menu-tag-list">
          <el-tag color="#fff" @click="changeMenu(null,'', 'SysHome', 0)" :type="currentMenu == null ? '' : 'info'">首页</el-tag>
          <el-tag
            v-for="tag in menuTags"
            :key="tag.name"
            closable
            :type="currentMenu == tag.index ? '' : 'info'"
            color="#fff"
            @click="changeMenu(tag.index, '', tag.route, 0)"
            @close="closeMenu(tag)">
            {{tag.name}}
          </el-tag>
        </div>
        <div class="right-btn"><i class="el-icon-arrow-right"></i></div>
        <el-popover
          placement="bottom"
          width="80"
          trigger="hover">
          <div class="personal">
            <div @click="closeTags(1)">
              <span>关闭所有</span>
            </div>
            <div @click="closeTags(0)">
              <span>关闭其他</span>
            </div>
          </div>
          <div class="close-btn" slot="reference"><i class="el-icon-circle-close"></i></div>
        </el-popover>
      </div>
      <div class="content">
        <div class="wrapper">
          <keep-alive>
            <router-view></router-view>
          </keep-alive>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getCookie, clearCookie } from '@/utils/cookie.js'

export default {
  name: 'Home',
  data() {
    return {
      isLock: true,
      sidebarHover: false,
      menuTags: [],
      preMenus: [], // 菜单栏历史
      currentMenu: null, // 当前菜单
      aliveTime: 0, // 页面后台活动时间
      alarmLock: null
    }
  },
  computed: {
    today() {
      let date = new Date();
      let day = '';
      switch(date.getDay()) {
        case 0: day = '日'; break;
        case 1: day = '一'; break;
        case 2: day = '二'; break;
        case 3: day = '三'; break;
        case 4: day = '四'; break;
        case 5: day = '五'; break;
        case 6: day = '六'; break;
        default: break;
      }

      return date.getFullYear() + '年 ' + (date.getMonth() + 1) + '月' + date.getDate() + '日 星期'
      + day;
    },
    userName() {
      return getCookie('manage');
    },
    barSideStyle() {
      if(this.isLock) {
        return {};
      }else {
        return {width: '64px'};
      }
    },
    barSideWrapperStyle() {
      if(this.sidebarHover) {
        return {width: '256px'}
      }else {
        return {}
      }
    },
    actionStyle() {
      if(this.isLock || this.sidebarHover) {
        return {};
      }else {
        return {right: '35%'};
      }
    }
  }, 
  methods: {
    // 侧边栏菜单动态收起
    retract() {
      this.isLock = !this.isLock;
      this.sidebarHover = false;
    },
    // 一下两项监听未锁定侧边栏的进入情况
    enterSideBar() {
      if(this.isLock) {
        return;
      }
      this.sidebarHover = true;
    },
    leaverSideBar() {
      if(this.isLock) {
        return;
      }
      this.sidebarHover = false;
    },
    loginout() {
      console.log('loginout');
      clearCookie('manage');
      this.$router.push({path: '/system'});
    },
    // 关闭导航栏菜单标签
    closeMenu(menu) {
      this.menuTags.splice(this.menuTags.indexOf(menu), 1);
      // 点击的是当前菜单标签，则删除历史记录中当前菜单和前一菜单的所有记录
      if(this.currentMenu == menu.index) {
        this.currentMenu = this.preMenus[0];
        if(!this.currentMenu) {
          this.$router.push({name: 'SysHome'})
        }else {
          for(let item of this.menuTags) {
            if(item.index == this.currentMenu) {
              this.$router.push({name: item.route})
            }
          }
        }
        this.preMenus = this.preMenus.filter(item => {
          return (item != this.currentMenu) && (item != menu.index);
        })
      }else {
        this.preMenus = this.preMenus.filter(item => {
          return item != menu.index;
        })
      }
    },
    // 导航栏关闭所有或其他
    closeTags(type) {
      if(this.menuTags.length) {
        if(type) {
          this.$router.push({name: 'SysHome'});
          this.menuTags = [];
          this.preMenus = [];
          this.currentMenu = null;
        }else{
          for(let item of this.menuTags) {
            if(item.index == this.currentMenu) {
              this.menuTags = [item];
              this.preMenus = [null];
              return;
            }
          }
        }
      }
      else {
        return;
      }
    },
    // 点击菜单项
    changeMenu(index, title, route, type) {
      if(this.currentMenu == null || this.preMenus[0] != this.currentMenu) {
        this.preMenus.unshift(this.currentMenu);
      }
      this.currentMenu = index;
      if(type) {
        if(!this.menuTags.some(item => item.index == index)) {
          this.menuTags.push({name: title, index, route})
        }
      }
      this.$router.push({name:route});
    },
    tabChange(evt, hidden) {
      /**
       * hidden 为false 时，表示从其他页面回到当前页
       * hidden 为true 时，表示从当前页切到其他页
       */
      if(hidden == false) {
        clearInterval(this.alarmLock);
        // 超过一分钟回退
        if(this.aliveTime >= 10) {
          clearCookie('manage');
          this.$router.push({path: '/system'})
        }else {
          this.aliveTime = 0;
        }
      }else if(hidden == true) {
        this.alarmLock = setInterval(() => this.aliveTime ++, 30000)
      }
    }

  },
  created() {
    let route = this.$route.path.split('/')[2];
    let tag = {};
    switch(route) {
      case 'verifyInfo': {
        this.currentMenu = '1';
        tag.name = '信息审核';
        tag.index = '1';
        tag.route = 'VerifyInfo';
        break;
      }
      case 'userList': {
        this.currentMenu = '2';
        tag.name = '用户列表';
        tag.index = '2';
        tag.route = 'SysUserList';
        break;
      }
      case 'planList': {
        this.currentMenu = '3';
        tag.name = '任务计划列表';
        tag.index = '3';
        tag.route = 'SysPlanList';
        break;
      }
      case 'set': {
        this.currentMenu = '4';
        tag.name = '系统管理';
        tag.index = '4';
        tag.route = 'SysSetUp';
        break;
      }
      default: break;
    }
    route != 'home' && this.menuTags.push(tag);
  }
}

</script>
<style lang="scss">
@import '@/system/style/home';
@import '@/style/commonValue';
@import '@/system/style/common';

</style>