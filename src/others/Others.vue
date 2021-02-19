<template>
  <div id="app">
    <router-view/>
  </div>
 
  
</template>

<script>
import {confirmLoginedMes} from '@/axios/request';
import {getCookie} from '@/assets/utils/cookie';

export default {
  name: 'Other',
  created() {
    if(localStorage.getItem('account')) {
      confirmLoginedMes({account: localStorage.getItem('account'), token: getCookie('token')})
      .then(res => {
        if(res.data.message == 'success') {
          this.$store.commit("updateAccount", res.data.data)
        }
      })
    }
  }
}

</script>
<style lang="scss">
@import '@/style/commonValue';
@import '@/style/common';
</style>