<template>
  <div class="container">
    <div id="score"></div>
    <canvas id="game" width="375" height="375"></canvas>
    <div id="introduction">按住鼠标搭建一个梯子</div>
    <div id="perfect">双倍积分</div>
    <button id="restart">重新开始</button>
  </div>
</template>

<script>
import Game from '@/assets/utils/special'
export default {
  name: 'Special',
  mounted() {
    Game();
  }
}

</script>
<style lang="scss" scoped>
@import '@/style/special';
</style>