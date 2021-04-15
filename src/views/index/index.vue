<template>
	<div>
		<div class="subnav" :style="navHeaderState">
      <div class="container clear">
				<el-menu :default-active="typeMenu" router mode="horizontal" active-text-color="#fAAf00">
          <el-menu-item v-for="item in subnav" :key="item.name" :index="item.params"
						:route="item.url">{{item.name}}</el-menu-item>
        </el-menu>
      </div>
    </div>
		<section class="clear">
			<div class="container">
				<div class="main">
					<nav class="nav" v-if="tagOrUser">
						<el-menu :default-active="currentSort" router mode="horizontal" active-text-color="#fAAf00">
							<el-menu-item index="hotest" :route="pathList(0)">热门</el-menu-item>
							<el-menu-item index="latest" :route="pathList(1)">最新</el-menu-item>
							<el-menu-item index="well" :route="pathList(2)">收益</el-menu-item>
						</el-menu>
					</nav>
						<router-view/>
				</div>
				<MainSidebar/>
			</div>
		</section>
	</div>
	
</template>

<script>
import MainSidebar from '@/components/sidebar/mainSidebar';

export default {
	name: "index",
	computed: {
		typeMenu() {
			if(this.$route.params.type == 'search') {
				return this.$route.query.type ? this.$route.query.type : 'article';
			}
			return this.$route.params.type ? this.$route.params.type : 'recommend';
		},
		currentSort() {
			return this.$route.query.sort ? this.$route.query.sort : 'hotest';
		},
		navHeaderState() {
			return this.$parent.navHeaderState ? {} : {transform: 'translateY(0)'};
		},
		tagOrUser() {
			return (this.$route.query.type == 'tags' || this.$route.query.type == 'users') ? false : true; 
		}
	},
	data() {
		return {
			subnav: []
		}
	},
	watch: {
		'$route.params.type': function(newValue) {
			this.initSub(newValue);
		},
		'$route.query.query': function(newValue, oldValue) {
			this.initSub(this.$route.params.type);
		}
	},
	components: {
		MainSidebar,
	},
	methods: {
		pathList(type) {
			if(this.$route.params.type == 'search') {
				if(type == 0) {
					return {
						path: this.$route.path, 
						query: {
							query: this.$route.query.query,
							sort: 'hotest'
							}
						};
				}else if(type == 1) {
					return {
						path: this.$route.path, 
						query: {
							query: this.$route.query.query,
							sort: 'latest'
							}
						};
				}else if(type == 2) {
					return {
						path: this.$route.path, 
						query: {
							query: this.$route.query.query,
							sort: 'well'
							}
						};
				}else {
					return;
				}
			}else {
				if(type == 0) {
					return {path: this.$route.path, query: {sort: 'hotest'}};
				}else if(type == 1) {
					return {path: this.$route.path, query: {sort: 'latest'}};
				}else if(type == 2) {
					return {path: this.$route.path, query: {sort: 'well'}};
				}else {
					return;
				}
			}
		},
		initSub(newValue) {
			if(newValue != 'search') {
				this.subnav = [
					{name: '综合',url: { path: '/index/recommend'}, params: 'recommend'},
					{name: '校内兼职',url: { path: '/index/inside'}, params: 'inside'},
					{name: '校外兼职',url: { path: '/index/outside'}, params: 'outside'},
					{name: '长期工',url: { path: '/index/lwork'}, params: 'lwork'},
					{name: '短期工',url: { path: '/index/swork'}, params: 'swork'},
				];
			}else {
				this.subnav = [
					{name: '兼职',url: { path: '/index/search', query: {query: this.$route.query.query, type: 'article'}}, params: 'article'},
					{name: '标签',url: { path: '/index/search', query: {query: this.$route.query.query, type: 'tags'}}, params: 'tags'},
					{name: '用户',url: { path: '/index/search', query: {query: this.$route.query.query, type: 'users'}}, params: 'users'}
				];
			}
		},
		load() {

		}
	},
	created() {
		this.initSub(this.$route.params.type);
	}
}
</script>

<style lang="scss" scoped>
@import '@/style/commonValue';
section {
	padding-top: 110px;
}

.subnav {
	background: #fff;
	box-shadow: 0 1px 3px rgba(18, 18, 18, .1);
	position: fixed;
	width: 100%;
	z-index: 99;
	height: 45px;
	transition: transform .2s;
  transform: translateY(65px);
  .el-menu.el-menu--horizontal {
    display: inline-block;
    height: 45px;
    box-sizing: border-box;
    border-bottom: none;
    >.el-menu-item {
      height: 100%;
      line-height: 45px;
      font-weight: 400;
      border-bottom: none;
    }
  }
}

.main {
	@include content_main;
}

.nav {
	@include content_nav;
	.el-menu.el-menu--horizontal {
		border-bottom: none;
		.el-menu-item {
			border-bottom: none ;
			padding: 0 20px ;
		}
	}
}
</style>