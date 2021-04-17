<template>
  <div class="content-box" ref="contentBox">
    <div class="header-info">
      <div class="header-info-title">
        <span>{{tabTitle}}</span>
      </div>
      <div class="header-info-opitons">
        <div class="select-options">
          <el-select v-model="selectKey" size="small" placeholder="条件过滤" @change="setSelectKey">
            <el-option
              v-for="item in selectKeys"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="input-options">
          <el-input v-model="searchKey" size="small" :placeholder="inputRemind" clearable @keyup.enter.native="searchData"></el-input>
        </div>
      </div>
    </div>
    <div class="table-content">
      <el-table
        :data="dataTable"
        :height="maxH"
        :header-cell-style="{backgroundColor: '#f8f8f9'}">
        <el-table-column v-if="expand" type="expand">
          <template slot-scope="scope">
            <ul class="expand-content">
              <li v-for="item in tableTitleExpand" :key="item.prop">
                <span class="label">{{item.label}}</span>
                <div class="expand-data" v-if="item.label == '举报信息'">
                  <p v-for="item in scope.row[item.prop]" :key="item.reportId">
                    {{item.reportId}} :  {{item.list.join(' | ')}}
                  </p>
                </div>
                <div class="expand-data" v-else>
                  {{scope.row[item.prop]}}
                </div>
              </li>
            </ul>
          </template>
        </el-table-column>
        <el-table-column v-for="item in tableTitle" :key="item.prop" 
          :label="item.label" :width="item.prop == '_id' ? '150' : ''" >
          <template slot-scope="scope">
            <span>{{scope.row[item.prop]}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="200"
          v-if="actions">
          <template slot-scope="scope">
            <el-button v-for="item in actions" :key="item.name"
              @click.native.prevent="handleData(scope.row, item.func)"
              size="mini" :type="item.type" plain>
              {{item.name}}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-block">
        <el-pagination
          @current-change="goPage"
          background
          layout="prev, pager, next, jumper"
          :total="dataTableLength"
          @prev-click="prePage"
          @next-click="nextPage">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ShowListData',
  props: {
    // 是否为展开形式
    expand: {
      type:Boolean,
      defalut: false
    },
    // 默认展开表单标题
    tableTitleExpand: {
      type: Array,
      defalut: () => []
    },
    // 表格标题
    tabTitle: {
      type: String,
      default: '实例标题'
    },
    // 条件筛选框
    selectKeys: {
      type: Array,
      default: () => []
    },
    // 列表项标题
    tableTitle: {
      type: Array,
      require: true
    },
    // 数据总量
    dataTableLength: {
      type: Number,
      require: true
    },
    // 表格数据
    dataTable: {
      type: Array,
      require: true
    },
    // 数据操作方法
    actions: {
      type: Array,
      defalut: () => []
    }
  },
  data() {
    return {
      searchKey: '',
      selectKey: '',
      init: false,
      maxH: 400,
      pcm: false, // page cut mark，用于响应单次切页事件
    }
  },
  computed: {
    // 模糊查询关键字提醒
    inputRemind() {
      return this.tableTitle[0].label + '/' + this.tableTitle[1].label + '/'
      + this.tableTitle[2].label;
    }
  },
  methods: {
    setSelectKey() {
      this.$emit('selectData', this.selectKey);
    },
    searchData() {
      this.$emit('searchData', this.searchKey);
    },
    // 前往某页
    goPage(currentP) {
      if(this.pcm == true) {
        this.pcm = false;
        return;
      }
      this.$emit('goPage', currentP);
    },
    // actions 操作
    handleData(index, funcName) {
      this.$emit(funcName, index);
    },
    // 上一页
    prePage(currentP) {
      this.pcm = true;
      this.$emit('goPage', currentP);
    },
    // 下一页
    nextPage(currentP) {
      this.pcm = true;
      this.$emit('goPage', currentP);
    }
  },
  mounted() {
    // 设置数据表格最大高度
    this.maxH = this.$refs.contentBox.offsetHeight - 50;
  }
}

</script>
<style lang="scss" scoped>
  .content-box {
    box-sizing: border-box;
    width: 100%;
    height: inherit;
    padding: 15px 10px 0;
  }

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

  .table-content {
    .pagination-block {
      height: 32px;
      margin-top: 10px;
    }
    .expand-content {
      li {
        line-height: 25px;
        .label {
          display: inline-block;
          width: 60px;
          color: #99a9bf;
          vertical-align: top;
        }
        .expand-data {
          display: inline-block;

        }
      }
    }
  }

  
  
</style>