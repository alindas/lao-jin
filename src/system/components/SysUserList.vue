<template>
  <div class="sysuserList">
     <div class="content-box" ref="contentBox">
      <ListTableHeander 
        tabTitle="用户列表"
        :optionsList="optionsList"
        @setOptions="setOptions"
      />
      <ListTable 
      :maxHInit="maxHInit"
      :ListTableMaxH="ListTableMaxH"
      :table-title="title" 
      :data-table="userList" 
      :actions="actions"
      :dataTableLength="dataTableLength"
      @goPage="newUserList"
      />
    </div>
  </div>
</template>

<script>
import ListTable from '@/components/common/DataListContent';
import ListTableHeander from '@/components/common/DataListHeader';
import { reqLoginedUserSkip } from '@/axios/request';

export default {
  name: 'SysUserList',
  components: {
    ListTable,
    ListTableHeander
  },
  data() {
    return {
      maxHInit: false,
      ListTableMaxH: 0,
      title: [{
        prop: '_id',
        label: 'ID'
      },{
        prop: 'name',
        label: '用户名'
      },{
        prop: 'phoneNumber',
        label: '注册电话'
      },{
        prop: 'profession',
        label: '个人职业'
      },{
        prop: 'introduction',
        label: '个人简介'
      },],
      optionsList: [
        {
          key: 'users-search',
          category: 'search',
          value: undefined,
          reminder: 'ID/用户名/电话'
        }
      ],
      dataTableLength: 0,
      userList: [
        {
          _id: '1',
          name: 'admin',
          phoneNumber: 10086,
          profession: '程序猿',
          introduction: '好人'
        }
      ],
      actions: [
        {
          name: '封禁',
          func: 'ban',
          type: 'danger'
        },
        {
          name: '解封',
          func: 'disBan',
          type: 'success'
        }
      ]
    }
  },
  methods: {
    load() {
      reqLoginedUserSkip({skip: 0, pageSize: 10, init: true, key: this.optionsList[0].value})
      .then(res => {
        this.userList = res.data.userList;
        this.dataTableLength = res.data.usrListTotal;
      })
    },
    // 数据切页
    newUserList(currentP) {
      let skip = (currentP-1)*10;
      reqLoginedUserSkip({skip, pageSize: 10, key: this.searchKey})
      .then(res => {
        this.userList = res.data.userList;
      })
    },
    setOptions(val) {
      for(let i of this.optionsList) {
        if(i.key == val[0]) {
          i.value = val[1];
          this.load();
          break;
        }
      }
    },
    setSelect(val) {
      this.selectKey = val;
      this.load();
    },
  },
  created() {
    this.load();
  },
  mounted() {
    // 设置数据表格最大高度
    const contentBox = this.$refs.contentBox;
    this.ListTableMaxH = contentBox.clientHeight - contentBox.clientTop - 66;
    this.maxHInit = true;
  }
}

</script>
<style>
  .sysuserList {
    height: inherit;
  }

  .content-box {
    box-sizing: border-box;
    width: 100%;
    height: inherit;
    padding: 10px 10px 0;
  }
</style>