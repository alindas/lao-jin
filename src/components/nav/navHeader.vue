<template>
  <header :class="{'pick-up':pickUp}">
    <div class="main-nav">
      <div class="container clear">
        <div class="pic">
          <a href="/">
            <img src="~@/assets/logo.png" alt="logo">
          </a>
        </div>
        <el-menu :default-active="'/'+this.$route.path.split('/')[1]" router mode="horizontal" active-text-color="#fAAf00">
          <el-menu-item index="/index">首页</el-menu-item>
          <el-menu-item index="/fun">发现</el-menu-item>
          <el-menu-item index="/relax">茶水间</el-menu-item>
        </el-menu>
        <el-autocomplete
          class="inline-input"
          v-model="state"
          :fetch-suggestions="querySearch"
          placeholder="请输入内容"
          :class="{active:bol}"
          @focus="bol = true"
          @blur="bol = false">
        <i class="el-icon-search el-input__icon search" slot="suffix" :class="{change:bol}"></i>
        </el-autocomplete>
        <el-button type="primary" :class="{scale:bol}" @click="release">发布</el-button>
        <el-button v-if="!loginedState" @click="loginDialogVisible = true">登录</el-button>
        <div class="info" v-else>
          <el-popover placement="bottom" width="120">
            <div class="personal">
              <div @click="JumpPage('/personal')">
                <i class="el-icon-user-solid"></i>
                <span>我的主页</span>
              </div>
              <div @click="JumpPage('/personal/settings/')">
                <i class="el-icon-s-tools"></i>
                <span>设置</span>
              </div>
              <div @click="logout">
                <i class="el-icon-switch-button"></i>
                <span>退出</span>
              </div>
            </div>
            <img :src="userAvatar" class="head-pic" slot="reference">
          </el-popover>
          <el-popover placement="bottom" width="300">
            <div class="letter">
              <div class="letter-top">
                <span>我的私信</span>
              </div>
              <div class="letter-middle" v-if="chatMessageList">
                <router-link class="list-item" v-for="(item,index) in chatMessageList" :key="index"
                  :to="{ path: '/letters/',name: 'lettersWKey',params: {key: item._id}}" @click.native="outPopover">
                  <div class="avatar">
                    <img :src="isMyself(item.sessionA.account) ? Avatar(item.sessionB.avatar) : Avatar(item.sessionA.avatar)" alt="">
                  </div>
                  <div class="list-item-content">
                    <div class="user-name">
                      <span class="name">{{ isMyself(item.sessionA.account) ? item.sessionB.name : item.sessionA.name}}</span>
                      <span class="time">{{item.latestTime}}</span>
                    </div>
                    <div class="snippet">
                      {{item.latestContent}}
                    </div>
                  </div>
                </router-link>
              </div>
              <div class="letter-middle-nothing" v-else>
                <img src="@/assets/message2.png" class="letter-middle-bgc">
                <span class="letter-middle-text">暂时还没有消息(っ °Д °;)っ</span>
              </div>
              <div class="letter-below">
                <div @click="JumpPage('/letters','search')">
                  <i class="el-icon-edit"></i>
                  <span>写私信</span>
                </div>
                <div @click="JumpPage('/letters')">
                  <span>查看全部私信</span>
                </div>
              </div>
            </div>
            <i class="el-icon-s-comment" slot="reference"><el-badge :value="letterNum" :max="10"/></i>
          </el-popover>
          <el-popover placement="bottom" width="359">
            <div class="message">
              <el-tabs type="border-card">
                <el-tab-pane>
                  <span slot="label"><i class="el-icon-s-order"></i></span>
                </el-tab-pane>
                <el-tab-pane>
                  <span slot="label"><i class="el-icon-star-on"></i></span>
                </el-tab-pane>
                <el-tab-pane>
                  <span slot="label"><i class="el-icon-question"></i></span>
                </el-tab-pane>
              </el-tabs>
            </div>
            <div class="message-middle">
              <img src="@/assets/message.png">
            </div>
            <div class="message-middle-text">
              <span>你还没有消息哦o(*￣▽￣*)o</span>
            </div>
            <div class="message-below">
              <div>
                <i class="el-icon-s-tools"></i>
                <span>设置</span>
              </div>
              <div>
                <span>查看全部通知</span>
              </div>
            </div>
            <i class="el-icon-message-solid" slot="reference"><el-badge :value="messageNum" :max="99"/></i>
          </el-popover>
        </div>
        <el-dialog :visible.sync="loginDialogVisible" width="25%" :modal-append-to-body="true"
          :append-to-body="true" :close-on-click-modal="false"  @close="closeDialog">
          <h3 slot="title">{{loginDialogTitle}}</h3>
          <div v-if="loginView == 2">
            <el-form :model="loginFormAccount" ref="loginFormAccount" size="small">
              <el-form-item prop="accountNumber" key="accountNumber">
                <el-input type="text" placeholder="请输入手机号码/邮箱/学号" v-model="loginFormAccount.accountNumber" 
                minlength="11" maxlength="11"/>
              </el-form-item>
              <el-form-item prop="accountPassword" key="accountPassword">
                <el-input placeholder="请输入密码" v-model="loginFormAccount.accountPassword" show-password 
                minlength="6" maxlength="20"/>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="loginRequest">登录</el-button>
              </el-form-item>
            </el-form>
            <ul>
              <li><span @click="changeLoginView(1,'loginFormAccount')">手机登录</span></li>
              <li><span @click="changeLoginView(3,'loginFormAccount')">忘记密码</span></li>
            </ul>
            <ul><li>注册登录即表示同意&nbsp;<span>用户协议</span>、<span>隐私政策</span></li></ul>
          </div>
          <div v-else-if="loginView == 3">
            <el-form :model="forgetForm" ref="forgetForm" size="small">
              <el-form-item prop="forgetId" key="forgetId">
                <el-input type="text" placeholder="请输入手机号码" v-model="forgetForm.forgetId" 
                minlength="11" maxlength="11" show-word-limit/>
              </el-form-item>
              <el-form-item prop="forgetVerifyCode" key="forgetVerifyCode">
                <el-input type="text" placeholder="验证码" v-model="forgetForm.forgetVerifyCode">
                 <span slot="suffix" @click="verifyRequest" :class="{verifyBan: isSend}">{{verifyWord}}</span>
                </el-input>
              </el-form-item>
              <el-form-item prop="newPassword" key="newPassword">
                <el-input placeholder="请输入新密码" v-model="forgetForm.newPassword" show-password 
                minlength="6" maxlength="20"/>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="loginRequest">修改</el-button>
              </el-form-item>
            </el-form>
            <ul>
              <li><span @click="changeLoginView(2,'forgetForm')">账密登录</span></li>
            </ul>
          </div>
          <div v-else>
            <el-form :model="loginFormPhone" ref="loginFormPhone" size="small" >
              <el-form-item prop="loginPhone" key="loginPhone">
                <el-input type="text" placeholder="请输入手机号码" v-model="loginFormPhone.loginPhone" 
                  minlength="11" maxlength="11" show-word-limit />
              </el-form-item>
              <el-form-item prop="loginVerifyCode" key="loginVerifyCode">
                <el-input type="text" placeholder="验证码" v-model="loginFormPhone.loginVerifyCode">
                  <span slot="suffix" @click="verifyRequest" :class="{verifyBan: isSend}">{{verifyWord}}</span>
                </el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="loginRequest">登录</el-button>
              </el-form-item>
            </el-form>
            <ul><li><span @click="changeLoginView(2,'loginFormPhone')">其他登录方式</span></li></ul>
            <ul><li>注册登录即表示同意&nbsp;<span>用户协议</span>、<span>隐私政策</span></li></ul>
          </div>
        </el-dialog>
      </div>
    </div>
  </header>
</template>

<script>
import { loginByPhone, loginByAccount, loginOut, getChatMessage } from '@/axios/request';
import * as cookieFun from '@/assets/utils/cookie';

export default {
  name: 'navHeader',
  data() {
    return {
      pickUp: true, // 主导航动态挂起标识
      preScroll: 0, // 前一滑动距离标识
      currentScroll: 0,
      hotSearch: [], 
      state: '',
      bol: false, 
      letterNum: 11,
      messageNum: 3, 
      userAvatar: '', // 用户头像
      loginedState: false, // 登陆状态标识
      loginDialogVisible: false,  // 登陆对话框标识
      loginView: 1, // 登陆对话框展示视图标识
      verifyWord: '获取验证码',
      getVerifyLimit: 5,  // 验证码获取周期
      isSend: false,  // 验证码获取标识
      verifyCD: null, // 验证码获取重置状态标识
      // 手机登录表单
      loginFormPhone: {
        loginPhone: '',
        loginVerifyCode: '',
      },
      // 账密登录表单
      loginFormAccount: {
        accountNumber: '',
        accountPassword: '',
      },
      // 找回密码表单
      forgetForm: {
        forgetId: '',
        forgetVerifyCode: '',
        newPassword: '',
      },
      // 用户私信内容
      chatMessageList: [],
    }
  },
  watch: {
    '$store.state.account': function(newVal) {
      this.userAvatar = 'data:'+ newVal.avatar.mimetype +';base64,'+ newVal.avatar.base64;
    },
    '$store.state.showLoginedDialog': function(newVal) {
      this.loginDialogVisible = true;
    }
  },
  computed: {
    loginDialogTitle() {
      if(this.loginView == 2) return '账密登录';
      else if(this.loginView == 3) return '手机重置密码';
      else return '手机登录';
    }
    
  },
  methods: {
    // 判断是否为己方
    isMyself(account) {
      return account == localStorage.getItem('account') ? true : false;
    },
    // 返回私信双方头像
    Avatar(data) {
      return 'data:'+data.minetype+';base64,'+data.base64;
    },
    // 搜索框热点匹配
    querySearch(queryString,cb) {
      let hotSearch = this.hotSearch;
      let res = queryString ? hotSearch.filter(this.createFilter(queryString)) : hotSearch;
      // 调用 callback 返回建议列表的数据
      cb(res);
    },
    // 搜索框数据过滤
    createFilter(queryString) {
      return res => res.value.toLowerCase().includes(queryString.toLowerCase());
    },
    // 登录对话框的各种请求
    loginRequest() {
      switch(this.loginView) {
        case 1:
          if(this.loginFormPhone.loginPhone === '') {
            this.$message('请填写手机号');
            break;
          }
          else if(this.loginFormPhone.loginVerifyCode === '') {
            this.$message('请输入验证码');
            break;
          }
          /**
           * 登录请求
           */

          break; 
        case 2:
          if(this.loginFormAccount.accountNumber === '') {
            this.$message('请填写手机号或邮箱或学号');
            break;
          }
          else if(this.loginFormAccount.accountPassword === '') {
            this.$message('请输入密码');
            break;
          }
          else {
            loginByAccount(this.loginFormAccount)
          .then(res => {
            if(res.data.message == 'error') {
              this.$message.error('登录失败，账号或密码错误');
            }
            else {
              // this.$store.commit('changeAccount',res.data.data); // 设置登录用户基本信息
              // this.$store.commit('setToken',res.data.token); // 设置登录用户的token 值
              cookieFun.setCookie('token',res.data.token, 999);
              localStorage.setItem('account',res.data.data);
              window.location.href = '/';
            }
          })
          .catch(err => {
            this.$message.error(err);
          })
          break; 
          }
          
        case 3:
          if(this.forgetForm.forgetId === '') {
            this.$message('请填写手机号');
            break;
          }
          else if(this.forgetForm.forgetVerifyCode === '') {
            this.$message('请输入验证码');
            break;
          }
          else if(this.forgetForm.newPassword === '') {
            this.$message('密码长度不能小于6位');
            break;
          }
          /**
           * 登录请求
           */

          break; 
        default: 
          this.$message({message:'系统错误',type:'error'}); return;
      }
      // localStorage.setItem('name','lihouhua');
      // EleUI 导航栏的路由跳转不允许跳转到重复的路由下
      // this.$router.push('/');
      // window.location.href = '/';
    },
    // 手机登录验证码获取请求
    verifyRequest() {
      switch(this.loginView) {
        case 1:
          if(this.getVerifyLimit == 5) {
            if(this.loginFormPhone.loginPhone === '') break;
            else {
              this.isSend = true;
              this.verifyCD = setInterval(() => {
                if(this.getVerifyLimit == 0) {
                  this.resetVerify();
                  return;
                }
                this.getVerifyLimit -- ;
                this.verifyWord = this.getVerifyLimit + ' 秒后重新获取';
              },1000)
              break;
            }
          }
          else break;
        case 3:
          if(this.getVerifyLimit == 5) {
            if(this.forgetForm.forgetId === '') break;
            else {
              this.isSend = !this.isSend;
              this.verifyCD = setInterval(() => {
                if(this.getVerifyLimit == 0) {
                  this.resetVerify();
                  return;
                }
                this.getVerifyLimit -- ;
                this.verifyWord = this.getVerifyLimit + ' 秒后重新获取';
              },1000)
              break;
            }
          }
          else break;
        default: break;
      }
    },
    // 用户登出
    logout() {
      if(!confirm('确定登出吗？每一片贫瘠的土地都需要坚定的挖掘者！')) {
        document.querySelector('body').click();
        return;
      }
      loginOut({account: localStorage.getItem('account') })
      .then(res => {
        if(res.data.message == 'success') {
          cookieFun.clearCookie('token');
          localStorage.removeItem('account');
          window.location.href = '/';
        }
        else {
          this.$message.error('服务器错误，请稍后重试')
        }
      })
      .catch(err => {
        console.log(err);
      })
    },
    // 登录对话框视图转换
    changeLoginView(currentP,formName) {
      this.loginView = currentP;
      this.$refs[formName].resetFields();
      this.resetVerify();
    },
    // 关闭登录框后重置其输入信息
    closeDialog() {
      switch(this.loginView) {
        case 1: this.$refs.loginFormPhone.resetFields(); this.resetVerify(); break;
        case 2: this.$refs.loginFormAccount.resetFields(); break;
        case 3: this.$refs.forgetForm.resetFields(); this.resetVerify(); break;
        default: break;
      }
      this.loginView = 1;
    },
    // 重置验证码获取状态
    resetVerify() {
      clearInterval(this.verifyCD);
      this.verifyWord = '获取验证码';
      this.getVerifyLimit = 5;
      this.isSend = false;

    },
    // 动态挂起主导航栏
    pickUpMainNav() {
      if(!(this.$route.path.includes('index') || this.$route.path.includes('post'))) return;
      let scrollTop = window.pageYOffset || document.body.scrollTop;
      if(scrollTop > this.currentScroll) {
        if(scrollTop - this.preScroll >= 200) {
          this.pickUp && (this.pickUp = false);
          this.preScroll = scrollTop;
        }
      }
      else {
        if(Math.abs(this.preScroll - scrollTop) >= 50) {
          !this.pickUp && (this.pickUp = true);
          this.preScroll = scrollTop;
        }
      }
      this.currentScroll = scrollTop;
    },
    // 兼职信息发布
    release() {
      if(!this.loginedState) {
        this.loginDialogVisible = true;
        return;
      }
      else {
        window.open('/others/release');
      }
    },
    // 菜单航路由跳转
    JumpPage() {
      this.outPopover();
      // 匹配设置
      if(arguments[0].includes('settings')) {
        this.$router.push(arguments[0] + 'profile');
      }
      // 匹配个人主页
      else if(arguments[0].includes('personal')) {
        this.$router.push({
          path: arguments[0],
          name: 'personal',
          params: { id: this.$store.state.account._id }
        })
      }
      // 匹配私信
      else if(arguments[0].includes('letters')) {
        if(arguments[1]) {
          this.$router.push({
            path: arguments[0],
            query: { state: arguments[1] }
          })
        }
        else {
          this.$router.push(arguments[0]);
        }
      }
      else {
        this.$router.push(arguments[0])
      }
    },
    // 手动退出导航栏菜单popover 对话框
    outPopover() {
      document.querySelector('body').click();
    },
    // 初始化导航栏内容
    load() {
      // 返回搜索框的热点推荐数据
      // this.hotSearch = this.loadAll();
      // 是否已登录？true 则加载个人私人数据
      this.loginedState = cookieFun.getCookie('token') ? true : false;
      if(this.loginedState) {
        getChatMessage({account: localStorage.getItem('account')})
        .then(res => {
          this.chatMessageList = res.data;
        })
        .catch(err => {
          console.log(err);
        })
      }
      document.addEventListener('scroll',this.pickUpMainNav);

    }
  },
  created() {
    this.load();
  },
  mounted() {
  },
}

</script>
<style lang='scss'>
@import "@/style/commonValue";
@import "@/style/navHeader";
</style>