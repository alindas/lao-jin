<template>
  <div class="infoManage">
    <ListTable :table-title="title" :select-keys="selectKeys" tabTitle="信息审核" 
    :expand="true" :table-title-expand="expandTitle" :data-table="infoList" :actions="actions"
    @pass="pass" @notPass="notPass" :dataTableLength="dataTableLength"
    @goPage="newInfoList" @searchData="setSearch"/>
  </div>
</template>

<script>
import ListTable from '@/components/common/ShowListData';
import { reqExamineInfoSkip } from '@/axios/request';


export default {
  name: 'InfoManage',
  components: {
    ListTable
  },
  data() {
    return {
      title: [{
        prop: '_id',
        label: 'ID'
      },{
        prop: 'author',
        label: '作者'
      },{
        prop: 'title',
        label: '信息标题'
      },{
        prop: 'releaseDate',
        label: '发表时间'
      },{
        prop: 'tags',
        label: '标签'
      },{
        prop: 'read_count',
        label: '阅读量'
      },],
      expandTitle: [{
        prop: 'author_link',
        label: '作者ID'
      },{
        prop: 'content',
        label: '内容'
      },],
      selectKeys: [],
      searchKey: null,
      dataTableLength: 0,
      infoList: [
        {
          _id: '1',
          author: 'admin',
          title: '作业帮',
          releaseDate: '2020/11/2',
          tag: ['作业，嘿'],
          author_link: '369',
          read_count: 233,
          content: 
          '同城58同城58同城58同城588同城58同城58同城58同城58同城588同城58同城58同城58同城58同城58同城8同城58同城58同城58同城58同城5858同城58同城58同城58同城58同城588同城58同城58同城58同城58同城58同城58同城58同城58同城58同城58同城58同城58同城58同城58同城58同城58同城58同城58同城58同城58同城58同城58同城58同城58同城58同城58同城58同城58同城58同城58同城58同城58同城58同城58同城58同城58同城58同城58同城58同城58同城58同城58同城58同城58同城58同城58同城58同城58同城58同城58同城58同城58同城58同城58同城58同城58同城58同城58同城58同城58同城58同城58同城58同城58同城58同城58同城58同城58同城58同城58同城58同城58同城58同城58同城58同城58同城58同城58同城58同城58同城58同城58同城58同城58同城58同城58同城58同城58同城58同城58同城58同城58同城58同城58同城58同城58同城58同城58同城'
        }
      ],
      actions: [
        {
          name: '通过',
          func: 'pass',
          type: 'success'
        },
        {
          name: '不通过',
          func: 'notPass',
          type: 'danger'
        }
      ]
    }
  },
  methods: {
    load() {
      reqExamineInfoSkip({skip: 0, pageSize: 10, init: true, key: this.searchKey})
      .then(res => {
        this.infoList = this.formatInfoList(res.data.infoList);
        this.dataTableLength = res.data.infoListTotal;
      })
    },
    setSearch(val) {
      this.searchKey = val;
      this.load();
    },
    newInfoList(currentP) {
      let skip = (currentP-1)*10;
      reqExamineInfoSkip({skip, pageSize: 10, key: this.searchKey})
      .then(res => {
        this.infoList = res.data.infoList;
      })
    },
    // 将请求数据扁平化
    formatInfoList(arrayObj) {
      let newArrayObj= [];
      arrayObj.forEach((item, index) => {
        let tags = '';
        let newItem = {};
        item.data.tags.forEach((item, index) => {
          tags += index == 0 ? item.name : ('/' + item.name)
        })
        newItem._id = item._id;
        newItem.title = item.data.title;
        newItem.tags = tags;
        newItem.content = item.data.content;
        newItem.releaseDate = item.data.releaseDate;
        newItem.author = item.author;
        newItem.author_link = item.author_link;
        newItem.read_count = item.read_count;
        newArrayObj[index] = newItem;
      })
      return newArrayObj;
    },
    pass(index) {
      console.log(index);
    },
    notPass(index) {
      console.log(index);
    }
  },
  created() {
    this.load();
  }
}

</script>
<style>
.infoManage {
  height: inherit;
}
</style>