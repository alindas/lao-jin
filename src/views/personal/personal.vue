<template>
  <section class="clear">
    <div class="container">
      <div class="main">
        <div class="userInfo block">
          <div class="avatar"><img :src="userAvatar" alt="avatar"></div>
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
            <el-button plain @click="JumpPage('/settings/')">编辑个人资料</el-button>
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
            <span>{{followCount}}</span>
          </div>
          <div @click="JumpPage('/fans')">
            <span>粉丝</span>
            <span>{{fansCount}}</span>
          </div>
        </div>
        <div class="right-below">
          <div class="right-below-nav">
            <ul class="right-below-ul">
              <li>
                <i class="el-icon-coin"></i>
                <span>我的金币</span>
                <i class="el-icon-plus recharge" title="充值" @click="reChargeDialog = true"></i>
                <span class="right-below-ul-num">{{showInfo.account}}</span>
              </li>
              <li>
                <i class="el-icon-star-on"></i>
                <span>我的收藏</span>
                <span class="right-below-ul-num">0</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <el-dialog
        :visible.sync="reChargeDialog"
        width="25%"
        :modal-append-to-body="false"
        :close-on-click-modal="false"
        :show-close="false"
        >
        <h3 slot="title" class="reChargeHeader">
          <span class="title">余额充值</span>
          <span>余额: {{showInfo.account}}</span>
        </h3>
        <div class="reCharge-content">
          <ul class="reCharge-selectlist">
            <li v-for="(item,index) in reChargeList" 
            :key="item" 
            @click="selectItem(index,item)" 
            :style="selectStyle(index)"
            class="reCharge-selectItem">
              <div>
                <span>{{item}}元</span>
                <span><b>{{item}}</b>枚金币</span>
              </div>
            </li>
          </ul>
        </div>
        <div class="reChargeFooter">
          <div class="inputBox">
            <label for="reChargeInput" class="inputInfo">自定义编辑充值金额（￥）</label>
            <input 
            type="text"
            v-model="reChargeValue"
            id="reChargeInput"/>
          </div>
          <div class="actionBox">
            <button @click="reChargeDialog = false">取 消</button>
            <button type="primary" @click="alipayRecharge">确 定</button>
          </div>
        </div>
      </el-dialog>
    </div>
  </section>
  
</template>

<script>
import {alipayRequest, updateUserAccount} from '@/axios/request';
import {nanoid} from 'nanoid';

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
      showInfo: {},
      selectIndex: 0, // 充值选择项
      reChargeDialog: false, // 充值对话框
      reChargeList: [1,5,10,20,50,200], // 充值选项列表
      reChargeValue: 1
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
    userAvatar() {
      return `data:${this.showInfo.avatar.mimetype};base64,${this.showInfo.avatar.base64}`;
    },
    // 返回关注数量
    followCount() {
      return this.$store.state.followList.length;
    },
    // 返回粉丝数量
    fansCount() {
      return this.$store.state.fansCount;
    },
    
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
    alipayRecharge() {
      let account = this.showInfo._id;
      let returnUrl = 'http://localhost:8080/personal/' + this.showInfo._id;
      let outTradeNo = nanoid();
      this.reChargeDialog = false;
      alipayRequest({ value: this.reChargeValue, returnUrl, outTradeNo})
      .then(res => {
        updateUserAccount({type: 'update', value: this.showInfo.account + this.reChargeValue, outTradeNo, account})
        .then(() => {
          window.location.href = res.data.result;
        })
      })
      .catch(err => {
        console.log(err);
      })
    },
    // 充值页面选定样式
    selectStyle(index) {
      return this.selectIndex == index ? 
        {
          transform: 'scale(1.1)',
          boxShadow: '0 0 2px 1px rgba(228, 170, 12, 0.397)'
        } : {}
    },
    // 手动选择充值标签项
    selectItem(index,item) {
      this.selectIndex = index;
      this.reChargeValue = item;
    },
    load() {
      this.showInfo = this.$store.state.account;
      if(window.location.href.includes('?')) {
        let url = window.location.href;
        let outTradeNo = url.split('&')[1].split('=')[1];
        console.log(outTradeNo);
        updateUserAccount({type: 'find', outTradeNo})
        .then(res => {
          this.$store.commit('updateAccount', res.data.account);
        })
      }
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