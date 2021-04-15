<template>
  <div class="welcome">
    <span class="text">Admin， {{nowtime}}，欢迎来到捞金管理系统</span>
  </div>
</template>

<script>
export default {
  name: 'Index',
  data() {
    return {

    }
  },
  computed: {
    nowtime() {
      let hour = new Date().getHours();
      if(hour >= 6 && hour < 12) {
        return '早上好';
      }else if(hour == 12) {
        return '中午好';
      }else if(hour >12 && hour < 18) {
        return '下午好';
      }else if (hour >=18 && hour <= 22) {
        return '晚上好';
      }else {
        return '夜深了';
      }
    }
  }
}

</script>
<style scoped>
  .welcome {
    width: 100%;
    height: 73px;
    text-align: center;
    line-height: 73px;
  }

   .text {
     color: #525b6f;
     font-size: 25px;
     font-weight: 500;
   } 
</style>