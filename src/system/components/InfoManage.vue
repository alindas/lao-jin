<template>
  <div class="infoManage">
    <ListTable 
    :table-title="title" 
    :select-keys="selectKeys"
    tabTitle="信息审核" 
    :expand="true"
    :table-title-expand="expandTitle" 
    :data-table="infoList" 
    :actions="actions"
    @pass="pass" 
    @notPass="notPass" 
    :dataTableLength="dataTableLength"
    @goPage="newInfoList"
    @searchData="setSearch"
    @selectData="setSelect"/>
  </div>
</template>

<script>
import ListTable from '@/components/common/ShowListData';
import { reqExamineInfoSkip, ApprovalMessage } from '@/axios/request';


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
      },{
        prop: 'report',
        label: '举报信息'
      }],
      selectKeys: [
        {
          value: 'check',
          label: '新发布审查'
        },
        {
          value: 'report',
          label: '用户举报审查'
        }
      ],
      searchKey: null,
      selectKey: null,
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
      reqExamineInfoSkip({skip: 0, pageSize: 10, init: true, searchKey: this.searchKey, selectKey: this.selectKey})
      .then(res => {
        this.infoList = this.formatInfoList(res.data.infoList);
        this.dataTableLength = res.data.infoListTotal;
      })
    },
    setSearch(val) {
      this.searchKey = val;
      this.load();
    },
    setSelect(val) {
      this.selectKey = val;
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
        newItem.check = item.check;
        newItem.report = item.report;
        newArrayObj[index] = newItem;
      })
      return newArrayObj;
    },
    pass(index) {
      let resultN;
      if(index.report.length) {
        resultN = ApprovalMessage({
          type: 'report',
          result: true,
          id: index._id,
          author: index.author_link
        })
      }
      else {
        resultN = ApprovalMessage({
          type: 'check',
          result: true,
          id: index._id,
          author: index.author_link
        })
      }
      resultN
      .then(res => {
        if(res.data.message == 'success') {
          this.$message({
            type: 'success',
            message: '处理成功'
          });
          for(let i in this.infoList) {
            if(this.infoList[i]._id == index._id) {
              this.infoList.splice(i, 1);
            }
          }
        }
        else {
          this.$message.error('处理失败');
        }
      })
    },
    notPass(index) {
      let resultN;
      if(index.report.length) {
        resultN = ApprovalMessage({
          type: 'report',
          result: false,
          id: index._id,
          author: index.author_link
        })
      }
      else {
        resultN = ApprovalMessage({
          type: 'check',
          result: false,
          id: index._id,
          author: index.author_link
        })
      }
      resultN
      .then(res => {
        if(res.message == 'success') {
          this.$message({
            type: 'success',
            message: '处理成功'
          });
          for(let i in this.infoList) {
            if(this.infoList[i]._id == index._id) {
              this.infoList.splice(i, 1);
            }
          }
        }
        else {
          this.$message.error('处理失败');
        }
      })
    
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