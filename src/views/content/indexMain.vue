<template>
	<div id="body">
		<transition-group>
			<div class="list" v-for="(list,index) in lists" :key="list._id">
				<div v-if="listType == 0">
					<ul class="meta-list">
						<li>
							<router-link :to="{name: 'user', params: {id: list.author_link }}" target="_blank">{{list.author}}
							</router-link>
						</li>
						<li>{{releaseData(list.data.releaseTime)}}</li>
						<li>
							<router-link v-for="(item, index) in list.data.tags" :key="index"
							:to="{name: 'funWithTag', params: {tag: item.name }}" target="_blank" class="tags">{{item.name}}
							</router-link>
						</li>
					</ul>
					<h2>
							<router-link :to="'/post/' + list._id " target="_blank">{{list.data.title}}</router-link>
					</h2>
					<div class="content">
						<div class="actions">
							<span @click="love(index)">
								<button :class="{agree: isVoteUp(list._id)}"><i class="lj-icon-dianzanqian"></i> {{list.voteup_count ? list.voteup_count : ''}}</button>
							</span>
							<span>
								<router-link :to="'/post/' + list._id + '#comment'" target="_blank"><i class="el-icon-s-comment">&nbsp;{{list.comment_count}} 条评论</i></router-link> 
							</span>
							<span @click="share(list._id)">
								<i class="el-icon-share">&nbsp;分享</i>
							</span>
							<span>
								<el-popover placement="bottom" width="80">
									<button class="more" @click="report = true, reportMess = list">&nbsp;举报</button>
									<i class="el-icon-more" slot="reference"></i>
								</el-popover>
							</span>
						</div>
					</div>
				</div>
				<div v-else-if="listType == 1" class="tagsAndUsers">
					<router-link :to="'/fun/' + list.name" target="_blank" class="avatar-link">
						<img :src="Avatar(list.avatar)" alt="">
					</router-link>
					<div class="meta">
						<h4><router-link :to="'/fun/' + list.name " target="_blank">{{list.name}}</router-link></h4>
						<span>{{list.followCount + ' 关注'}}</span>
					</div>
					<el-button type="primary" size="small" :plain="isfollowTagsList[list.name]"
						@click="followTag(list.name)"
					>{{isfollowTagsList[list.name] ? '已关注' : '关注'}}</el-button>
				</div>
				<div v-else-if="listType == 2" class="tagsAndUsers">
					<router-link :to="'/users/' + list._id" target="_blank" class="avatar-link">
						<img :src="Avatar(list.avatar)" alt="">
					</router-link>
					<div class="meta">
						<h4><router-link :to="'/users/' + list._id " target="_blank">{{list.name}}</router-link></h4>
						<span>{{list.introduction}}</span>
					</div>
					<el-button type="primary" size="small" :plain="isfollowUserList[list._id]"
						@click="followUser(list._id, list.name, list.avatar)"
					>{{isfollowUserList[list._id] ? '已关注' : '关注'}}</el-button>
				</div>	
			</div>
			<div class="list" v-if="lists.length == 0" key="emptyBox">
				<div class="emptyBox">暂无数据</div>
			</div>
		</transition-group>
		<el-dialog :visible.sync="report" width="25%" :modal-append-to-body="true"
		:append-to-body="true" :close-on-click-modal="false"  @close="closeReportDialog">
			<h3 slot="title">违规信息举报</h3>
			<el-checkbox-group v-model="reportList">
				<el-checkbox label="低质垃圾信息"></el-checkbox>
				<el-checkbox label="辱骂、人身攻击等不友善行为"></el-checkbox>
				<el-checkbox label="有害信息"></el-checkbox>
				<el-checkbox label="色情暴力"></el-checkbox>
			</el-checkbox-group>
			<el-button plain size='small' @click="reportRequest">提 交</el-button>
		</el-dialog>
	</div>
</template>

<script>
import { getIndexMain, updatePartTimeWork, followAuthor, followTag, reportMess } from '@/axios/request';
import showTime from '@/utils/showTime';
import Clipboard from '@/utils/clipboard';
import getAuthority from '@/utils/getAuthority';



export default {
	name: "index-main",
	computed: {
		listType() {
			if(this.$route.query.type == 'tags') {
				return 1;
			}else if(this.$route.query.type == 'users') {
				return 2;
			}else {
				return 0;
			}
		}
	},
	beforeRouteUpdate(to, from, next) {
		switch (to.params.type) {
			case 'recommend':
				from.meta.title = '首页-推荐';
				break;
			case 'inside':
				from.meta.title = '首页-校内兼职';
				break;
			case 'outside':
				from.meta.title = '首页-校外兼职';
				break;
			case 'lwork':
				from.meta.title = '首页-长期工';
				break;
			case 'swork':
				from.meta.title = '首页-短期工';
				break;
			case 'search':
				from.meta.title = '搜索-'+ to.query.query;
				break;
			default: 
				from.meta.title = '捞金';
		}
		document.title = from.meta.title;
		next();
	},
	data () {
		return {
			report: false, 
			reportMess: null,
			reportList: [], // 举报违规列表
			lists: [],
			reportedList: [],
			isfollowUserList: {},
			isfollowTagsList: {}
		}
	},
	watch: {
		'$route.params.type': function(newValue) {
			this.load();
		},
		'$route.query.query': function(newValue) {
			this.load();
		},
		'$route.query.type': function(newValue) {
			this.lists = [];
			this.load();
		},
		'$route.query.sort': function(newValue) {
			this.load();
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
			if(!getAuthority.call(this)) return;
      let params = {
        account: id,
				name: name,
				avatar: avatar,
      };
			let type = this.isfollowUserList[id] ? 'cancel' : '';
      followAuthor({myself: this.$store.state.account._id, followKey: this.$store.state.account.follow, follow: params, type: type})
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
		// 关注标签
    followTag(tag) {
			if(!getAuthority.call(this)) return;
      let params = {
        key: this.$store.state.account.followTags,
        user: tag
      }
      followTag(params)
      .then(res => {
        this.$store.commit('updateFollowTags', res.data.newFollowTags);
        this.$set(this.isfollowTagsList, tag, this.isfollowTagsList[tag] ? false : true);
      })
      .catch(err => {
        console.log(err);
      })
    },
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
			let type;
			switch(this.$route.params.type) {
				case 'inside': type = '校内兼职'; break;
				case 'outside': type = '校外兼职'; break;
				case 'lwork': type = '长期工'; break;
				case 'swork': type = '短期工'; break;
				default: type = this.$route.params.type; break;
			}
			let options = {
				type, 
				sort: this.$route.query.sort ? this.$route.query.sort : 'hotest',
				query: this.$route.query.query ? this.$route.query.query : '',
				searchType: this.$route.query.type ? this.$route.query.type : 'article'
			};
			getIndexMain(options)
			.then(res => {
				this.lists = res.data;
				if(this.listType == 1) {
					for(let i of this.$store.state.followTagsList) {
						this.isfollowTagsList[i] = true;
					}
				}else if(this.listType == 2) {
					for(let i of this.$store.state.followList) {
						this.isfollowUserList[i] = true;
					}
				}
			})
			.catch(err => {
				console.log(err);
			})
		},
		love(id) {
			if(!getAuthority.call(this)) return;
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

		},
		share(val) {
			let url = window.location.host + '/post/' + val;
			if(Clipboard(url)) {
				this.$message.success('链接已复制到剪贴板');
			}
		},
		reportRequest() {
			if(!getAuthority.call(this)) return;
			let user = localStorage.getItem('account');
			for(let item of this.reportedList) {
				if(item == this.reportMess._id) {
					this.report = false;
					this.$message.warning('你已经提交过举报,请耐心等待结果');
					return;
				}
			}
			for(let item of this.reportMess.report) {
				if(item.reportId == user) {
					this.report = false;
					this.$message.warning('你已经提交过举报,请耐心等待结果');
					return;
				}
			}
			reportMess({
				user,
				id: this.reportMess._id,
				list: this.reportList
			})
			.then(res => {
				this.report = false;
				this.reportedList.push(this.reportMess._id);
				this.$message({
					type: 'success',
					message: '你的举报已成功提交,感谢每位热情的捞金小伙伴'
				})
			})
		},
		closeReportDialog() {
			this.reportMess = null;
			this.reportList = [];
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