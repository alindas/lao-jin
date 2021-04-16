<template>
  <div class="right">
      <slot name="top" />
      <slot name="below" />
    <div class="position" :style="Fixed">
      <slot name="common" />
    </div>
  </div>
</template>

<script>
export default {
    name: "sideBarLayout",
    data () {
        return {
            bol: false,
        }
    },
    props: {
      pageYOffset: {
        default: 0,
        validator: value => {
          return typeof value === 'number';
        }
      },
      fixedDistance: {
        default: '50%',
        validator: value => {
          return typeof value === 'number' || typeof value === 'string';
        }
      }
    },
    computed: {
      Fixed() {
        return this.bol ? {
          position: 'fixed',
          top: this.fixedDistance
        } : {}
      }
    },
    methods: {
        handleScroll () {
          this.bol = window.pageYOffset > this.pageYOffset ? true : false;
        }
    },
    mounted () {
        window.addEventListener('scroll', this.handleScroll)
    },
    destroyed () {
        window.removeEventListener('scroll', this.handleScroll)
    }
}
</script>

<style lang="scss" scoped>
@import "@/style/commonValue";
.right {
  height: auto;
  width: 296px;
  float: right;
  margin-top: 10px;
}

.position {
  position: relative;
  top: 0;
  transition: top 1s ease;
}

.Fixed {
  position: fixed;
  top: 33%;
  transition: position .5s ease;
}

</style>