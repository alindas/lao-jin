<template>
  <div class="main-container">
    <div class="tag-info-box">
      <div class="tag-info">
        <div class="title">{{tagName}}</div>
        <div class="tag-meta">{{tagMeta}}</div>
      </div>
    </div>
    <section class="clear">
      <div class="container">
        <div class="main">
          <nav class="nav">
            <div class="left">
              <img src="~@/assets/ttt.jpg" alt="" class="tag-icon">
              <el-button type="success" size="small" :plain="isFollowTag" @click="followTag">{{isFollowTag ? '已关注' : '关注'}}</el-button>
            </div>
						<el-menu :default-active="bySort" router mode="horizontal" active-text-color="#fAAf00">
							<el-menu-item index="hotest" :route="pathList(0)">热门</el-menu-item>
							<el-menu-item index="latest" :route="pathList(1)">最新</el-menu-item>
							<el-menu-item index="well" :route="pathList(2)">收益</el-menu-item>
						</el-menu>
					</nav>
          <transition-group>
            <div class="list" v-for="(list,index) in lists" :key="list._id">
              <div>
                <ul class="meta-list">
                  <li>{{list.author}}</li>
                  <li>{{releaseData(list.data.releaseTime)}}</li>
                  <li>
                    <router-link v-for="(item,index) in list.data.tags" :key="index"
                    :to="{name: 'funWithTag', params: {tag: item.name}}" target="_blank" class="tags">{{item.name}}</router-link>
                  </li>
                </ul>
                <h2>
                    <router-link :to="'/post/' + list._id " target="_blank">{{list.data.title}}</router-link>
                </h2>
                <div class="content">
                  <div class="actions">
                    <span @click="love(index)">
                      <button :class="{agree: isVoteUp(list._id)}"><i class="lj-icon-dianzanqian"></i> {{list.voteup_count}}</button>
                    </span>
                    <span>
                      <router-link :to="'/post/' + list._id + '#comment'" target="_blank"><i class="el-icon-s-comment">&nbsp;{{list.comment_count}} 条评论</i></router-link> 
                    </span>
                    <span>
                      <i class="el-icon-share">&nbsp;分享</i>
                    </span>
                    <span>
                      <el-popover placement="bottom" width="80">
                        <button class="more">&nbsp;收藏</button>
                        <button class="more">&nbsp;举报</button>
                        <i class="el-icon-more" slot="reference"></i>
                      </el-popover>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </transition-group>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { getTagMain, updatePartTimeWork, followTag } from '@/axios/request';
import showTime from '@/utils/showTime';
import loginJudge from '@/utils/loginJudge';


export default {
  name: 'findContent',
  computed: {
    tagName() {
      return this.$route.params.tag;
    },
    tagMeta() {
      return (this.Meta.length ? this.Meta[0].followCount : '0') + ' 关注，' + this.lists.length + ' 文章';
    },
    bySort() {
      return this.$route.query.sort ? this.$route.query.sort : 'hotest';
    }
  },
  data() {
    return {
      Meta: [], // 标签云数据
			lists: [],
      isFollowTag: false // 是否为已关注标签
    }
  },
  watch: {
    '$route.query.sort': function(newValue) {
      this.load(newValue);
    }
  },
  methods: {
    // 返回发布时间
		releaseData(date) {
			return showTime(date);
		},
		// 已点赞文章返回高亮
    isVoteUp(key) {
      for(let i of this.$store.state.voteUpList) {
        if(i == key) return true;
      }
      return false;
    },
    // 关注标签
    followTag() {
      if(!loginJudge.call(this)) return;
      let params = {
        key: this.$store.state.account.followTags,
        tag: this.tagName
      }
      followTag(params)
      .then(res => {
        this.$store.commit('updateFollowTags', res.data.newFollowTags);
        this.isFollowTag = !this.isFollowTag;
      })
      .catch(err => {
        console.log(err);
      })
    },
    pathList(type) {
			if(type == 0) {
				return {path: this.$route.path, query: {sort: 'hotest'}};
			}else if(type == 1) {
				return {path: this.$route.path, query: {sort: 'latest'}};
			}else if(type == 2) {
				return {path: this.$route.path, query: {sort: 'well'}};
			}else {
				return;
			}
		},
		load (newValue) {
			getTagMain({tag: this.$route.params.tag, sort: newValue})
			.then(res => {
        this.Meta = res.data.tagMeta;
				this.lists = res.data.tagContent;
			})
			.catch(err => {
				console.log(err);
			})
		},
		love(id) {
			if(!localStorage.getItem('account')) {
				this.$store.commit('showLoginedDialog');
				return;
			}
			else {
				let params = {
          articleKey: this.lists[id]._id,
          account: this.$store.state.account._id,
          type: 'voteUp',
          action: this.isVoteUp(this.lists[id]._id) ? 'cancel' : 'set'
        };
        updatePartTimeWork(params)
        .then(res => {
          if(res.data.message == 'success') {
            this.lists[id].voteup_count = res.data.newVoteUpCount;
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

		}
  },
  created() {
    this.isFollowTag = this.$store.state.followTagsList.includes(this.tagName) ? true : false;
		this.load('hotest');
  }
}

</script>
<style lang="scss" scoped>
@import '@/style/commonValue';
@import '@/style/indexMain';

@include animate();

.main-container {
  padding-top: 65px;
}

.tag-info-box {
  position: relative;
  height: 150px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #f1f1f1;
  .tag-info {
    width: 100%;
    height: 100%;
    padding: 48px 0;
    text-align: center;
    box-sizing: border-box;
    color: #666;
    .title {
      font-size: 25px;
      line-height: 30px;
      font-weight: 700;
      margin-bottom: 5px;
    }
  }
}

.nav {
  display: flex;
  justify-content: space-between;
  height: 50px;
  border-bottom: 1px solid hsla(0,0%,59.2%,.1);
  .left {
    display: flex;
    width: 120px;
    justify-content: space-between;
    align-items: center;
    img {
      width: auto;
    }
    .tag-icon {
      height: 30px;
    }
  }
  .el-menu.el-menu--horizontal {
		border-bottom: none;
		.el-menu-item {
			border-bottom: none ;
      padding: 0 20px ;
      height: 50px;
      background-color: #f6f6f6;
		}
	}
}
</style>