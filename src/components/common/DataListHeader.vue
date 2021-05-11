<template>
  <div class="header-info">
    <div class="header-info-title">
      <span>{{ tabTitle }}</span>
    </div>
    <div class="header-info-opitons">
      <template v-for="item in optionsList">
        <div class="select-options" v-if="item.category == 'select'" :key="item.key">
          <el-select
            v-model="optionsData[item.key]"
            size="small"
            :placeholder="item.reminder"
            @change="setOptions(item.key)"
          >
            <el-option
              v-for="temp in item.options"
              :key="temp.value"
              :label="temp.label"
              :value="temp.value"
            >
            </el-option>
          </el-select>
        </div>
        <div class="input-options" v-if="item.category == 'search'" :key="item.key">
          <el-input
            v-model="optionsData[item.key]"
            size="small"
            :placeholder="item.reminder"
            clearable
            @keyup.enter.native="setOptions(item.key)"
          ></el-input>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DaltaListHeader',
  props: {
    // 表格标题
    tabTitle: {
      type: String,
      default: '实例标题'
    },
    // 条件限制框列表
    optionsList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      // 条件限制框内容
      optionsData: {},
    }
  },
  methods: {
    setOptions(item) {
      this.$emit('setOptions', [item, this.optionsData[item]]);
    }
  },
  created() {
    this.optionsData = {
      ...this.optionsList.key
    }
  }
};
</script>

<style lang="scss" scoped>
  .header-info {
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 50px;
    border-bottom: 1px solid #e8eaec;
    .header-info-title {
      width: 120px;
      height: 100%;
      text-align: center;
      line-height: 50px;
      span {
        font-size: 15px;
        font-weight: 900;
      }
    }
    .header-info-opitons {
      box-sizing: border-box;
      padding-top: 10px;
      div {
        display: inline-block;
        width: 150px;
        &:first-child {
          margin-right: 10px;
        }
      }
      
    }
  }
</style>