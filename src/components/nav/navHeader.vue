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
          v-model="searchValue"
          :fetch-suggestions="querySearch"
          :select-when-unmatched="true"
          placeholder="请输入内容"
          :class="{active:bol}"
          @select="search"
          @focus="bol = true"
          @blur="bol = false">
        <i class="el-icon-search el-input__icon search" slot="suffix" :class="{change:bol}" @mousedown="search"></i>
        <template slot-scope="{ item }">
          <div class="name" @mouseenter="histHover = item.value" @mouseleave="histHover = ''">{{ item.value }}
            <i class="el-icon-close histClose" v-show="histHover == item.value" @mousedown="preventDefault" @click="deleteHist(item.value)"></i>
          </div>
        </template>
        </el-autocomplete>
        <el-button type="primary" 
          :class="{scale:bol}" 
          @click="release"
          @mouseenter.native="bar = true"
          @mouseleave.native="bar = false" 
          style="position: relative;">发布
          <button class="light-demand-btn" 
            :style="showLightDemandBtn"
            @click="openLightDemandDialog"><i class="el-icon-bicycle"/>跑腿服务</button>
        </el-button>
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
            <img :src="userAvatar" alt="avatar" class="head-pic" slot="reference" v-if="userAvatar">
            <img src="@/assets/head-pic.png" alt="avatar" class="head-pic" slot="reference" v-else>
          </el-popover>
          <el-popover placement="bottom" width="300">
            <div class="letter">
              <div class="letter-top">
                <span>我的私信</span>
              </div>
              <div class="letter-middle" v-if="chatMessageList.length != 0">
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
            <i class="el-icon-s-comment" slot="reference" @click="seeChatLetter"><el-badge v-show="letterNum != 0" :value="letterNum" :max="10"/></i>
          </el-popover>
          <el-popover placement="bottom" width="349">
            <div class="message">
              <ul class="message-tab">
                <li class="message-tab-item" @click="changeMessageType(0)" :style="messageType == 0 ? {color: '#fAAf00'}: {}">
                  <span>
                    <i class="el-icon-s-claim" style="position: relative;">
                      <i class="message-item-badge" v-show="messageNotice[0]"></i>
                    </i>
                  </span>
                </li>
                <li class="message-tab-item" @click="changeMessageType(1)" :style="messageType == 1 ? {color: '#fAAf00'}: {}">
                  <span>
                    <i class="el-icon-s-order" style="position: relative;">
                      <i class="message-item-badge" v-show="messageNotice[1]"></i>
                    </i>
                  </span>
                </li>
                <li class="message-tab-item" @click="changeMessageType(2)" :style="messageType == 2 ? {color: '#fAAf00'}: {}">
                  <span>
                    <i class="el-icon-s-opportunity" style="position: relative;">
                      <i class="message-item-badge" v-show="messageNotice[2]"></i>
                    </i>
                  </span>
                </li>
              </ul>
            </div>
            <div class="message-middle-nothing" v-if="sysMessageList[messageType].length == 0">
              <img src="@/assets/message.png">
            </div>
            <div class="message-middle" v-else>
              <router-link class="list-item" v-for="(item,index) in sysMessageList[messageType]" :key="index"
                :to="item.link" @click.native="outPopover" :title="item.desc">
                <div class="list-item-content">
                  {{item.desc}}
                </div>
              </router-link>
            </div>
            <div class="message-middle-text" v-if="sysMessageList[messageType].length == 0">
              <span>还没有消息</span>
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
            <i class="el-icon-message-solid" slot="reference" @click="seeSysNotice(0)"><el-badge v-show="messageNum != 0" :value="messageNum" :max="99"/></i>
          </el-popover>
        </div>
        <el-dialog :visible.sync="loginDialogVisible" width="25%" :modal-append-to-body="true"
          :append-to-body="true" :close-on-click-modal="false"  @close="closeDialog">
          <h3 slot="title">{{loginDialogTitle}}</h3>
          <div v-if="loginView == 2">
            <el-form :model="loginFormAccount" ref="loginFormAccount" size="small">
              <el-form-item prop="accountNumber" key="accountNumber" style="margin-bottom: 10px">
                <el-input type="text" placeholder="请输入手机号码/邮箱/学号" v-model="loginFormAccount.accountNumber" 
                minlength="11" maxlength="11"/>
              </el-form-item>
              <el-form-item prop="accountPassword" key="accountPassword" style="margin-bottom: 10px">
                <el-input placeholder="请输入密码" v-model="loginFormAccount.accountPassword" show-password 
                minlength="6" maxlength="20"/>
              </el-form-item>
              <el-form-item style="margin-bottom: 10px">
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
              <el-form-item prop="forgetId" key="forgetId" style="margin-bottom: 10px">
                <el-input type="text" placeholder="请输入手机号码" v-model="forgetForm.forgetId" 
                minlength="11" maxlength="11" show-word-limit/>
              </el-form-item>
              <el-form-item prop="forgetVerifyCode" key="forgetVerifyCode" style="margin-bottom: 10px">
                <el-input type="text" placeholder="验证码" v-model="forgetForm.forgetVerifyCode">
                 <span slot="suffix" @click="verifyRequest" :class="{verifyBan: isSend}">{{verifyWord}}</span>
                </el-input>
              </el-form-item>
              <el-form-item prop="newPassword" key="newPassword" style="margin-bottom: 10px">
                <el-input placeholder="请输入新密码" v-model="forgetForm.newPassword" show-password 
                minlength="6" maxlength="20"/>
              </el-form-item>
              <el-form-item style="margin-bottom: 10px">
                <el-button type="primary" @click="loginRequest">修改</el-button>
              </el-form-item>
            </el-form>
            <ul>
              <li><span @click="changeLoginView(2,'forgetForm')">账密登录</span></li>
            </ul>
          </div>
          <div v-else>
            <el-form :model="loginFormPhone" ref="loginFormPhone" size="small" >
              <el-form-item prop="loginPhone" key="loginPhone" style="margin-bottom: 10px">
                <el-input type="text" placeholder="请输入手机号码" v-model="loginFormPhone.loginPhone" 
                  minlength="11" maxlength="11" show-word-limit />
              </el-form-item>
              <el-form-item prop="loginVerifyCode" key="loginVerifyCode" style="margin-bottom: 10px">
                <el-input type="text" placeholder="验证码" v-model="loginFormPhone.loginVerifyCode">
                  <span slot="suffix" @click="verifyRequest" :class="{verifyBan: isSend}">{{verifyWord}}</span>
                </el-input>
              </el-form-item>
              <el-form-item style="margin-bottom: 10px">
                <el-button type="primary" @click="loginRequest">登录</el-button>
              </el-form-item>
            </el-form>
            <ul><li><span @click="changeLoginView(2,'loginFormPhone')">其他登录方式</span></li></ul>
            <ul><li>注册登录即表示同意&nbsp;<span>用户协议</span>、<span>隐私政策</span></li></ul>
          </div>
        </el-dialog>
        <el-dialog :visible.sync="lightDemandDialog" width="40%" :modal-append-to-body="true"
          :append-to-body="true" :close-on-click-modal="false">
          <h3 slot="title">轻需求发布</h3>
          <div>
            <el-form ref="releaseForm" :model="releaseForm" label-width="80px" :rules="releaseFormRules">
              <el-form-item label="内容" prop="content" style="margin-bottom: 22px">
                <el-input v-model="releaseForm.content"></el-input>
              </el-form-item>
              <el-form-item label="报酬" style="margin-bottom: 22px">
                <el-input-number v-model="releaseForm.reward" :min="1" :max="10" label="描述文字"></el-input-number>
              </el-form-item>
              <el-form-item label="高校" style="margin-bottom: 22px" prop="educ">
                <el-select v-model="releaseForm.university" placeholder="请选择">
                  <el-option
                    v-for="item in edus"
                    :key="item"
                    :label="item"
                    :value="item"
                    >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="说明" prop="addNotes">
                <el-input type="textarea" class="moreInfo" :autosize="{minRows: 6}" resize="none" v-model="releaseForm.addNotes"></el-input>
              </el-form-item>
            </el-form>
            <div class="action-box">
              <el-button type="primary" round @click="releaseLightDemand">确认发布</el-button>
            </div>
          </div>
        </el-dialog>
      </div>
    </div>
  </header>
</template>

<script>
import { loginByPhone, 
loginByAccount, 
loginOut, 
getChatMessage, 
getSearchHist, 
updateSearchHist,
confirmLoginedMes,
releaseLightDemand,
getSysMessage } from '@/axios/request';
import * as cookieFun from '@/utils/cookie';
import getFormateDate from '@/utils/dataFormate';

export default {
  name: 'navHeader',
  
  data() {
    // 自定义需求内容验证器
    let SWFilter = (rule, value, callback) => {
      if(value === '') {
        return callback(new Error('内容不能为空'));
      }
      /**
       * 异步请求进行敏感内容检测
       */
      setTimeout(() => {
        if(value.search(/nm|垃圾|操你妈/g) != -1) {
         callback(new Error('内容不规范，请重新审查'));
        }
        else {
         callback();
        }
      }, 500)
    };
    // 自定义需求内容验证器
    let SWFilter_edu = async (rule, value, callback) => {
      if(value === '') {
        return callback(new Error('内容不能为空'));
      }
    };
    return {
      pickUp: true, // 主导航动态挂起标识
      preScroll: 0, // 前一滑动距离标识
      currentScroll: 0,
      searchHist: [], 
      searchValue: '', // 查询内容框
      bol: false, // 搜索框状态变化标识
      bar: false, // 跑腿服务按钮显示标识
      histHover: '', // 历史搜索框关闭标识
      letterNum: 0, // 会话数量
      messageNum: 0, // 系统通知数量
      seeChatLetterQ: false, // 私信会话节流标识
      seeSysNoticeQ: false, // 系统通知节流标识
      userAvatar: '', // 用户头像
      loginedState: false, // 登陆状态标识
      loginDialogVisible: false,  // 登陆对话框标识
      lightDemandDialog: false, // 轻需求对话框标识
      loginView: 1, // 登陆对话框展示视图标识
      verifyWord: '获取验证码',
      getVerifyLimit: 5,  // 验证码获取周期
      isSend: false,  // 验证码获取标识
      verifyCD: null, // 验证码获取重置状态标识
      verifyCode: 0, // 验证码 
      messageType: 0, 
      messageNotice: [false, false, false],
      // 轻需求表单项
      releaseForm: {
          content: '',
          addNotes: '',
          reward: 1,
          university: ''
        },
      // 表单验证规则
      releaseFormRules: {
        content: [
          { validator: SWFilter, required: true, trigger: 'blur' }
        ],
        addNotes: [
          { validator: SWFilter, required: true, trigger: 'blur' }
        ],
        educ: [
          { validator: SWFilter_edu, required: true, trigger: ['blur','change'] }
        ]
      },
      // 高校选择
      edus: ['广东工业大学','华南师范大学','广州大学','广州第二师范学院','中山大学','东莞理工学院'],
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
      // 系统通知内容
      sysMessageList: [[],[],[]]
    }
  },
  watch: {
    '$store.state.account.avatar': function(newVal) {
      if(Object.keys(newVal).length === 0) return;
      this.userAvatar = 'data:'+ newVal.mimetype +';base64,'+ newVal.base64;
    },
    '$store.state.showLoginedDialog': function(newVal) {
      this.loginDialogVisible = true;
    },
    '$store.state.notice.chat': function() {
      if(this.$route.path.includes('/letters')) {
        return;
      }
      this.letterNum += 1;
    },
    systemNotice: {
      handler: function(newVal, oldVal) {
        this.messageNum += (newVal[0] - oldVal[0] + newVal[1] - oldVal[1] + newVal[2] - oldVal[2]);
        (oldVal[0] != newVal[0] && newVal[0] != 0) && (this.messageNotice[0] = true);
        (oldVal[1] != newVal[1] && newVal[0] != 0) && (this.messageNotice[1] = true);
        (oldVal[2] != newVal[2] && newVal[0] != 0) && (this.messageNotice[2] = true);
      },
      deep: true
    }
  },
  computed: {
    loginDialogTitle() {
      if(this.loginView == 2) return '账密登录';
      else if(this.loginView == 3) return '手机重置密码';
      else return '手机登录';
    },
    showLightDemandBtn() {
      return this.bar ? 'visibility: visible;' : '';
    },
    // 数据同源问题，用于监听store.state.notice.system 中新旧值的变化
    systemNotice() {
      return JSON.parse(JSON.stringify(this.$store.state.notice.system));
    }
  },
  methods: {
    preventDefault() {
      event.preventDefault();
    },
    openLightDemandDialog() {
      event.stopPropagation();
      if(!this.loginedState) {
        this.loginDialogVisible = true;
        return;
      }else {
        this.lightDemandDialog = true;
      }
    },
    // 发布内容
    releaseLightDemand() {
      this.$refs['releaseForm'].validate(valid => {
        if(valid) {
          if(this.$store.state.account.account - this.releaseForm.reward < 0) {
            this.$message.error('余额不足！');
            return;
          }
          let { _id, avatar, name, phoneNumber} = JSON.parse(localStorage.getItem('baseMess'));
          let Sponsor = {
            _id,
            avatar,
            name,
            phoneNumber
          };
          let timestamp = getFormateDate('Y/M/d h:m');
          let start = { timestamp, content: '订单创建成功'};
          let activities = localStorage.getItem('activities');
          releaseLightDemand({data: this.releaseForm, Sponsor, start, activities})
          .then(res => {
            if(res.data.message == 'success') {
              this.lightDemandDialog = false;
              this.releaseForm = {
                content: '',
                addNotes: '',
                reward: 1,
                university: ''
              },
              this.$router.push('/fastservice/' + res.data.url);  
            }
            else {
              this.$message.error('服务器错误，稍后重试');
            }
          })
          .catch(err => {
            console.log(err);
          })
        }else {
          return false;
        }
      })
      
    },
    // 查询内容
    search() {
      event.preventDefault();
      if(this.searchValue == '') return;
      this.bol = false;
      let options = {
        account: localStorage.getItem('account'),
        type: true,
        keyword: this.searchValue
      };
      updateSearchHist(options)
      .then(res => {
        if(res.data.message == 'success') {
          document.querySelector('.inline-input').querySelector('input').blur();
          this.outPopover();
          if(res.data.state != 0) { 
            this.searchHist.unshift({'value': this.searchValue});
          }
          this.$router.push({path:'/index/search', query: {query: this.searchValue}});
        }
      })
      .catch(err => {
        console.log(err);
      })
    },
    // 加载查询历史
    loadSearchHist() {
      getSearchHist({account: localStorage.getItem('account')})
      .then(res => {
        this.searchHist = res.data;
      })
      .catch(err => {
        console.log(err);
      })
    },
    // 删除搜索历史
    deleteHist(hist) {
      document.querySelector('.inline-input').querySelector('input').focus();
      event.preventDefault();
      event.stopPropagation();
      let options = {
        account: localStorage.getItem('account'),
        type: false,
        keyword: hist
      };
      updateSearchHist(options)
      .then(res => {
        if(res.data.message == 'success') {
          for(let i in this.searchHist) {
            if(this.searchHist[i].value == hist) {
              this.searchHist.splice(i, 1);
            }
          }
        }
      })
      .catch(err => {
        console.log(err);
      })
    },
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
      let searchHist = this.searchHist;
      let res = queryString ? searchHist.filter(this.createFilter(queryString)) : searchHist;
      // 调用 callback 返回建议列表的数据
      cb(res);
    },
    // 搜索框数据过滤
    createFilter(queryString) {
      return res => res.value.toLowerCase().includes(queryString.toLowerCase());
    },
    // 登录成功后初始化用户本地缓存数据
    async initLoginUser(params) {
      const { account, token } = params;
      return await confirmLoginedMes({account, token})
      .then(res => {
        if(res.data.message == 'success') {
          localStorage.setItem('baseMess', JSON.stringify(res.data.baseMess));
          localStorage.setItem('account', res.data.baseMess._id);
          cookieFun.setCookie('token',token, 30);
          localStorage.setItem('drafts', res.data.baseMess.drafts);
          localStorage.setItem('release', res.data.baseMess.release);
          localStorage.setItem('activities', res.data.baseMess.activities);
          return 'success';
        }else {
          return 'false';
        }
      })
      .catch(err => console.log(err))
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
          else {
            const loginPhone = this.loginFormPhone.loginPhone;
            loginByPhone({loginPhone})
            .then(res => {
              if(this.loginFormPhone.loginVerifyCode != this.verifyCode) {
                this.$message.error('验证码校验失败');
              }else if(res.data.message == 'success'){
                this.initLoginUser({'account': res.data.data, 'token': res.data.token})
                .then(res => {
                  if(res == 'success') {
                    window.location.reload();
                  }else {
                    this.$message.error('登录失败');
                  }
                })
              }else {
                this.$message.error(res.data.message);
              }
            })
            break; 
          }
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
              this.initLoginUser({'account': res.data.data, 'token': res.data.token})
                .then(res => {
                  console.log(res);
                  if(res == 'success') {
                    window.location.reload();
                  }else {
                    this.$message.error('登录失败');
                  }
                })
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
    },
    // 手机登录验证码获取请求
    verifyRequest() {
      switch(this.loginView) {
        case 1:
          if(this.getVerifyLimit == 5) {
            if(this.loginFormPhone.loginPhone === '') break;
            else {
              this.verifyCode = Math.floor((Math.random() * 9000) + 1000);
              this.$message.success({
                message: `验证码已发送！验证码为 ${this.verifyCode}`,
                type: 'success'
              });
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
              this.verifyCode = Math.floor((Math.random() * 9000) + 1000);
              this.$message.success({
                message: `验证码已发送！验证码为 ${this.verifyCode}`,
                type: 'success'
              });
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
          localStorage.removeItem('baseMess');
          localStorage.removeItem('account');
          localStorage.removeItem('release');
          localStorage.removeItem('drafts');
          localStorage.removeItem('activities');
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
      if(!(this.$route.path.includes('index') || this.$route.path.includes('post')) || this.bol) return;
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
        let account = this.$store.state.account._id;
        this.$router.push('/personal/' + account + '/settings/profile');
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
    changeMessageType(index) {
      if(index == this.messageType) {
        return;
      }
      this.messageType = index;
      this.seeSysNotice(index);
    },
    seeChatLetter() {
      if(this.seeChatLetterQ) {
        return;
      }
      this.seeChatLetterQ = true;
      getChatMessage({account: localStorage.getItem('account')})
        .then(res => {
          this.seeChatLetterQ = false;
          this.chatMessageList = res.data;
          this.letterNum = 0;
        })
        .catch(err => {
          console.log(err);
        })
    },
    seeSysNotice(type) {
      if(this.seeSysNoticeQ) {
        return;
      }
      this.seeSysNoticeQ = true;
      getSysMessage({account: localStorage.getItem('activities'), type })
        .then(res => {
          this.sysMessageList[type] = res.data;
          this.messageNotice[type] = false;
          this.$store.commit('updateSysNotice', type);
          this.seeSysNoticeQ = false;
          this.$forceUpdate();
        })
        .catch(err => {
          console.log(err);
        })
    
    },
    // 初始化导航栏内容
    load() {
      // 返回搜索框的热点推荐数据
      // this.hotSearch = this.loadAll();
      // 是否已登录？true 则加载个人私人数据
      this.loginedState = cookieFun.getCookie('token') ? true : false;
      if(this.loginedState) {
        this.loadSearchHist();
      }
      document.addEventListener('scroll',this.pickUpMainNav);

    },
    showTab() {
      console.log('嘿嘿');
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