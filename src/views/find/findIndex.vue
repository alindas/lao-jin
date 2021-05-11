<template>
  <div class="main-container">
    <div class="fun-home-page container">
      <div class="section">
        <div class="section-header">
          <i class="el-icon-document-copy"></i>
          <span>热门标签</span>
        </div>
        <div class="section-body">
          <div class="specials" v-if="dataInit">
            <div class="specialsCard" v-for="tagItem in hotTags" :key="tagItem.tag._id">
              <router-link :to="{ name: 'funWithTag', params: {tag: tagItem.tag.name}}" params class="specialsBanner">
                <img src="https://pic2.zhimg.com/100/v2-da73a95f212550700306980b57dbe611_hd.png" alt="">
              </router-link>
              <div class="specialsHeader">
                <div class="specialsInfo">
                  <router-link :to="{name: 'funWithTag', params: {tag: tagItem.tag.name}}" class="specialsTitle">{{tagItem.tag.name}}</router-link>
                  <div class="specialsMeta">
                    <span>2020-12-31 更新</span>
                    <span>{{tagItem.tag.followCount}} 关注</span>
                  </div>
                </div>
                <el-button type="primary" :plain="isfollowList[tagItem.tag.name]" @click="followTag(tagItem.tag.name)">{{isfollowList[tagItem.tag.name] ? '已关注' : '关注'}}</el-button>
              </div>
              <div class="contentList">
                <div class="contentItem" v-for="(item, index) in tagItem.content" :key="index">
                  <router-link :to="'users/' + item.author_link" class="author">{{item.author}}</router-link>
                  <router-link :to="'post/' + item._id" class="contentTitle">{{item.data.title}}</router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="section-moreButton"></div>
      </div>
      <div class="section">
        <div class="section-header">
          <i class="el-icon-price-tag"></i>
          <span>专栏</span>
        </div>
        <div class="section-body">
          <div class="columns">
            <div class="columnsCard">
              <router-link to="" class="columnsCardAvatar">
                <img src="https://pic3.zhimg.com/v2-a876aff70658d265e18128edf5b73ce4_xl.jpg" alt="">
              </router-link>
              <router-link to="" class="columnsCardTitle">高斋CATTI和MTI翻译专栏</router-link>
              <div class="columnsMeta">
                <span>2,316 关注</span>
                <span>6,666 文章</span>
              </div>
              <div class="columnsCardIntro">高斋翻译，专注做更细致透彻英语翻译讲解</div>
              <el-button type="primary" plain>进入专栏</el-button>
            </div>
          </div>
        </div>
        <div class="section-moreButton"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { getFindIndex, followTag } from '@/axios/request';
import loginJudge from '@/utils/getAuthority';

export default {
  name: 'findIndex',
  beforeRouteEnter(to, from, next) {
    getFindIndex()
    .then(res => {
      if(res.data.message == 'success') {
        next(vm => {
          for(let i in res.data.tag) {
            vm.hotTags[i] = {
              tag: res.data.tag[i],
              content: res.data.tagContent[i]
            }
            vm.$set(vm.isfollowList, res.data.tag[i].name, false);
            if(vm.$store.state.followTagsList.length != 0) {
              for(let j of vm.$store.state.followTagsList) {
                if(j == res.data.tag[i].name) {
                  vm.$set(vm.isfollowList, res.data.tag[i].name, true);
                  break;
                }
              }  
            }
          }
          vm.dataInit = true;
        })
      }
      else {
        next(vm => {
          vm.$notify.error({
            title: '错误',
            message: '数据请求失败'
          })
        })
      }
    })
    .catch(err => {
      console.log(err);
    }) 
  },
  data() {
    return {
      hotTags: [], // 热门标签数据
      isfollowList: {}, // 关注按钮的默认样式
      dataInit: false // 数据是否初始成功
    }
  },
  methods: {
    // 关注标签
    followTag(name) {
      if(!loginJudge.call(this)) return;
      let params = {
        key: this.$store.state.account.followTags,
        tag: name
      }
      followTag(params)
      .then(res => {
        this.$store.commit('updateFollowTags', res.data.newFollowTags);
        this.isfollowList[name] = !this.isfollowList[name];
      })
      .catch(err => {
        console.log(err);
      })
    },
    // 改变关注按钮的样式
    change(tag) {
      this.isfollowList[tag] = !this.isfollowList[tag];
    },
  }
}

</script>
<style lang="scss" scoped>
@import '@/style/commonValue';
@import '@/style/funHomePage';

</style>