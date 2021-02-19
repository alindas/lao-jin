<template>
	<div id="body">
		<transition-group>
			<div class="list" v-for="(list,index) in lists" :key="list._id">
				<div>
					<ul class="meta-list">
						<li>{{list.author}}</li>
						<li>{{releaseData(list.data.releaseTime)}}</li>
						<li>
							<router-link v-for="(item,index) in list.data.tags" :key="index"
							:to="{name: 'funWithTag', params: {tag: item}}" target="_blank" class="tags">{{item}}</router-link>
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
</template>

<script>
import { getIndexMain, updatePartTimeWork } from '@/axios/request';
import showTime from '@/assets/utils/showTime';


export default {
	name: "index-main",
	computed: {
		
	},
	data () {
		return {
			lists: []
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
		load () {
			getIndexMain()
			.then(res => {
				this.lists = res.data;
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
		this.load();
	}
}
</script>

<style lang="scss" scoped>
@import "@/style/_commonValue";
@import "@/style/indexMain";
#body {
	padding-bottom: 50px;
}
@include animate();
</style>