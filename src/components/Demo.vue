<template>
  <div class="demo">
    demo
  </div>
</template>

<script>
import Axios from 'axios'

export default {
  name: 'demo',
  data() {
    return {
      data: ''
    }
  },
  methods: {
    load() {
      Axios.get('http://localhost:8848/')
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      })

    }
  },
  created() {
    this.load();
  }
}

</script>
<style scoped>
  .demo {
    position: absolute;
    width: 500px;
    height: 300px;
    top: 200px;
    left: 50%;
    margin-left: -50%;
  }
</style>