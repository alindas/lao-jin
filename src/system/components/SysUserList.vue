<template>
  <div class="sysuserList">
    <ListTable :table-title="title" :select-keys="selectKeys" tabTitle="用户列表"
    :data-table="userList" :actions="actions" :dataTableLength="dataTableLength"
    @goPage="newUserList" @searchData="setSearch"/>
  </div>
</template>

<script>
import ListTable from '@/components/common/ShowListData';
import { reqLoginedUserSkip } from '@/axios/request';

export default {
  name: 'SysUserList',
  components: {
    ListTable
  },
  data() {
    return {
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
      selectKeys: [],
      searchKey: null,
      dataTableLength: 0,
      userList: [
        {
          _id: '1',
          name: 'admin',
          phoneNumber: 10086,
          profession: '程序猿',
          introduction: '好人'
        },
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
      reqLoginedUserSkip({skip: 0, pageSize: 10, init: true, key: this.searchKey})
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
    // 设置搜索条件
    setSearch(val) {
      this.searchKey = val;
      this.load();
    }
  },
  created() {
    this.load();
  }
}

</script>
<style>
  .sysuserList {
    height: inherit;
  }
</style>