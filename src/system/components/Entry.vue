<template>
  <div class="entry-container" ref="container">
    <div class="entry-main">
      <div class="logo">
        <div class="avatar" ref="avatar"></div>
      </div>
      <div class="login">
        <div class="login-content">
          <div class="login-header">
            <div class="avatar"><i class="el-icon-user"></i></div>
          </div>
          <div class="login-form">
            <form>
              <div class="username">
                <div class="container">
                  <input type="text" v-model="username" placeholder="输入用户账号" autocomplete="off">
                </div>
              </div>
              <div class="password">
                <div class="container">
                  <input :type="pawdType ? 'password' : 'text'" v-model="password" placeholder="密码" autocomplete="off" @keyup.enter="login"> 
                  <span class="icon input-icon" @click="changeVisible"><icon :name="Visible ? 'OEye' : 'CEye'" scale="100"></icon></span>
                </div>
              </div>
            </form>
          </div>
          <div class="button">
            <button class="login-btn" @click="login">
              登录
            </button>
          </div>
          
        </div>
      </div>
    </div>
  </div>
  
</template>

<script>
import {systemLogin} from '@/axios/request'
import { setCookie } from '@/utils/cookie'


export default {
  name: 'Entry',
  data() {
    return {
      username: '',
      password: '',
      pawdType: true,
      Visible: true
    }
  },
  mounted() {
    this.$refs.container.style.background = "url(" + require('@/assets/systemEntry.jpg') + ")";
    this.$refs.avatar.style.background = "url(" + require('@/assets/systemLogo.png') + ")";
  },
  methods: {
    changeVisible() {
      this.pawdType = !this.pawdType;
      this.Visible = !this.Visible;
    },
    login() {
      if(!this.username || !this.password) {
        this.$message.warning('账号信息不能为空');
        return;
      }else {
        const loading = this.$loading({
          lock: true,
          text: '登录中…',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        setTimeout(() => {
          systemLogin({name:this.username, pawd: this.password})
          .then(res => {
            loading.close();
            if(res.data.type == 'success') {
              setCookie('manage', this.username);
              this.$router.push({name: 'SysHome'})
            }else {
              this.$message.error(res.data.mess)
            }
          })
        }, 1000)
        
      }
    }
  }
}

</script>
<style lang="scss">
  @import '@/system/style/entry';

  
</style>