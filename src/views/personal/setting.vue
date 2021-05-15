<template>
  <div>
    <div class="subnav">
      <div class="container clear">
        <el-menu :default-active="this.$route.path" router class="el-menu-demo" mode="horizontal" active-text-color="#fAAf00">
          <el-menu-item v-for="item in subnav" :key="item.name" :index="item.path">{{item.name}}</el-menu-item>
        </el-menu>
      </div>
    </div>
    <section>
      <div class="container">
        <div class="main">
          <div class="setting-view profile" v-if="view == 0">
            <h1>个人资料</h1>
            <ul class="settings-list">
              <li class="item">
                <span class="title">头像</span>
                <div class="input-box">
                  <img :src="userAvatar" class="avatar">
                  <div class="action-box">
                    <el-upload
                      action="http://120.79.2.17:8848/users/avatar"
                      name="avatar"
                      :data="accountID"
                      :show-file-list="false"
                      :on-success="handleAvatarSuccess"
                      :before-upload="beforeAvatarUpload">
                      <el-button size="small" type="primary">点击更换</el-button>
                      <div slot="tip" class="el-upload__tip">支持 jpg、png、jpeg 格式大小 2M 以内的图片</div>
                    </el-upload>
                  </div>
                </div>
              </li>
              <li class="item">
                <span class="title">用户名</span>
                <div class="input-box">
                  <input type="text" spellcheck="false" placeholder="填写你的用户名" :value="userInfo.name"
                  class="input" @focus="actionBoxId = 1" @blur="cancel(1,'name')" @keydown.enter="save(1,'name')">
                </div>
                <div class="action-box" v-if="actionBoxId === 1">
                  <el-button type="text" @click="save(1,'name')">保存</el-button>
                  <el-button type="text">取消</el-button>
                </div>
                <div class="action-box" v-else><el-button type="text" icon="el-icon-edit" @click="modify(1)">修改</el-button></div>
              </li>
              <li class="item">
                <span class="title">学校</span>
                <div class="input-box">
                  <input type="text" spellcheck="false" placeholder="填写你的学校" :value="userInfo.school"
                  class="input" @focus="actionBoxId = 2" @blur="cancel(2,'school')" @keydown.enter="save(2,'school')">
                </div>
                <div class="action-box" v-if="actionBoxId === 2">
                  <el-button type="text" @click="save(2,'school')">保存</el-button>
                  <el-button type="text">取消</el-button>
                </div>
                <div class="action-box" v-else><el-button type="text" icon="el-icon-edit" @click="modify(2)">修改</el-button></div>
              </li>
              <li class="item">
                <span class="title">专业</span>
                <div class="input-box">
                  <input type="text" spellcheck="false" placeholder="填写你的专业" :value="userInfo.profession" 
                  class="input" @focus="actionBoxId = 3" @blur="cancel(3,'profession')" @keydown.enter="save(3,'profession')">
                </div>
                <div class="action-box" v-if="actionBoxId === 3">
                  <el-button type="text" @click="save(3,'profession')">保存</el-button>
                  <el-button type="text" >取消</el-button>
                </div>
                <div class="action-box" v-else><el-button type="text" icon="el-icon-edit" @click="modify(3)">修改</el-button></div>
              </li>
              <li class="item">
                <span class="title">个人介绍</span>
                <div class="input-box">
                  <input type="text" spellcheck="false" placeholder="填写擅长的事情、兴趣爱好等" :value="userInfo.introduction" 
                  class="input" @focus="actionBoxId = 4" @blur="cancel(4,'introduction')" @keydown.enter="save(4,'introduction')">
                </div>
                <div class="action-box" v-if="actionBoxId === 4">
                  <el-button type="text" @click="save(4,'introduction')">保存</el-button>
                  <el-button type="text" >取消</el-button>
                </div>
                <div class="action-box" v-else><el-button type="text" icon="el-icon-edit" @click="modify(4)">修改</el-button></div>
              </li>
            </ul>
          </div>
          <div class="setting-view account" v-else-if="view == 1">
            <h1>账号设置</h1>
            <ul class="settings-list">
              <li class="item">
                <span class="title">手机</span>
                <div class="input-box">
                  <span class="content-box">{{userInfo.phoneNumber}}</span> 
                </div>
                <div class="action-box"><el-button type="text" @click="showDialog(1)">绑定</el-button></div>
              </li>
              <li class="item">
                <span class="title">微信</span>
                <div class="input-box">
                  <span class="content-box">{{userInfo.weChat}}</span> 
                </div>
                <div class="action-box"><el-button type="text" @click="notOpen">绑定</el-button></div>
              </li>
              <li class="item">
                <span class="title">QQ</span>
                <div class="input-box">
                  <span class="content-box">{{userInfo.QQ}}</span> 
                </div>
                <div class="action-box"><el-button type="text" @click="notOpen">绑定</el-button></div>
              </li>
              <li class="item">
                <span class="title">密码</span>
                <div class="input-box" />
                <div class="action-box"><el-button type="text" @click="showDialog(2)">重置</el-button></div>
              </li>
              <li class="item">
                <span class="title">账号注销</span>
                <div class="input-box" />
                <div class="action-box"><el-button type="text" @click="notOpen">注销</el-button></div>
              </li>
            </ul>
          </div>
          <div class="setting-view system" v-else>
            <h1>消息通知</h1>
            <ul class="settings-list">
              <li class="item">
                <span class="title">系统消息</span>
                <div class="input-box">
                  <span class="content-box">建议保持开启以免错过重要内容通知</span> 
                </div>
                <div class="action-box">
                  <el-switch
                    style="display: block"
                    v-model="userInfo.Notice[0]"
                    active-color="#fAAf00"
                    inactive-color="#bfbfbf"
                    @change="updateNotice"
                    >
                  </el-switch>
                </div>
              </li>
              <li class="item">
                <span class="title">代办任务</span>
                <div class="input-box"></div>
                <div class="action-box">
                  <el-switch
                    style="display: block"
                    v-model="userInfo.Notice[1]"
                    active-color="#fAAf00"
                    inactive-color="#bfbfbf"
                    @change="updateNotice"
                    >
                  </el-switch>
                </div>
              </li>
              <li class="item">
                <span class="title">用户私信</span>
                <div class="input-box"></div>
                <div class="action-box">
                  <el-switch
                    style="display: block"
                    v-model="userInfo.Notice[2]"
                    active-color="#fAAf00"
                    inactive-color="#bfbfbf"
                    @change="updateNotice"
                    >
                  </el-switch>
                </div>
                
              </li>
            </ul>
          </div>
          <el-dialog :visible.sync="resetDialogVisible" width="25%" :modal-append-to-body="false"
            :close-on-click-modal="false" @close="closeDialog">
            <h3 slot="title">{{resetDialogTitle}}</h3>
            <div v-if="resetView == 1">
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
                  <el-button type="primary" @click="resetRequest">绑定</el-button>
                </el-form-item>
              </el-form>
            </div>
            <div v-else>
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
                  <el-button type="primary" @click="resetRequest">修改</el-button>
                </el-form-item>
              </el-form>
            </div>
          </el-dialog>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { updateSetting } from '@/axios/request';

export default {
  name: 'Setting',
  data() {
    return {
      imageUrl: '',
      view: 0,
      actionBoxId: -1,
      resetDialogVisible: false,
      resetView: -1,
      verifyWord: '获取验证码',
      getVerifyLimit: 5,
      isSend: false,
      verifyCD: null,
      subnav: [
        {name: '<返回个人主页',path: ''}
      ],
      userInfo: {},
      loginFormPhone: {
        loginPhone: '',
        loginVerifyCode: '',
      },
      forgetForm: {
        forgetId: '',
        forgetVerifyCode: '',
        newPassword: '',
      },
      debounce: false, // 用户更新设置防抖标记
    }
  },
  computed: {
    accountID() {
      return { id: this.$store.state.account._id };
    },
    userAvatar() {
      return 'data:'+this.userInfo.avatar.mimetype+';base64,'+this.userInfo.avatar.base64;
    },
    resetDialogTitle() {
      if(this.resetView == 1) return '手机绑定';
      else return '手机重置密码';
    },
  },
  methods: {
    notOpen() {
      this.$message.info('尚未开发');
    },
    // 头像文件成功上传的回调
    handleAvatarSuccess(res, file) {
      if(res.message == 'success') {
        this.$store.commit('updateAccountSingle',['avatar',res.data]);
        this.userInfo.avatar = res.data;
        this.$notify.success({
          title: '头像更换成功',
          showClose: false,
          duration: 2000
        })
      }
      else {
        this.$notify.error({
          title: res.message,
          showClose: false,
          duration: 2000
        })
      }
    },
    // 头像文件上传前的回调
    beforeAvatarUpload(file) {
      // const correctFormat = (file.type === 'image/jpeg' || file.type === 'image/png');
      const correctFormat = /^image\//.test(file.type);
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!correctFormat) {
        this.$notify.error({
          title: '上传头像图片仅支持 JPG JPEG PNG 格式!',
          showClose: false,
          duration: 2000
        });
      }
      if (!isLt2M) {
        this.$notify.error({
          title: '上传头像图片大小不能超过 5MB!',
          showClose: false,
          duration: 2000
        });
      }
      return correctFormat && isLt2M;
    },
    // 个人资料订正操作
    modify(id) {
      let text = document.querySelector('section').querySelector('.settings-list').querySelectorAll('input')[id];
      text.value ? text.select() : text.focus();
      this.actionBoxId = id;
    },
    save(id,value) {
      this.actionBoxId = -id;
      let text = document.querySelector('section').querySelector('.settings-list').querySelectorAll('input')[id];
      text.blur();
      if(text.value == this.userInfo[value]) return;
      let initialVal = this.userInfo[value];
      this.userInfo[value] = text.value;
      /**
       * 网络请求更新后台数据库信息
       */
      updateSetting({ _id: this.userInfo._id, key: value, value: this.userInfo[value] })
      .then(res => {
        if(res.data.message == 'success') {
          this.$store.commit('updateAccountSingle',[value,this.userInfo[value]]);
          this.$notify.success({
            title: '更新成功',
            showClose: false,
            duration: 2000
          });
        }
        else {
          this.userInfo[value] = initialVal;
          this.$notify.error({
            title: res.data.message,
            showClose: false,
            duration: 2000
          });
        }
      })
      .catch(err => {
        this.userInfo[value] = initialVal;
        this.$notify.error({
          title: err,
          showClose: false
        });
      })
    },
    updateNotice() {
      if(this.debounce) {
        clearTimeout(this.debounce);
        this.debounce = null;
      }
      this.debounce = setTimeout(() => {
        updateSetting({ _id: this.userInfo._id, key: 'Notice', value: this.userInfo.Notice})
        .then(res => {
          if(res.data.message == 'success') {
            this.$store.commit('updateAccountSingle',['Notice',this.userInfo.Notice]);
            this.$notify.success({
            title: '更新成功',
            showClose: false,
            duration: 2000
            });
          }
          else {
            this.$notify.error({
            title: res.data.message,
            showClose: false,
            duration: 2000
            });
          }
        })
        .catch(err => {
          this.$notify.error({
            title: err,
            showClose: false,
            duration: 2000
          });
        })
      }, 800)
    },
    cancel(id,value) {
      setTimeout(() => {
        if(this.actionBoxId == id) {
          this.actionBoxId = -this.actionBoxId;
        }
        else if(this.actionBoxId == -this.actionBoxId) return;
        let text = document.querySelector('section').querySelector('.settings-list').querySelectorAll('input')[id];
        text.value = this.userInfo[value];
      },100)
    },
    // 展示对应的对话框
    showDialog(viewId) {
      this.resetDialogVisible = true;
      this.resetView = viewId;
    },
    // 关闭对话框后重置其输入信息
    closeDialog() {
      switch(this.resetView) {
        case 1: this.$refs.loginFormPhone.resetFields(); this.resetVerify(); break;
        case 2: this.$refs.forgetForm.resetFields(); this.resetVerify(); break;
        default: break;
      }
    },
    // 对话框的各种请求
    resetRequest() {
      switch(this.resetView) {
        case 1:
          if(this.loginFormPhone.loginPhone === '') {
            this.$message('请填写手机号');
            break;
          }
          else if(this.loginFormPhone.loginVerifyCode === '') {
            this.$message('请输入验证码');
            break;
          }
          this.$message.info('正在开发');
          /**
           * 网络请求
           */

          break; 
        case 2:
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
          this.$message.info('正在开发');
          /**
           * 网络请求
           */
          break; 
        default: 
          this.$message({message:'系统错误',type:'error'}); return;
      }
    },
    // 手机验证码获取请求
    verifyRequest() {
      switch(this.resetView) {
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
        case 2:
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
    // 重置验证码获取状态
    resetVerify() {
      clearInterval(this.verifyCD);
      this.verifyWord = '获取验证码';
      this.getVerifyLimit = 5;
      this.isSend = false;

    },
  },
  created() {
    this.userInfo = this.$store.state.account;
    this.subnav[1] = {
      name: '个人资料',
      path: '/personal/' + localStorage.getItem('account') + '/settings/profile'
    };
    this.subnav[2] = {
      name: '账号设置',
      path: '/personal/' + localStorage.getItem('account') + '/settings/account'
    };
    this.subnav[3] = {
      name: '消息通知',
      path: '/personal/' + localStorage.getItem('account') + '/settings/system'
    }
    if(this.$route.path.includes('profile')) {
      this.view = 0;
    }
    else if(this.$route.path.includes('account')) {
      this.view = 1;
    }
    else if(this.$route.path.includes('system')) {
      this.view = 2;
    }
    this.subnav[0].path = '/personal/' + this.$store.state.account._id;
  },
  mounted() {
    
  },
  updated() {
    if(this.$route.path.includes('profile')) {
      this.view = 0;
    }
    else if(this.$route.path.includes('account')) {
      this.view = 1;
    }
    else if(this.$route.path.includes('system')) {
      this.view = 2;
    }
  }
}

</script>
<style lang="scss" scoped>
@import '@/style/commonValue';
@import '@/style/settings';

.main {
	@include content_main;
}

</style>