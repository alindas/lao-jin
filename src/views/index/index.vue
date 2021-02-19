<template>
	<div>
		<div class="subnav" :style="navHeaderState">
      <div class="container clear">
				<el-menu :default-active="this.$route.path.split('?')[0]" router mode="horizontal" active-text-color="#fAAf00">
          <el-menu-item v-for="item in subnav" :key="item.name" :index="item.path">{{item.name}}</el-menu-item>
        </el-menu>
      </div>
    </div>
		<section class="clear">
			<div class="container">
				<div class="main">
					<nav class="nav">
						<el-menu :default-active="currentSort" router mode="horizontal" active-text-color="#fAAf00">
							<el-menu-item index="hotest" :route="pathList[0]">热门</el-menu-item>
							<el-menu-item index="latest" :route="pathList[1]">最新</el-menu-item>
							<el-menu-item index="well" :route="pathList[2]">收益</el-menu-item>
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
		currentSort() {
			return this.$route.query.sort ? this.$route.query.sort : 'hotest';
		},
		navHeaderState() {
			return this.$parent.navHeaderState ? {} : {transform: 'translateY(0)'};
		}
	},
	data() {
		return {
			subnav: [
        {name: '推荐',path: '/index/recommend'},
        {name: '校内兼职',path: '/index/inside'},
        {name: '校外兼职',path: '/index/outside'},
        {name: '长期工',path: '/index/lwork'},
        {name: '短期工',path: '/index/swork'},
      ],
			pathList: [
				{path: this.$route.path, query: {sort: 'hotest'}},
				{path: this.$route.path, query: {sort: 'latest'}},
				{path: this.$route.path, query: {sort: 'well'}},
			]
		}
	},
	components: {
		MainSidebar,
	},
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
      &:hover {
        color: $selected-color;
      }
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