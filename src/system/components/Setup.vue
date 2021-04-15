<template>
  <div class="sys-setup">
    <div class="Statistics">
      <h2 class="statis-title">数据库使用信息</h2>
      <el-progress type="circle" :percentage="25"></el-progress>
      <div class="explain"> 说明文字</div>
    </div>
    <div class="Statistics">
      <h2 class="statis-title">注册用户数</h2>
      <el-progress type="circle" :percentage="25"></el-progress>
      <div class="explain"> 说明文字</div>
    </div>
    <div class="Statistics">
      <h2 class="statis-title">兼职信息条数</h2>
      <el-progress type="circle" :percentage="25"></el-progress>
      <div class="explain"> 说明文字</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Setup'
}

</script>
<style lang="scss">
  .sys-setup {
    display: flex;
    justify-content: space-around;
    height: inherit;
    padding: 20px 10px;
    .Statistics {
      width: 200px;
      height: 200px;
      border-radius: 5px;
      border: 1px solid #e8eaec;
      text-align: center;
      cursor: pointer;
      &:hover {
        box-shadow: 0 0 1px 2px rgba(228, 235, 238, 0.5);
      }
    }
    .statis-title {
      margin-bottom: 10px;
    }
  }
</style>