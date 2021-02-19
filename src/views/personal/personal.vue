<template>
  <section class="clear">
    <div class="container">
      <div class="main">
        <div class="userInfo block">
          <div class="avatar"><img src="@/assets/head-pic.png" alt="avatar"></div>
          <div class="infoBox">
            <div class="top"><h1>{{showInfo.name}}</h1></div>
            <div class="bottom">
              <ul>
                <li>
                  <i class="el-icon-school icon" />
                  <span class="content">{{showInfo.school}}</span>
                </li>
                <li>
                  <i class="el-icon-postcard icon" />
                  <span class="content">{{showInfo.introduction}}</span>
                </li>
              </ul>
            </div>
          </div>
          <div class="actionBox">
            <el-button plain @click="JumpPage('/personal/settings/')">编辑个人资料</el-button>
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
          <div>
            <span>关注</span>
            <span>{{followCount}}</span>
          </div>
          <div>
            <span>粉丝</span>
            <span>{{fansCount}}</span>
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
                  <li>
                      <i class="el-icon-question"></i>
                      <span>我关注的问题</span>
                      <span class="right-below-ul-num">0</span>
                  </li>
                  <li>
                      <i class="el-icon-plus"></i>
                      <span>我的邀请</span>
                      <span class="right-below-ul-num">0</span>
                  </li>
                  <li>
                      <i class="el-icon-s-finance"></i>
                      <span>我的余额</span>
                  </li>
                  <li>
                      <i class="el-icon-s-operation"></i>
                      <span>站务中心</span>
                  </li>
                  <li>
                      <i class="el-icon-bangzhu"></i>
                      <span>帮助中心</span>
                  </li>
                  <li>
                      <i class="el-icon-key"></i>
                      <span>版权服务中心</span>
                  </li>
              </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
  
</template>

<script>

export default {
  name: 'Personal',
  data() {
    return {
      basePath: '', // 需要动态生成个人主页基路径
      // 个人主页展示导航栏菜单
      activeNav: [
        {name: '动态', link: 'activities'},
        {name: '发布', link: 'release'},
        {name: '草稿 ', link: 'drafts'},
        {name: '赞 ', link: 'likes'},
      ],
      // 个人主页展示内容
      showInfo: {}
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
        drafts: this.basePath + '/drafts',
        likes: this.basePath + '/likes',
      }
    },
    // 返回关注数量
    followCount() {
      return this.$store.state.followList.length;
    },
    // 返回粉丝数量
    fansCount() {
      return this.$store.state.fansCount;
    }
  },
  methods: {
    // 展示块航路由跳转
    JumpPage(url) {
      if(url.includes('settings')) {
        this.$router.push(url + 'profile');
      }
      else {
        this.$router.push(url);
      }
    },
    load() {
      this.showInfo = this.$store.state.account;
    }
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