<template>
  <section class="clear">
    <div class="container">
      <div class="main">
        <div class="chatWrapper">
          <div class="chat"
            v-loading="!init"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(255, 255, 255, 0.667)">
            <div class="chatSideBar">
              <div class="chatSearch">
                <el-input
                  size="medium"
                  v-model="chatSearchName"
                  placeholder="搜索联系人"
                  clearable
                  @change="search"
                  @focus="bol = true"
                  @blur="bol = false">
                <i class="el-icon-search el-input__icon search" slot="suffix" :class="{hidden:bol}"></i>
                </el-input>
              </div>
              <div class="chatListGroup" v-show="bol || contactsFocus">
                <div class="content searchGroup"
                  @mouseenter="contactsFocus = true" 
                  @mouseleave="contactsFocus = false"
                  @click="contactsFocus = false">
                  <div class="list-item" v-for="(item,index) in SearchUserList" :key="index"
                    @click="goChat(item)">
                    <div class="avatar">
                      <img :src="Avatar(item.avatar)" alt="">
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
              <div class="chatListGroup" v-show="!bol && !contactsFocus">
                <h3 class="title" @click="showChatListGroup = !showChatListGroup">
                  <span>最近联系</span>
                  <i class="el-icon-arrow-right" :style="titleState"></i>
                </h3>
                <div class="content" :style="contentState">
                  <div class="list-item" v-for="(item,index) in MessageList" :key="index"
                    :style="currentSession(item._id)" 
                    @click="changeChatView(item)">
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
              <el-upload
              action="http://localhost:8848/users/chatSendPic"
              name="chatPic"
              class="chatPicInput"
              :data="chatContent"
              :show-file-list="false"
              :on-success="sendPicSuccess"
              :before-upload="confirmChatPic">
              <i class="chatPicInput" ref="sendPicBtn"></i>
              </el-upload>
              <Chat v-if="init" 
                :current-message-key="currentMessageKey" 
                :current-session-resources="receiver"
                :sendStatus="sendStatus" 
                @SendMess="sendMessage(arguments)"
                @SendPic="sendPic"
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
import Chat from '@/views/letter/chat';
import { getChatMessage, 
  getIndexMain, 
  sendChatMessage,
  createNewChat } from '@/axios/request';

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
    // 用于辨别私信数据中的己方和对方数据
    loginedAcc() {
      return localStorage.getItem('account');
    }
    
  },
  data() {
    return {
      init: false, // 数据是否已完成初始化
      sendStatus: null, // 用于驱动chat 组件更新内容
      bol: false, // 检索输入框状态码
      contactsFocus: false, // 如果当前在搜索用户展示列表中则不关闭展示页面
      chatSearchName: '',
      showChatListGroup: true,  // 是否展开用户聊天列表
      current: '',  // 当前聊天窗口标记
      receiver: '', // 当前窗口会话人
      MessageList: [],  // 用户联系人列表
      // 用于是否产生时间线标记
      MessageListStatus: {},
      SearchUserList: {}, // 储存用户搜索结果集
      searchCD: null, // 用户搜索框防抖
      chatContent: null // 发送图片信息更新载体
    }
  },
  watch: {
    '$route.params.key': function(newVal, oldVal) {
      for(let item of this.MessageList) {
        if(item._id === newVal) {
          this.current = newVal;
          this.receiver = item.sessionA.account == this.loginedAcc ? item.sessionB : item.sessionA;
          break;
        }
      }
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
    // 更换对话窗口
    changeChatView(item) {
      this.current = item._id;
      this.receiver = item.sessionA.account == this.loginedAcc ?   
        item.sessionB : item.sessionA;
    },
    // chat 聊天框的消息发送
    sendMessage(data) {
      let preTime = this.MessageListStatus[this.current];
      let timeline = true;
      if(preTime && data[0].time - preTime < 300000) {
        timeline = false;
      }
      this.MessageListStatus[this.current] = data[0].time;
      // 包装发送数据
      let content = {
        "name":  this.loginedAcc,
        "text": data[0].value,
        "timeLine": timeline,
        "read": false
      };
      let chatContent = {
        key: this.current,
        receiver: this.receiver.account,
        contentKey: data[0].contentKey,
        sendDate: data[0].date,
        content,
        latestTime: data[0].date.substr(5,5),
        latestContent: data[0].value
      };
      sendChatMessage(chatContent)
      .then(res => {
        /** 更新视图 */
        for(let item of this.MessageList) {
          if(item._id === this.current) {
            item.latestTime = chatContent.latestTime;
            item.latestContent = chatContent.latestContent;
            break;
          }
        }
        this.sendStatus = {
          key: data[0].date,
          content
        };
      })
      
    },
    confirmChatPic(file) {
      // const correctFormat = (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg');
      const correctFormat = /^image\//.test(file.type);
      const isLt1M = file.size / 1024 / 1024 < 1;
      if (!correctFormat) {
        this.$message.warning('图片仅支持 JPG JPEG PNG 格式!');
      }
      if (!isLt1M) {
        this.$message.warning('图片大小不能超过 1MB!');
      }
      return correctFormat && isLt1M;
    },
    // chat 发送图片
    sendPic(data) {
      let preTime = this.MessageListStatus[this.current];
      let timeline = true;
      if(preTime && data.time - preTime < 300000) {
        timeline = false;
      }
      this.MessageListStatus[this.current] = data.time;
      // 包装发送数据
      let content = {
        "name":  this.loginedAcc,
        "text": data.value,
        "timeLine": timeline,
        "read": false
      };
      this.chatContent = {
        key: this.current,
        receiver: this.receiver.account,
        contentKey: data.contentKey,
        sendDate: data.date,
        content: JSON.stringify(content),
        latestTime: data.date.substr(5,5),
        latestContent: data.value
      };
      this.$refs.sendPicBtn.click();
    },
    // 头像文件成功上传的回调
    sendPicSuccess(res, file) {
      if(res.message == 'success') {
        /** 更新视图 */
        for(let item of this.MessageList) {
          if(item._id === this.current) {
            item.latestTime = this.chatContent.latestTime;
            item.latestContent = this.chatContent.latestContent;
            break;
          }
        }
        const content = JSON.parse(this.chatContent.content);
        content.url = URL.createObjectURL(file.raw);
        this.sendStatus = {
          key: this.chatContent.sendDate,
          content
        };
      }
      else {
        this.$message.error('发送失败！');
      }
    },
    // 删除chat 聊天框的信息记录
    deleteMess(key) {
      console.log(`${key}已删除`);
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
        const data = this.MessageList;
        for(let i = 0;i<data.length;i++) {
          if(i == key) {
            if(this.current == data[i]._id) {
              if(data[i+1]) {
                this.current = data[i+1]._id;
                this.receiver = data[i+1].sessionA.account == this.loginedAcc ?   
                  data[i+1].sessionB : data[i+1].sessionA;
              }
              else if(data[i-1]) {
                this.current = data[i-1]._id;
                this.receiver = data[i-1].sessionA.account == this.loginedAcc ?   
                  data[i-1].sessionB : data[i-1].sessionA;
              }
              else this.current = '';
            }
            this.MessageList.splice(i,1);
            // delete this.MessageList[MessageListKeys[i]];
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
    search() {
      if(this.chatSearchName == '') {
        this.SearchUserList = [];
        return false;
      } else if(this.searchCD) {
        clearTimeout(this.searchCD);
      }
      this.searchCD = setTimeout(() => {
        getIndexMain({
          type: 'search',
          query: this.chatSearchName,
          searchType: 'users'
        })
        .then(res => {
          this.SearchUserList = res.data;
        })
        .catch(err => {
          console.log(err);
        })
      }, 800)
    },
    // 点击搜索的联系人家在会话
    goChat(contacts) {
      const sponsor = {
        _id: this.$store.state.account._id,
        name: this.$store.state.account.name,
        avatar: this.$store.state.account.avatar
      };
      const receiver = contacts;
      createNewChat({ sponsor, receiver })
      .then(res => {
        this.MessageList.push(res.data.chat)
        this.current = res.data.chat._id;
        this.receiver = {
          account: contacts._id,
          avatar: contacts.avatar,
          name: contacts.name
        }
      })
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
        for(let item of this.MessageList) {
          if(item._id == this.current) {
            this.changeChatView(item);
            break;
          }
        }
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