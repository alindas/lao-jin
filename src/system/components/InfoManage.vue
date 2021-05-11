<template>
  <div class="infoManage">
    <div class="content-box" ref="contentBox">
      <ListTableHeander
        :optionsList="optionsList"
        tabTitle="信息审核"
        @setOptions="setOptions"
      />
      <ListTable 
      :maxHInit="maxHInit"
      :ListTableMaxH="ListTableMaxH"
      :table-title="title" 
      :expand="true"
      :table-title-expand="expandTitle" 
      :data-table="infoList" 
      :actions="actions"
      @pass="pass" 
      @notPass="notPass" 
      :dataTableLength="dataTableLength"
      @goPage="newInfoList"
      />
    </div>
  </div>
</template>

<script>
import ListTable from '@/components/common/DataListContent';
import ListTableHeander from '@/components/common/DataListHeader';
import { reqExamineInfoSkip, ApprovalMessage } from '@/axios/request';


export default {
  name: 'InfoManage',
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
      optionsList: [
        {
          key: 'info-select',
          category: 'select',
          value: undefined,
          reminder: '条件过滤',
          options: [
          {
            value: 'check',
            label: '新发布审查'
          },
          {
            value: 'report',
            label: '用户举报审查'
          }],
        },
        {
          key: 'info-search',
          category: 'search',
          value: undefined,
          reminder: 'ID/作者/标题'
        }
      ],
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
          content: ''
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
      reqExamineInfoSkip({skip: 0, pageSize: 10, init: true, searchKey: this.optionsList[1].value, selectKey: this.optionsList[0].value})
      .then(res => {
        this.infoList = this.formatInfoList(res.data.infoList);
        this.dataTableLength = res.data.infoListTotal;
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
        newItem.comment_content = item.comment_content;
        newItem.comment_count = item.comment_count;
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
          author: index.author_link,
          comment_content: index.comment_content,
          comment_count: index.comment_count
        })
      }
      else {
        resultN = ApprovalMessage({
          type: 'check',
          result: false,
          id: index._id,
          author: index.author_link,
          comment_content: index.comment_content

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
    
    }
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
  .infoManage {
    height: inherit;
  }
  .content-box {
    box-sizing: border-box;
    width: 100%;
    height: inherit;
    padding: 10px 10px 0;
  }
</style>