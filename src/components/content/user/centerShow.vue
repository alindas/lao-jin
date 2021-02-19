<template>
  <div class="PersonalCenterShow">
    <div class="header">
      <h4 class="text">
        {{showListTitle}}
        <span class="count">{{count}}</span>
      </h4>
    </div>
		<transition-group>
			<div class="list" v-for="list in showList" :key="list.key">
				<div>
					<h2>
            <router-link to="/post" v-if="status == 'release'" target="_blank">{{list.title}}</router-link>
            <router-link :to="'/others/release?id=' + list.key" v-if="status == 'drafts'" target="_blank">{{list.title}}</router-link>
					</h2>
					<div class="content">
						<div class="actions" v-if="status == 'release'">
							<span>
								<button><i class="lj-icon-dianzanqian"></i> {{list.voteup_count}}</button>
							</span>
							<span>
								<a href="/post#comment" target="_blank"><i class="el-icon-s-comment">&nbsp;{{list.comment_count}} 条评论</i></a> 
							</span>
							<span>
								<i class="el-icon-share">&nbsp;分享</i>
							</span>
							<span>
                <i class="el-icon-star-on">&nbsp;收藏</i>
							</span>
						</div>
            <div class="actions" v-if="status == 'drafts'">
							<span>
								<i class="el-icon-time">&nbsp;{{list.releaseDate}}</i>
							</span>
							<span @click="deleteDrafts(list.key)">
								<i class="el-icon-delete">&nbsp;删除</i>
							</span>
						</div>
					</div>
				</div>
			</div>
      <div class="nothing" key="nothing" v-if="!count">
        <span>还没有内容</span>
      </div>
		</transition-group>
	</div>
</template>

<script>
import { getCenterMessage, deleteCenterMessage} from '@/axios/request';

export default {
  name: 'centerShow',
  data() {
    return {
      status: '', // 展示类别定位
      releaseList: {}, // 储存展示的发布内容
      diaftsList: {}, // 储存展示的草稿内容
      showList: {}, // 储存展示的内容
      showListTitle: '', // 展示子标题
    }
  },
  watch: {
    '$route.path': function() {
      this.load();
    }
  },
  computed: {
    count() {
      return Object.keys(this.showList).length;
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
    load() {
      this.status = this.$route.path.split('/')[3] ? this.$route.path.split('/')[3] : '';
      if(this.status == 'release') {
        this.showListTitle = '我的发布';
        /**
         * 请求用户发布的所有兼职信息
         */
        getCenterMessage({type: 'release', key: this.$store.state.account.release})
        .then(res => {
          this.showList = res.data[0];
        })
        .catch(err => {
          console.log(err);
        })
      }
      else if(this.status == 'drafts') {
        this.showListTitle = '我的草稿';
        /**
         * 请求用户的所有草稿信息
         */
        getCenterMessage({type: 'drafts', key: this.$store.state.account.drafts})
        .then(res => {
          this.showList = res.data[0];
        })
        .catch(err => {
          console.log(err);
        })
      }
      else {
        this.showListTitle = '我的';
        getCenterMessage({type: 'drafts', key: this.$store.state.account.drafts})
        .then(res => {
          this.showList = res.data[0];
        })
        .catch(err => {
          console.log(err);
        })
      }
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
@include animate();
</style>