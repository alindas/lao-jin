<template>
  <div class="content">
    <header>
      <div class="container clear">
        <div class="pic">
          <a href="/">
            <img src="~@/assets/logo.png" alt="logo">
          </a>
        </div>
        <i class="flag"></i>
        <div class="pagetitle">
          <span>草稿箱</span>
        </div>
        <div class="menu">
          <div class="action">
            <el-button type="primary" plain @click="JumpPage('/others/release')">
              <i class="el-icon-edit-outline"></i>&nbsp;发布兼职
            </el-button>
          </div>
          <div class="more">
            <el-dropdown trigger="click" placement="top">
              <span class="el-dropdown-link" title="更多">
                <i class="el-icon-more "></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <a @click="myRelease">我的发布</a>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
      </div>
    </header>
    <section class="clear">
      <div class="container">
        <div class="drafts">
          <div class="empty-item" v-if="Object.keys(draftsList).length == 0">草稿箱为空</div>
          <div class="item" v-for="item in draftsList" :key="item.key">
            <router-link :to="'/others/release?id=' + item.key" class="title">{{item.title ? item.title : '无标题'}}</router-link>  
            <div class="meta">
              <el-tooltip effect="dark" :content="item.releaseDate" placement="bottom">
                <div class="time">{{writeTime(item.releaseTime)}}</div>
              </el-tooltip>
              <div class="separator">·</div>
              <button class="action" @click="deleteDrafts(item.key)">删除</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { getCenterMessage, deleteCenterMessage } from '@/axios/request';
import showTime from '@/utils/showTime';


export default {
  name: 'drafts',
  computed: {
  },
  data() {
    return {
      draftsList: {}, // 用户草稿内容
    }
  },
  methods: {
    // 草稿删除
    deleteDrafts(key) {
      this.$confirm('是否删除该草稿?', '删除草稿', {
        confirmButtonText: '确定',
        confirmButtonClass: 'confirmButton',
        cancelButtonText: '取消',
        cancelButtonClass: 'cancelButton',
        center: true,
        showClose: false,
        closeOnClickModal: false,
        customClass: 'draftsRemoveDialog'
      })
      .then(() => {
        deleteCenterMessage({
          account: localStorage.getItem('drafts'),
          deleteKey: key,
          type: "drafts" })
        .then(res => {
          if(res.data.message == 'success') {
            this.$message({
              message: '删除成功',
              type: 'success'
            });
            delete this.draftsList[key];
            this.$forceUpdate();
          }
          else {
            this.$message.error('删除失败，请稍后重试');
          }
        })
        .catch(err => {
          this.$message.error('服务器错误，请稍后重试');
        })
      })
      .catch(() => {
        console.log('已取消删除');
      })
    },
    // 获取草稿发布时间差
    writeTime(time) {
      return showTime(time);
      
    },
    // 导航栏菜单跳转
    JumpPage(url) {
      this.$router.push(url);
    },
    // 返回我的主页并显示发布内容
    myRelease() {
      window.location.href = '/personal/'+ localStorage.getItem('account') +'/release';
    },
    load() {
      getCenterMessage({type: 'drafts', key: localStorage.getItem('drafts')})
        .then(res => {
          console.log(res);
          this.draftsList = res.data;
        })
        .catch(err => {
          console.log(err);
        })
    }
  },
  created() {
    this.load();
  }
}

</script>
<style lang="scss" scoped>
@import '@/style/commonValue';
@import '@/style/othersMain';

</style>