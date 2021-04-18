<template>
  <section class="clear">
    <div class="container">
      <div class="main">
        <div class="article-support-panel">
          <div class="panel-btn lj-icon-zan" :style="isVoteUp ? {color: '#fAAf00'} : {}" @click="voteUp"><span class="badge" v-show="articleLikeCount">{{articleLikeCount}}</span></div>
          <a class="panel-btn el-icon-chat-dot-round" href="#comment" ><span class="badge" v-show="articleCommentCount">{{articleCommentCount}}</span></a>
          <div class="panel-btn el-icon-star-off" :style="isCollect ? {color: '#fAAf00'} : {}" @click="collect"></div>
        </div>
        <div class="list" v-if="init">
          <div class="author-info-block">
            <router-link :to="'/users/' + mainData.author_link" target="_blank" class="avatar-link">
              <img :src="Avatar(authorData[0])" alt="">
            </router-link>
            <div class="author-info-box">
              <router-link :to="'/users/' + mainData.author_link" target="_blank" class="author-name-link">{{mainData.author}}</router-link>
              <div class="meta-box">
                <span>{{releaseData(mainData.data.releaseDate)}}</span>
                <span>阅读 {{mainData.read_count}}</span>
              </div>
            </div>
            <el-button type="success" size="mini" :class="{followed: isFollow}" @click="follow">{{followText}}</el-button>
          </div>
          <h1 class="article-title">{{mainData.data.title}}</h1>
          <div class="article-content">
            <div>
              {{mainData.data.content}}
            </div>
          </div>
          <div class="comment-list-box" id="comment">
            <div class="comment-form" v-if="logined">
                <div class="avatar-box" ><img :src="Avatar()" alt=""></div>
                <div class="form-box">
                  <el-input size="small" type="textarea" :autosize="true" resize="none" @focus="isfocus = true" @blur="isfocus = false"
                  @keydown.native.enter = "handleEnterKey" @keydown.native.tab = "handleTabKey" class="applyArticle"
                  v-model="applyArticleValue" :placeholder="isfocus ? 'Ctrl or ⌘ + Enter  发送' : '发条友善的评论'"></el-input>
                </div>
            </div>
            <div class="hiddent" v-else>
              <span>您需要<span @click="login" class="mark">登录</span>后才能在捞金社区发布内容</span>
            </div>
            <div class="comment-list">
              <div class="item" v-for="(item,index) in commentData" :key="index">
                <div class="comment">
                  <div class="userPopover">
                    <router-link :to="'/users/' + item.apply.account" target="_blank"><img :src="Avatar(item.apply.avatar)" alt=""></router-link>
                  </div>
                  <div class="content-box">
                    <div class="meta-box">
                      <router-link :to="'/users/' + item.apply.account" target="_blank">
                        {{item.apply.name}} 
                      </router-link>
                      <router-link :to="'/users/' + item.target[1]" target="_blank" v-if="item.target.length">
                        <span class="middle-partition"> 回复 </span>{{item.target[0]}} 
                      </router-link>
                    </div>
                    <div class="content">{{item.content}}</div>
                    <div class="reply-box">
                      <div class="datatime">{{applyTime(item.time)}}</div>
                      <div class="action-box">
                        <span class="lj-icon-dianzanqian" :style="isLike(item._id) ? {color: '#fAAf00'} : {}" @click="likeComment(index,item._id)"> {{item.like == 0 ? '' : item.like}}</span>
                        <span class="el-icon-chat-round" @click="setApplyBox(index)"> 回复</span>
                      </div>
                    </div>
                    <div class="apply-form" v-if="showApplyBox(index)">
                      <div class="avatar-box" ><img :src="Avatar()" alt=""></div>
                      <div class="form-box">
                        <el-input size="small" type="textarea" :autosize="true" resize="none" @focus="isfocusCom = true" @blur="isfocusCom = false"
                        @keydown.native.enter= "handleEnterKey(item.apply.name, item.apply.account)" @keydown.native.tab = "handleTabKey" class="applyComment"
                        v-model="applyCommentValue" :placeholder="isfocusCom ? 'Ctrl or ⌘ + Enter 发送' : '@'+ item.apply.name + ' :'"></el-input>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <SidebarLayout 
        :page-y-offset = "188"
        fixed-distance = "40%"
        >
        <template v-slot:top>
          <div class="right-top">
            <div class="author-title">关于作者</div>
            <div class="author-body">
              <router-link :to="'/users/' + mainData.author_link" target="_blank" class="user-item item">
                <img :src="Avatar(authorData[0])" alt="">
                <span class="uname">{{mainData.author}}</span>
              </router-link>
              <div class="stat-item item">
                <i class="lj-icon-dianzanqian"></i>
                <span class="content">获得点赞<span class="count">{{authorData[2]}}</span></span>
              </div>
              <div class="stat-item item">
                <i class="el-icon-magic-stick"></i>
                <span class="content">兼职发布数量<span class="count">{{authorData[1]}}</span></span>
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
import { 
  showPartTimeWork, 
  updateComment, 
  updatePartTimeWork, 
  articleApply, 
  showUserArticleMess,
  followAuthor } from '@/axios/request';
import showTime from '@/utils/showTime';
import loginJudge from '@/utils/loginJudge';
import { getCursorPosition, setCursorPosition } from '@/utils/handleCursorPosition';
import SidebarLayout from '@/components/sidebar/SidebarLayout';
import AppLinks from '@/components/sidebar/appLinks';

export default {
  name: 'messContent',
  components: {
    SidebarLayout,
    AppLinks
  },
  computed: {
    logined() {
      return localStorage.getItem('account') ? true : false;
    },
    articleCommentCount() {
      return this.mainData.comment_count;
    },
    articleLikeCount() {
      return this.mainData.voteup_count;
    },
    articleCollectionCount() {
      return this.mainData.collect_count ? this.mainData.collect_count : '';
    },
    // 已点赞文章返回高亮
    isVoteUp() {
      let key = this.$route.params.key;
      for(let i of this.$store.state.voteUpList) {
        if(i == key) return true;
      }
      return false;
    },
    // 已收藏文章返回高亮
    isCollect() {
      let key = this.$route.params.key;
      for(let i of this.$store.state.collectList) {
        if(i == key) return true;
      }
      return false;
    },
    // 已关注作者返回低亮
    isFollow() {
      let account = this.mainData.author_link;
      for(let i of this.$store.state.followList) {
        if(i == account) return true;
      }
      return false;
    },
    followText() {
      return this.isFollow ? '已关注' : '关注';
    }
  },
  data() {
    return {
      isfocus: false, // 文章回复框状态
      isfocusCom: false, // 评论回复框状态
      init: false, // 数据是否已完成加载
      ApplyBox: -1, // 显示评论回复框标记
      mainData: {},
      authorData: [], // 作者信息
      commentData: [],
      userLikeCommentList: [],
      applyArticleValue: '',
      applyCommentValue: ''
    }
  },
  watch: {
    init(newValue) {
      if(newValue) {
        this.$nextTick(() => {
          if(window.location.hash) {
            let Anchor = document.querySelector(window.location.hash);
            Anchor.scrollIntoView();
          }
        })
      }
    }
  },
  methods: {
    Avatar(data) {
      if(data) {
        return 'data:' + data.mimetype + ';base64,' + data.base64;
      }
      else {
        return this.logined ? ('data:' + this.$store.state.account.avatar.mimetype + ';base64,' + this.$store.state.account.avatar.base64) : '';
      }
    },
    // 返回内容发布时间
    releaseData(date) {
      const p1 = date.split(' ')[0];
      const p2 = p1.split('-');
      return p2[0] + '年' + p2[1] + '月' + p2[2];
    },
    applyTime(date) {
      return showTime(date);
    },
    // 关注作者
    follow() {
      if(!loginJudge.call(this)) return;
      let option = this.isFollow;
      let params = {};
      let type = 'cancel';
      params.account = this.mainData.author_link;
      if(!option) {
        params.name = this.mainData.author;
        params.avatar = this.mainData.author_avatar;
        type = '';
      }
      followAuthor({key: this.$store.state.account.follow, follow: params, type: type})
      .then(res => {
        if(res.data.message == 'success') {
          let options = [this.mainData.author_link, option];
          this.$store.commit('updateFollowList', options); 
        }
        else {
          this.$notify.error('关注失败，请稍后重试');
        }
      })
      .catch(err => {
        this.$notify.error(err);
      })
    },
    login() {
      this.$store.commit('showLoginedDialog');
    },
    // 已点赞评论返回高亮
    isLike(key) {
      for(let i of this.userLikeCommentList) {
        if(i == key) return true;
      }
      return false;
    },
    // 点赞文章
    voteUp() {
      if(this.logined) {
        let params = {
          articleKey: this.$route.params.key,
          account: this.$store.state.account._id,
          type: 'voteUp',
          action: this.isVoteUp ? 'cancel' : 'set'
        };
        updatePartTimeWork(params)
        .then(res => {
          if(res.data.message == 'success') {
            this.mainData.voteup_count = res.data.newVoteUpCount;
            this.$store.commit('initVoteUpList', res.data.newLikeHis);
          }
          else {
            this.$message.error('请求失败，请稍后重试');
          }
        })
        .catch(err => {
          this.$message.error(err);
        })
      }
      else {
        this.login();
      }
    },
    // 收藏文章
    collect() {
      if(this.logined) {
        let params = {
          articleKey: this.$route.params.key,
          account: this.$store.state.account._id,
          type: 'collect',
          action: this.isCollect ? 'cancel' : 'set'
        };
        updatePartTimeWork(params)
        .then(res => {
          if(res.data.message == 'success') {
            this.$store.commit('initCollectList', res.data.newCollectList);
          }
          else {
            this.$message.error('请求失败，请稍后重试');
          }
        })
        .catch(err => {
          this.$message.error(err);
        })
      }
      else {
        this.login();
      }
    },
    // 点赞评论
    likeComment(index, key) {
      if(this.logined) {
        let data = {
          article: this.$route.params.key,
          updateKey: key,
          account: localStorage.getItem('account'),
          type: this.isLike(key) ? 'cancel' : 'set'
        };
        updateComment(data)
        .then(res => {
          if(res.data.message == 'success') {
            this.commentData[index].like = res.data.newValue;
            this.userLikeCommentList = res.data.newLikeHis;
          }
          else {
            this.$message.error('服务器错误，请稍后重试');
          }
        })
        .catch(err => {
          console.log(err);
        })
      }
      else {
        this.login();
      }
    },
    // Ctrl or ⌘ + Enter 发送
    handleEnterKey() {
      let type = typeof(arguments[0]) == 'string' ? true : false;
      let $textarea = type ? document.querySelector('.applyComment').querySelector('textarea')
      : document.querySelector('.applyArticle').querySelector('textarea');
      if(!(event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        let $index = getCursorPosition($textarea);
        let preStr = type ? this.applyCommentValue.slice(0, $index) : this.applyArticleValue.slice(0, $index);
        let sufStr = type ? this.applyCommentValue.slice($index) : this.applyArticleValue.slice($index);
        if(type) {
          this.applyCommentValue = preStr + '\n' + sufStr;
        }
        else {
          this.applyArticleValue = preStr + '\n' + sufStr;
        }
        this.$nextTick(() => {
          setCursorPosition($textarea, $index + 1);
          $textarea.scrollTop = $textarea.scrollHeight - $textarea.clientHeight;
        });
      }
      else {
        event.preventDefault();
        type ? this.applyComment(arguments[0], arguments[1]) : this.applyArticle();
        $textarea.blur();
      }
    },
    // tab 缩进
    handleTabKey(event) {
      event.preventDefault();
      let $textarea = document.querySelector('.applyArticle').querySelector('textarea');
      let $index = getCursorPosition($textarea);
      let preStr = this.applyArticle.slice(0, $index);
      let sufStr = this.applyArticle.slice($index);
      this.applyArticle = preStr + '    ' + sufStr;
      this.$nextTick(() => {
        setCursorPosition($textarea, $index + 4);
      });
    },
    // 回复文章
    applyArticle() {
      if(this.logined) {
        let applyAccount = {
          name: this.$store.state.account.name,
          account: this.$store.state.account._id,
          avatar: this.$store.state.account.avatar
        };
        let params = {
          articleKey: this.$route.params.key, // 回复的文章id
          account: applyAccount, // 回复的账户
          type: 'applyArticle', // 回复的类型
          value: this.applyArticleValue
        };
        articleApply(params)
        .then(res => {
          if(res.data.message == 'success') {
            this.commentData.unshift({
              _id: res.data.newComment._id,
              apply: applyAccount,
              content: this.applyArticleValue,
              like: 0,
              target: '',
              time: res.data.newComment.time,
              belong: this.mainData.comment_content
            });
            this.applyArticleValue = '';
          }
          else {
            this.$message.error('回复失败')
          }
        })
        .catch(err => {
          this.$message.error(err)
        })
      }
      else {
        this.login();
      }
    },
    // 评论回复框状态显示标记
    showApplyBox(index) {
      return this.ApplyBox == index ? true : false;
    },
    // 显示评论回复框
    setApplyBox(index, key) {
      if(this.logined) {
        this.ApplyBox = this.ApplyBox == index ? -1 : index;
      }
      else {
        this.login();
      }
    },
    // 回复评论
    applyComment(name, link) {
      this.ApplyBox = -1;
      let applyAccount = {
        name: this.$store.state.account.name,
        account: this.$store.state.account._id,
        avatar: this.$store.state.account.avatar
      };
      let params = {
        articleKey: this.$route.params.key, // 回复的文章id
        key: name, // 回复的对象名称：文章 or 他人
        link: link, // 回复对象的账户信息
        account: applyAccount, // 回复的账户
        type: 'applyComment', // 回复的类型
        value: this.applyCommentValue
      };
      articleApply(params)
      .then(res => {
        if(res.data.message == 'success') {
          this.commentData.unshift({
            _id: res.data.newComment._id,
            apply: applyAccount,
            content: this.applyCommentValue,
            like: 0,
            target: [name, link],
            time: res.data.newComment.time,
            belong: this.mainData.comment_content
          })
          this.applyCommentValue = '';
        }
        else {
          this.$message.error('回复失败')
        }
      })
      .catch(err => {
        this.$message.error(err)
      })
    },
    load() {
      let params = {};
      params.key = this.$route.params.key;
      params.logined = this.logined;
      if(this.logined) {
        params.account = localStorage.getItem('account');
      }
      showPartTimeWork(params)
      .then(res => {
        if(res.data.message == 'success') {
          if(!res.data.mainContent.check) {
            this.$message.warning('该兼职信息尚未通过系统审核');
            this.$router.push({path: '/'});
          }
          this.mainData = JSON.parse(JSON.stringify(res.data.mainContent));
          this.commentData = res.data.comment;
          this.userLikeList = res.data.likeHis;
          this.init = true;
          showUserArticleMess({account: res.data.mainContent.author_link})
          .then(res => {
            if(res.status == 200) {
              this.authorData = res.data;
            }
            else {
              this.$notify.error('作者数据加载失败');
            }
          })
        }
        else {
          this.$notify.error({
            title: '信息加载失败'
          })
        }
      })
      .catch(err => {
        this.$notify.error({
          title: '数据加载失败'
        })
      })

    }
  },
  created() {
    this.load();
  },
  mounted() {
    
  },
}

</script>
<style lang='scss' scoped>
@import '@/style/commonValue';
@import '@/style/content';

.main {
	@include content_main;
}
</style>