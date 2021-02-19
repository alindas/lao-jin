<template>
  <section class="clear">
    <div class="container">
      <div class="main">
        <div class="chatWrapper">
          <div class="chat">
            <div class="chatSideBar">
              <div class="chatSearch">
                <el-input
                  size="medium"
                  v-model="chatSearchName"
                  placeholder="搜索联系人"
                  clearable
                  @focus="bol = true"
                  @blur="bol = false">
                <i class="el-icon-search el-input__icon search" slot="suffix" :class="{hidden:bol}"></i>
                </el-input>
              </div>
              <div class="chatListGroup" v-show="bol">
                <div class="content searchGroup">
                  <div class="list-item" v-for="(item,index) in SearchUserList.phoneRegister" :key="index"
                    >
                    <div class="avatar">
                      <img src="@/assets/head-pic.png" alt="">
                    </div>
                    <div class="list-item-content">
                      <div class="user-name">
                        <span class="name">{{item.name}}</span>
                      </div>
                      <div class="snippet">
                        {{item.introduction}}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="chatListGroup" v-show="!bol">
                <h3 class="title" @click="showChatListGroup = !showChatListGroup">
                  <span>最近联系</span>
                  <i class="el-icon-arrow-right" :style="titleState"></i>
                </h3>
                <div class="content" :style="contentState">
                  <div class="list-item" v-for="(item,index) in MessageList" :key="index"
                    :style="currentSession(item._id)" 
                    @click="current = item._id">
                    <div class="avatar">
                      <img :src="item.sessionA.account == loginedAcc ? Avatar(item.sessionB.avatar) : Avatar(item.sessionA.avatar)" alt="">
                    </div>
                    <div class="list-item-content">
                      <div class="user-name">
                        <span class="name">{{item.sessionA.account == loginedAcc ? item.sessionB.name : item.sessionA.name}}</span>
                        <span class="time">{{item.latestTime}}</span>
                      </div>
                      <div class="snippet">
                        {{item.latestContent}}
                      </div>
                    </div>
                    <el-popover placement="bottom" width="80" class="action">
                      <button class="more" @click="deleteDialog(index)">&nbsp;删除</button>
                      <button class="more">&nbsp;举报</button>
                      <i class="el-icon-more" slot="reference"></i>
                    </el-popover>
                  </div>
                </div>
              </div>
            </div>
            <div class="chatBox">
              <Chat v-if="init" 
                :current-message-key="currentMessageKey" 
                :current-session-resources="currentSessionResources"
                :sendStatus="sendStatus" 
                @SendMess="sendMessage(arguments)"
                @DeleteMess="deleteMess"/>
            </div>
          </div>
          <div class="footer"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Chat from '@/components/common/chat';
import { getChatMessage, userSearch, sendChatMessage } from '@/axios/request';

export default {
  name: 'letter',
  components: {
    Chat,
  },
  computed: {
    titleState() {
      return this.showChatListGroup ? 
      { transform: "rotate(90deg)", transition: "transform 300ms ease 0s"} : 
      { transform: "rotate(0deg)", transition: "transform 300ms ease 0s"};
    },
    contentState() {
      return this.showChatListGroup ? 
      { height: "502px", transition: "height 300ms ease 0s"} : 
      { height: "0", transition: "height 300ms ease 0s"};
    },
    currentMessageKey() {
      for(let i of this.MessageList) {
        if(i._id == this.current) return i.content;
      }
      return null;
    },
    currentSessionResources() {
      for(let i of this.MessageList) {
        if(i._id == this.current) {
          return i.accountA == this.loginedAcc ? 
          {
            name: i.sessionB.name,
            avatar:  i.sessionB.avatar
          } : 
          { 
            name: i.sessionA.name,
            avatar:  i.sessionA.avatar
          }
        }
      }
      return null;
    },
    // 用于辨别私信数据中的己方和对方数据
    loginedAcc() {
      return localStorage.getItem('account');
    }
    
  },
  data() {
    return {
      init: false, // 数据是否已完成初始化
      sendStatus: 0, // 用于回调chat 组件发送状态
      bol: false, // 检索输入框状态码
      chatSearchName: '',
      showChatListGroup: true,  // 是否展开用户聊天列表
      current: '',  // 当前聊天窗口标记
      MessageList: [],  // 用户联系人列表
      // 用于是否产生时间线标记
      MessageListStatus: {},
      SearchUserList: {}, // 储存用户搜索结果集
      searchCD: null, // 用户搜索框节流码
    }
  },
  watch: {
    '$route.params.key': function(newVal, oldVal) {
      this.current = newVal;
    },
    'chatSearchName': function(newVal, oldVal) {
      this.search(newVal);
    },
    // 判断是否为搜索状态
    '$route.query.state': function(newVal) {
      if(newVal) {
        document.querySelector('.chatSearch').querySelector('.el-input__inner').focus();
      }
    },
  },
  methods: {
    currentSession(id) {
      return this.current == id ? { "background-color": "#f6f6f6"} : {};
    },
    // 返回私信双方头像
    Avatar(data) {
      return 'data:'+data.minetype+';base64,'+data.base64;
    },
    // chat 聊天框的消息发送
    sendMessage(data) {
      console.log(data);
      let preTime = this.MessageListStatus[this.current];
      let timeline = true;
      if(preTime && data[0].time - preTime < 300000) {
        timeline = false;
      }
      this.MessageListStatus[this.current] = data[0].time;
      // 包装发送数据
      let chatContent = {};
      chatContent.key = this.current;
      chatContent.contentKey = data[0].contentKey;
      chatContent.sendDate = data[0].date;
      chatContent.content = {
        "name":  this.loginedAcc,
        "text": data[0].value,
        "timeLine": timeline,
        "read": false
      };
      chatContent.latestTime = data[0].date.substr(5,5);
      chatContent.latestContent = data[0].value;
      sendChatMessage(chatContent)
      .then(res => {
        /** 更新视图 */
        this.sendStatus ++;
      })
      
    },
    // 删除chat 聊天框的信息记录
    deleteMess(key) {
      for(let item in this.MessageList[this.current].content) {
          if(item == key) {
            delete this.MessageList[this.current].content[item];
            return;
          }
        }
    },
    // 删除聊天对话框列表
    deleteDialog(key) {
      this.$confirm('是否删除对话?', '删除对话', {
        confirmButtonText: '确定',
        confirmButtonClass: 'confirmButton',
        cancelButtonText: '取消',
        cancelButtonClass: 'cancelButton',
        center: true,
        showClose: false,
        closeOnClickModal: false,
        customClass: 'chatRemoveDialog'
      })
      .then(() => {
        // 获取对话列表的key 值，如果当前chat 对话框为要删除的列表key 值，
        // 则获取它的上一或下一对话列表key 并赋值给chat 对话框
        let MessageListKeys = Object.keys(this.MessageList);
        for(let i = 0;i<MessageListKeys.length;i++) {
          if(MessageListKeys[i] == key) {
            delete this.MessageList[MessageListKeys[i]];
            if(this.current == MessageListKeys[i]) {
              if(MessageListKeys[i+1]) {
                this.current = MessageListKeys[i+1];
              }
              else if(MessageListKeys[i-1]) {
                this.current = MessageListKeys[i-1];
              }
              else this.current = '';
            }
            this.$forceUpdate();
            return;
          }
        }
      })
      .catch(() => {
        return;
      })
      
    },
    // 检索联系人
    search(val) {
      /**
       * 这里实现检索请求的防抖操作，没有输入动作500ms 后请求资源
       */
      clearTimeout(this.searchCD);
      this.searchCD = setTimeout(() => {
        console.log(val);
        userSearch()
        .then(res => {
          this.SearchUserList = res.data;
        })
        .catch(err => {
          console.log(err);
        })
      },800)
    },
    // 加载组件元数据
    load() {
      if(this.$route.query.state) {
        document.querySelector('.chatSearch').querySelector('.el-input__inner').focus();
      }
      this.current = this.$route.params.key ? this.$route.params.key : '';
      getChatMessage({account: localStorage.getItem('account')})
      .then(res => {
        this.init = true;
        this.MessageList = res.data;
      })
      .catch(err => {
        console.log(err);
      })
      // 将初始加载进来的私信列表会话间隔时间置为0
      for(let i of this.MessageList) {
        this.MessageListStatus[i._id] = 0;
      }
    }
  },
  mounted() {
    this.load();
  }
}

</script>
<style lang="scss" scoped>
@import '@/style/commonValue';
@import '@/style/letter';
</style>