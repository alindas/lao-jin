<template>
  <div class="content">
    <header>
      <div class="container clear">
        <div class="pic">
          <a href="/">
            <img src="~@/assets/logo.png" alt="logo">
          </a>
        </div>
        <i class="flag"></i>
        <div class="pagetitle">
          <span>信息发布</span>
          <span>{{toolTip}}</span> 
        </div>
        <div class="menu">
          <div class="action">
            <el-dropdown>
              <el-button plain @click="saveRelease">
                发布<i class="el-icon-arrow-down"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="saveDrafts">
                  保存草稿
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <div class="more">
            <el-dropdown trigger="click" placement="top">
              <span class="el-dropdown-link" title="更多">
                <i class="el-icon-more "></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <router-link to="/others/drafts">
                    我的草稿
                  </router-link>
                </el-dropdown-item>
                <el-dropdown-item >
                   <a @click="myRelease">我的发布</a> 
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
      </div>
    </header>
    <section class="clear">
      <div class="container">
        <el-form ref="form" :model="releaseForm" label-width="80px" :rules="releaseFormRules">
          <el-form-item label="信息标题" prop="title">
            <el-input v-model="releaseForm.title"></el-input>
          </el-form-item>
          <el-form-item label="招聘数量">
            <el-input-number v-model="releaseForm.recruitNumber" :min="1" :max="10" label="描述文字"></el-input-number>
          </el-form-item>
          <el-form-item label="有效时间" prop="daterange">
            <el-date-picker
              v-model="releaseForm.effectiveTime"
              type="daterange"
              align="left"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="拒绝人妖">
            <el-switch v-model="releaseForm.delivery"></el-switch>
          </el-form-item>
          <el-form-item label="兼职分类" prop="sort">
            <el-checkbox-group v-model="releaseForm.sort">
              <el-checkbox label="校内兼职" name="type"></el-checkbox>
              <el-checkbox label="校外兼职" name="type"></el-checkbox>
              <el-checkbox label="长期工作" name="type"></el-checkbox>
              <el-checkbox label="小时工" name="type"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="信息标签">
            <el-tag 
              v-for="tag in releaseForm.tags" 
              :key="tag" 
              closable
              :disable-transitions="false"
              @close="handleClose(tag)">
              {{tag}}
            </el-tag>
            <el-input
              class="input-new-tag"
              v-if="inputVisible"
              v-model="dynamicTag"
              ref="saveTagInput"
              size="small"
              @keyup.enter.native="handleInputConfirm"
              @blur="handleInputConfirm"
            >
            </el-input>
            <el-button v-else class="button-new-tag" size="small" @click="showInput">+ </el-button>
          </el-form-item>
          <el-form-item label="补充说明" prop="content">
            <el-input type="textarea" class="moreInfo" :autosize="{minRows: 6}" resize="none" v-model="releaseForm.content"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </section>
  </div>
</template>

<script>
import { getCenterMessage, updateDrafts, updateRelease } from '@/axios/request';

export default {
  name: 'Release',
  computed: {
    draftsPath() {
      // return '/personal/' + this.$store.state.account._id + '/release';
      return '/';
    }
  },
  data() {
    // 自定义标题验证器
    let SWFilter = (rule, value, callback) => {
      if(value === '') {
        return callback(new Error('信息标题不能为空'));
      }
      /**
       * 异步请求进行敏感内容检测
       */
      setTimeout(() => {
        if(value.search(/nm|垃圾|操你妈/g) != -1) {
         callback(new Error('内容不规范，请重新审查'));
        }
        else {
         callback();
        }
      }, 500)
    };
    // 自定义补充内容验证器
    let SWFilter_m = (rule, value, callback) => {
      /**
       * axios 请求实现敏感内容检测
       */
      setTimeout(() => {
        if(value.search(/nm|垃圾|操你妈/g) != -1) {
         callback(new Error('内容不规范，请重新审查'));
        }
        else {
         callback();
        }
      }, 500)
    };
    return {
      toolTip: '编辑中', // 操作提示信息
      // 日期选择快捷内容
      pickerOptions: {
          shortcuts: [{
            text: '未来三天',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              end.setTime(start.getTime() + 3600 * 1000 * 24 * 3);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '未来一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              end.setTime(start.getTime() + 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '未来一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              end.setTime(start.getTime() + 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
      // 表单项
      releaseForm: {
          key: '',
          title: '',
          recruitNumber: '',
          effectiveTime: [],
          delivery: false,
          sort: [],
          tags: [],
          content: ''
        },
      // 表单验证规则
      releaseFormRules: {
        title: [
          { validator: SWFilter, required: true, trigger: 'blur' }
        ],
        effectiveTime: [
          { required: true, message: '请选择有效时间', trigger: 'change' }
        ],
        sort: [
          { required: true, message: '请至少选择一个信息分类', trigger: 'change' }
        ],
        content: [
          { validator: SWFilter_m, trigger: 'change' }
        ]
      },
      inputVisible: false, // 标签输入视图切换标记
      dynamicTag: '', // 添加标签时input 框内容载体
      

    }
  },
  watch: {
  },
  methods: {
    // 发布内容
    saveRelease() {
      let upsetData = {
        releaseKey: this.$store.state.account.release,
        draftsKey: this.$store.state.account.drafts,
        type: this.$route.query.id ? 'fromDrafts' : '',
        data: this.releaseForm,
      }
      updateRelease(upsetData)
      .then(res => {
        if(res.data.message == 'success') {
          window.location.href = '/post';
        }
        else {
          this.$message.error('服务器错误，稍后重试');
        }
      })
      .catch(err => {
        console.log(err);
      })
    },
    // 保存为草稿
    saveDrafts() {
      let upsetData = {
        key: this.$store.state.account.drafts,
        data: this.releaseForm,
      }
      updateDrafts(upsetData)
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      })
    },
    // 以下三项用于动态添加tag 标签
    handleClose(tag) {
      this.releaseForm.dynamicTags.splice(this.releaseForm.dynamicTags.indexOf(tag), 1);
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInputConfirm() {
      let dynamicTag = this.dynamicTag;
      if (dynamicTag) {
        this.releaseForm.dynamicTags.push(dynamicTag);
      }
      this.inputVisible = false;
      this.dynamicTag = '';
    },
    // 判断是否需要渲染原草稿内容
    renderDrafts() {
      if(this.$route.query.id) {
        getCenterMessage({
          type: 'drafts', 
          key: this.$store.state.account.drafts,
          single: 1,
          singleKey: this.$route.query.id })
        .then(res => {
          this.releaseForm = res.data[0][this.$route.query.id];
        })
        .catch(err => {
          console.log(err);
        })
      }
      else return;
    },
    // 对请求过来的数据进行处理
    transformData(data) {
      console.log(data);
    },
    // 返回我的主页并显示发布内容
    myRelease() {
      window.location.href = '/personal/'+this.$store.state.account._id+'/release';
    }
  },
  created() {
    this.renderDrafts();
  },
  mounted() {
  }
}

</script>
<style lang='scss' scoped>
@import '@/style/commonValue';
@import '@/style/othersMain';
</style>