<template>
  <div class="content">
    <div class="not_found">
      <i class="ribbon"></i>
      <div class="not_found_404">
        <span>4</span>
        <span>0</span>
        <span>4</span>
      </div>
      <div class="menu">
        <el-button plain @click="back('/')">首页</el-button>
        <el-button plain @click="back('#')">返回上页</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'error',
  methods: {
    back(url) {
      if(url == '#') {
        window.history.go(-1);
      }
      else {
        window.location.href = '/';
      }
    }
  }
}

</script>
<style lang="scss">
@import '@/style/page_404';
</style>