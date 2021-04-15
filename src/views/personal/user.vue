<template>
  <section class="clear">
    <div class="container" v-if="Object.keys(showInfo)">
      <div class="main">
        <div class="userInfo block">
          <div class="avatar"><img src="@/assets/head-pic.png" alt="avatar"></div>
          <div class="infoBox">
            <div class="top"><h1>{{showInfo.account.name}}</h1></div>
            <div class="bottom">
              <ul>
                <li>
                  <i class="el-icon-school icon" />
                  <span class="content">{{showInfo.account.school}}</span>
                </li>
                <li>
                  <i class="el-icon-postcard icon" />
                  <span class="content">{{showInfo.account.introduction}}</span>
                </li>
              </ul>
            </div>
          </div>
          <div class="actionBox">
            <el-button type="primary" size="small" :plain="isfollowUserList[showInfo.account._id]"
              @click="followUser(showInfo.account._id, showInfo.account.name, showInfo.account.avatar)"
            >{{isfollowUserList[showInfo.account._id] ? '取消关注' : '关注'}}</el-button>
          </div>
        </div>
        <div class="list block">
          <div class="list-header">
            <el-menu :default-active="currentPath" router mode="horizontal" active-text-color="#fAAf00">
              <el-menu-item v-for="item in activeNav" 
              :key="item.name" 
              :index="item.link"
              :route="pathList[item.link]">
                {{item.name}}
              </el-menu-item>
            </el-menu>
          </div>
          <div class="list-body">
            <router-view/>
          </div>
        </div>
      </div>
      <div class="right">
        <div class="right-top">
          <div @click="JumpPage('/follows')">
            <span>关注</span>
            <span>{{showInfo.followCount}}</span>
          </div>
          <div @click="JumpPage('/fans')">
            <span>粉丝</span>
            <span>{{showInfo.fansCount}}</span>
          </div>
        </div>
        <div class="right-below">
          <div class="right-below-nav">
              <ul class="right-below-ul">
                  <li>
                      <i class="el-icon-star-on"></i>
                      <span>我的收藏</span>
                      <span class="right-below-ul-num">0</span>
                  </li>
              </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
  
</template>

<script>
import {userCenterMess, followAuthor} from '@/axios/request';

export default {
  name: 'Personal',
  data() {
    return {
      basePath: '', // 需要动态生成个人主页基路径
      // 个人主页展示导航栏菜单
      activeNav: [
        {name: '动态', link: 'activities'},
        {name: '发布', link: 'release'},
        {name: '赞 ', link: 'likes'},
      ],
      // 个人主页展示内容
      showInfo: {},
			isfollowUserList: {}
    }
  },
  computed: {
    // 设置默认入口的当前导航栏选中者
    currentPath() {
      return this.$route.path.split('/')[3] ? this.$route.path.split('/')[3] : 'activities';
    },
    // 定义导航栏的菜单链接
    pathList() {
      return {
        activities: this.basePath + '/activities',
        release: this.basePath + '/release',
        likes: this.basePath + '/likes',
      }
    }
  },
  methods: {
    // 展示块航路由跳转
    JumpPage(url) {
      if(url == '/settings/') {
        this.$router.push(this.basePath + url + 'profile');
      }
      else {
        this.$router.push(this.basePath + url);
      }
    },
    load() {
      userCenterMess({
        account: this.$route.params.id
      })
      .then(res => {
        this.showInfo.account = res.data.account[0];
        this.showInfo.followCount = res.data.follow;
        this.showInfo.fansCount = res.data.fans;
        for(let i of this.$store.state.followList) {
          this.isfollowUserList[i] = true;
        }
      })
    },
    // 关注用户
    followUser(id, name, avatar) {
      let params = {
        account: id,
				name: name,
				avatar: avatar,
      };
			let type = this.isfollowUserList[id] ? 'cancel' : '';
      followAuthor({key: this.$store.state.account.follow, follow: params, type: type})
      .then(res => {
				console.log(res);
				if(res.data.message == 'success') {
					let option = this.isfollowUserList[id] ? true : false;
					this.$store.commit('updateFollowList', [id, option]);
					this.$set(this.isfollowUserList, id, !option);
				}
      })
      .catch(err => {
        console.log(err);
      })
    },
  },
  created() {
    this.load();
    this.basePath = '/personal/' + this.$route.params.id;
    console.log(this.$route.params.id);
    console.log(this.basePath);
  }
}

</script>
<style lang="scss" scoped>
@import '@/style/commonValue';
@import '@/style/personal';

.main {
	@include content_main;
}
</style>