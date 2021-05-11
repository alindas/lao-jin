<template>
  <section class="clear">
    <div class="container" v-if="dataInit">
      <div class="main">
        <div class="userInfo block">
          <div class="avatar"><img :src="userAvatar" alt="avatar"></div>
          <div class="infoBox">
            <div class="top"><h1>{{showInfoBase.name}}</h1></div>
            <div class="bottom">
              <ul>
                <li>
                  <i class="el-icon-school icon" />
                  <span class="content">{{showInfoBase.school}}</span>
                </li>
                <li>
                  <i class="el-icon-postcard icon" />
                  <span class="content">{{showInfoBase.introduction}}</span>
                </li>
              </ul>
            </div>
          </div>
          <div class="actionBox">
            <button 
              class="action-btn follow-btn"
              :style="isfollow ? {} : {'background-color': '#fff', 'color': '#fAAf00', 'border-color': '#fAAf00' }"
              @click="followUser(showInfoBase._id, showInfoBase.name, showInfoBase.avatar)"
              >
              {{isfollow ? '取消关注' : '关注'}}
            </button>
            <button 
              class="action-btn chat-btn"
              @click="goChat"
              >
              <i class="el-icon-chat-line-round"></i>
            </button>
          </div>
        </div>
        <div class="empty-list block">
          <img src="https://gw.alicdn.com/imgextra/i3/O1CN01DKaORe1dcIHH0eMRx_!!6000000003756-55-tps-164-142.svg" alt="">
        </div>
      </div>
      <SidebarLayout 
        :page-y-offset = "188"
        fixed-distance = "40%"
        >
        <template v-slot:top>
          <div class="right-top">
            <div class="author-title">用户荣誉</div>
            <div class="author-body">
               <div class="first-item item">
                <i class="el-icon-view"></i>
                <span class="content">关注数量<span class="count">{{showInfoHonor[0]}}</span></span>
              </div>
              <div class="stat-item item">
                <i class="el-icon-user"></i>
                <span class="content">粉丝数量<span class="count">{{showInfoHonor[1]}}</span></span>
              </div>
              <div class="stat-item item">
                <i class="lj-icon-dianzanqian"></i>
                <span class="content">获得点赞<span class="count">{{showInfoHonor[3]}}</span></span>
              </div>
              <div class="stat-item item">
                <i class="el-icon-magic-stick"></i>
                <span class="content">兼职发布数量<span class="count">{{showInfoHonor[2]}}</span></span>
              </div>
            </div>
          </div>
        </template>
        <template v-slot:common>
          <AppLinks />
        </template>
      </SidebarLayout>
    </div>
  </section>
  
</template>

<script>
import {userCenterMess, followAuthor, createNewChat} from '@/axios/request';
import SidebarLayout from '@/components/sidebar/SidebarLayout';
import AppLinks from '@/components/sidebar/appLinks';
import isLogined from '@/utils/getAuthority'


export default {
  name: 'user',
  beforeRouteEnter(to, from, next) {
    document.title = `${to.params.id}的个人主页`;
    next();
  },
  data() {
    return {
      dataInit: false,
      basePath: '', // 需要动态生成个人主页基路径
      // 个人主页展示内容
      showInfoBase: {},
      showInfoHonor: []
    }
  },
  components: {
    SidebarLayout,
    AppLinks
  },
  computed: {
    userAvatar() {
      return `data:${this.showInfoBase.avatar.mimetype};base64,${this.showInfoBase.avatar.base64}`;
    },
    isfollow() {
      for(let i of this.$store.state.followList) {
        if(i == this.$route.params.id) return true;
      }
      return false;
    }
  },
  methods: {
    load() {
      if(this.$route.params.id === this.$store.state.account._id) {
        this.$router.push({name: 'personal', params: {id: this.$route.params.id}});
        return;
      }
      userCenterMess({
        account: this.$route.params.id
      })
      .then(res => {
        this.showInfoBase = res.data.basics;
        this.showInfoHonor = res.data.honor;
        this.dataInit = true;
      })
    },
    // 关注用户
    followUser(id, name, avatar) {
      if(!isLogined.call(this)) return;
      let params = {
        account: id,
				name: name,
				avatar: avatar,
      };
			let type = this.isfollow ? 'cancel' : '';
      followAuthor({myself: this.$store.state.account._id, followKey: this.$store.state.account.follow, follow: params, type: type})
      .then(res => {
				console.log(res);
				if(res.data.message == 'success') {
					let option = this.isfollow ? true : false;
					this.$store.commit('updateFollowList', [id, option]);
				}
      })
      .catch(err => {
        console.log(err);
      })
    },
    // 前往沟通
    goChat() {
      if(!isLogined.call(this)) return;
      const sponsor = {
        name: this.showInfoBase.name,
        avatar: this.showInfoBase.avatar,
        _id: this.showInfoBase._id
      }
      let { name, avatar, _id } = this.$store.state.account;
      const receiver = {
        name,
        avatar,
        _id
      };
      createNewChat({
        sponsor,
        receiver
      })
      .then(res => {
        console.log(res.data.chat);
        this.$router.push({
          name: 'lettersWKey',
          params: {
            key: res.data.chat._id
          }
        })
      })
    }
  },
  created() {
    this.load();
    this.basePath = '/users/' + this.$route.params.id;
    console.log(this.$route.params.id);
    console.log(this.basePath);
  }
}

</script>
<style lang="scss" scoped>
@import '@/style/commonValue';
@import '@/style/users';


.main {
	@include content_main;
}
</style>