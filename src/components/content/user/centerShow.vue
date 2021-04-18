<template>
  <div class="PersonalCenterShow">
    <div class="header">
      <h4 class="text">
        {{showListTitle}}
        <span class="count">{{count}}</span>
      </h4>
    </div>
    <div class="list-wrap">
      <transition-group tag="div">
        <div class="list" v-for="list in showList" :key="list.key ? list.key : list.account">
          <div v-if="listContentType == 0">
            <h2>
              <router-link :to="'/others/release?id=' + list.key" 
              v-if="status == 'drafts'" target="_blank">{{list.title ? list.title : '无标题'}}</router-link>
              <router-link :to="'/post/' + list.key" v-else target="_blank">{{list.title}}</router-link>
            </h2>
            <div class="content">
              <div class="actions" v-if="status == 'drafts'">
                <span>
                  <i class="el-icon-time">&nbsp;{{list.releaseDate}}</i>
                </span>
                <span @click="deleteDrafts(list.key)">
                  <i class="el-icon-delete">&nbsp;删除</i>
                </span>
              </div>
              <div class="actions" v-else>
                <span>
                  <a :href="'/post/' + list.key + '#comment'" target="_blank"><i class="el-icon-s-comment">&nbsp;查看热评</i></a> 
                </span>
                <span>
                  <i class="el-icon-share">&nbsp;分享</i>
                </span>
                <span v-if="status == 'collect'" @click="cancelCollect(list.key)">
                  <i class="el-icon-star-on">&nbsp;取消收藏</i>
                </span>
              </div>
            </div>
          </div>
          <div v-else-if="listContentType == 1" class="tagsAndUsers">
            <router-link :to="'/users/' + list.account" target="_blank" class="avatar-link">
              <img :src="Avatar(list.avatar)" alt="">
            </router-link>
            <div class="meta">
              <h4><router-link :to="'/users/' + list._id " target="_blank">{{list.name}}</router-link></h4>
              <span>{{list.introduction}}</span>
            </div>
            <el-button type="primary" size="small" :plain="!resetFollow[list._id]"
              @click="followUser(list._id, list.name, list.avatar)" v-if="status = 'follows'"
            >{{resetFollow[list._id] ? '关注' : '取消关注'}}</el-button>
          </div>
          <div v-else-if="listContentType == 2">
            <router-link :to="list.link ? list.link : '#'" v-html="list.desc" class="activity-desc"></router-link>
          </div>
        </div>
        <div class="nothing" key="nothing" v-if="!count">
          <span>还没有内容</span>
        </div>
      </transition-group>
    </div>
		
	</div>
</template>

<script>
import { getCenterMessage, deleteCenterMessage, followAuthor, updateUserCollect} from '@/axios/request';

export default {
  name: 'centerShow',
  data() {
    return {
      status: '', // 展示类别定位
      releaseList: {}, // 储存展示的发布内容
      diaftsList: {}, // 储存展示的草稿内容
      showList: {}, // 储存展示的内容
      showListTitle: '', // 展示子标题
      resetFollow: [] // 取消关注列表
    }
  },
  watch: {
    '$route.path': function() {
      this.load();
    }
  },
  computed: {
    count() {
      return Array.isArray(this.showList) ? this.showList.length : Object.keys(this.showList).length;
    },
    listContentType() {
      if(this.status == 'release' || this.status == 'drafts' || this.status == 'collect') {
        return 0;
      }else if(this.status == 'follows' || this.status == 'fans') {
        return 1;
      }else if(this.status == 'activities') {
        return 2;
      }else {
        return -1;
      }
    }
  },
  methods: {
    Avatar(data) {
      if(data) {
        return 'data:' + data.mimetype + ';base64,' + data.base64;
      }
      else {
        return 'data:' + this.$store.state.account.avatar.mimetype + ';base64,' + this.$store.state.account.avatar.base64;
      }
    },
    // 关注用户
    followUser(id, name, avatar) {
      let params = {
        account: id,
				name: name,
				avatar: avatar,
      };
			let type = this.resetFollow[id] ? '' : 'cancel';
      followAuthor({key: this.$store.state.account.follow, follow: params, type: type})
      .then(res => {
				console.log(res);
				if(res.data.message == 'success') {
					let option = this.resetFollow[id] ? false : true;
					this.$store.commit('updateFollowList', [id, !option]);
					this.$set(this.resetFollow, id, option);
				}
      })
      .catch(err => {
        console.log(err);
      })
    },
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
          key: this.$store.state.account.drafts,
          deleteKey: key,
          type: "drafts" })
        .then(res => {
          if(res.data.message == 'success') {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
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
    // 取消收藏
    cancelCollect(key) {
      let account = this.$store.state.account._id;
      updateUserCollect({account, key})
      .then(res => {
        if(res.data.message == 'success') {
          this.$message({
            type: 'success',
            message: '取消收藏成功'
          });
          for(let index in this.showList) {
            if(this.showList[index].key == key) {
              console.log('pipei');
              this.showList.splice(index, 1);
              break;
            }
          }
          this.$store.commit('cancelCollect', this.showList);
        }
      })
    },
    load() {
      this.status = this.$route.path.split('/')[3] ? this.$route.path.split('/')[3] : '';
      let params = {};
      if(this.status == 'release') {
        this.showListTitle = '我的发布';
        params.type = 'release';
        params.key = this.$store.state.account.release;
      }
      else if(this.status == 'drafts') {
        this.showListTitle = '我的草稿';
        params.type = 'drafts';
        params.key = this.$store.state.account.drafts;
      }
      else if(this.status == 'follows') {
        this.showListTitle = '我的关注';
        params.type = 'follows';
        params.key = this.$store.state.account.follow;
      }
      else if(this.status == 'fans') {
        this.showListTitle = '我的粉丝';
        params.type = 'fans';
        params.key = this.$store.state.account.fans;
      }
      else if(this.status == 'activities') {
        this.showListTitle = '我的动态';
        params.type = 'activities';
        params.key = this.$store.state.account.activities;
      }
      else if(this.status == 'collect') {
        this.showListTitle = '我的收藏';
        params.type = 'collect';
        params.key = this.$store.state.account.activities;
        params.account = this.$store.state.account._id;
      }
      else {
        this.showListTitle = '更多';
      }
      /**
       * 请求用户的所有动态列表
       */
      getCenterMessage(params)
      .then(res => {
        this.showList = res.data;
      })
      .catch(err => {
        console.log(err);
      })
    }
  },
  created() {
    this.load();
  },
  mounted() {
  }
}

</script>
<style lang="scss" scoped>
@import "@/style/commonValue";
@import "@/style/indexMain";

.PersonalCenterShow {
  padding-bottom: 20px;
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 50px;
    margin: 0 20px;
    border-bottom: 1px solid #f6f6f6;
    box-sizing: border-box;
    .text {
      font-size: 16px;
    }
    .count {
      margin-left: 5px;
      color: $light-gray;
    }
  }
  .nothing {
    margin: 36px auto;
    padding: 10px 20px;
    color: $light-gray;
    font-size: 16px;
    text-align: center;
  }
}

.list-wrap {
  height: 100%;
  overflow-y: hidden;
  &:hover {
    overflow-y: auto;
  }
}


@include animate();
</style>
<style>
.PersonalCenterShow .list .activity-desc i{
  color: #fAAf00;
  font-style: normal;
}
</style>