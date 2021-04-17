<template>
  <div>
    <div class="chat-box" v-if="currentMessageKey">
      <div class="chat-box-title">
        <span>{{currentSessionResources.name}}</span>
      </div>
      <div class="messageBox-wrapper">
        <div class="messageBox">
          <div class="message-wrapper" v-for="item of Object.keys(contentBody)" :key="item">
            <p class="message-time" v-if="contentBody[item].timeLine">{{TimeLine(item)}}</p>
            <div class="message-w reserve" v-if="contentBody[item].name == loginedAcc">
              <div class="avatar"><a href="#"><img :src="avatarSelf" alt=""></a></div>
              <div class="message-content reserve">
                <div class="message-pic sender" v-if="contentBody[item].url" @click="enlarge(contentBody[item].url)">
                  <img :src="seePicUrl(contentBody[item].url)" alt="">
                </div>
                <div class="message-text sender" v-else>{{contentBody[item].text}}</div>
                <el-popover placement="bottom" width="80" class="message-status">
                  <button class="more" @click="removeMessage(item)">&nbsp;删除</button>
                  <i class="el-icon-more" slot="reference"></i>
                </el-popover>
              </div>
            </div>
            <div class="message-w" v-else>
              <div class="avatar"><a href="#"><img :src="avatarB" alt=""></a></div>
              <div class="message-content">
                <div class="message-pic receiver" v-if="contentBody[item].url" @click="enlarge(contentBody[item].url)">
                  <img :src="seePicUrl(contentBody[item].url)" alt="">
                </div>
                <div class="message-text receiver" v-else>{{contentBody[item].text}}</div>
                <el-popover placement="bottom" width="80" class="message-status">
                  <button class="more" @click="removeMessage(item)">&nbsp;删除</button>
                  <button class="more">&nbsp;举报</button>
                  <i class="el-icon-more" slot="reference"></i>
                </el-popover>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="inputBox">
        <ul class="toolBar">
          <li class="toolBar-item" @click="emojiPicker = !emojiPicker">
            <icon name="emoji" scale="5" class="chatavg"></icon>
          </li>
          <li class="toolBar-item" @click="sendPic">
            <icon name="picture" scale="5" class="chatavg"></icon>
          </li>
          <div class="emojiPicker" v-show="emojiPicker == true">
            <VEmojiPicker @select="selectEmoji" />
          </div>
        </ul>
        <label for="input-content" class="input">
          <textarea class="input-content" 
            @keydown.enter = "handleEnterKey"
            @keydown.tab = "handleTabKey"
            v-model="inputMessage" />
        </label>
        <div class="footer">
          <div class="tip">Ctrl or ⌘ + Enter</div>
          <el-button type="primary" size="small" @click="sendMessage()">发送</el-button>
        </div>
      </div>
    </div>
    <div class="chat-box" v-else>
      <img src="@/assets/message2.png" alt="" class="chat-box-bgc">
    </div>
    <el-dialog :visible.sync="seeSendPic">
      <img width="100%" :src="seePicUrl(picUrl)" alt="">
    </el-dialog>
  </div>
  
</template>

<script>
import getFormateDate from '@/utils/dataFormate';
import { getCursorPosition, setCursorPosition } from '@/utils/handleCursorPosition';
import { getChatMessageContent } from '@/axios/request';

export default {
  name: 'chat',
  props: {
    currentMessageKey: {
      required: true
    },
    currentSessionResources: {
      required: true
    },
    sendStatus: {
      default: null,
      required: true
    }
  },
  computed: {
    // 用于辨别私信数据中的己方和对方数据
    loginedAcc() {
      return localStorage.getItem('account');
    },
    avatarSelf() {
      return `data:${this.$store.state.account.avatar.minetype};base64,${this.$store.state.account.avatar.base64}`;
    },
    avatarB() {
      return `data:${this.currentSessionResources.avatar.minetype};base64,${this.currentSessionResources.avatar.base64}`;
    },
    contentBodyLength() {
      return Object.keys(this.contentBody).length; 
    }
  },
  data() {
    return {
      contentBody: {},
      inputMessage: '',
      seeSendPic: false,
      emojiPicker: false,
      picUrl: '',
      sendContentBody: null
    }
  },
  watch: {
    currentMessageKey(newValue) {
      this.requestData(newValue)
    },
    sendStatus() {
      this.contentBody[this.sendStatus.key] = this.sendStatus.content;
      this.$forceUpdate();
      this.showLatestChat();
    },
    '$store.state.notice.chat': function(newVal) {
      this.contentBody[newVal.key] = newVal.content;
      this.$forceUpdate();
    }
  },
  methods: {
    seePicUrl(url) {
      return typeof url === 'object' ? `data:${url.mimetype};base64,${url.base64}` : url;
    },
    enlarge(url) {
      this.seeSendPic = true;
      this.picUrl = url;
    },
    requestData(key) {
      getChatMessageContent({key: key})
      .then(res => {
        this.contentBody = res.data[0];
        this.$nextTick(() => {
          this.showLatestChat();
        })
      })
    },
    selectEmoji(emoji) {
      let $textarea = document.querySelector('.input-content');
      let startPos = $textarea.selectionStart;
      let endPos = $textarea.selectionEnd;
      let resultText = $textarea.value.substring(0, startPos) + emoji.data + $textarea.value.substring(endPos);
      $textarea.value = resultText;
      $textarea.focus();
      $textarea.selectionStart = startPos + emoji.data.length;
      $textarea.selectionEnd = startPos + emoji.data.length;
      this.inputMessage = resultText;
    },
    // Ctrl or ⌘ + Enter 发送
    handleEnterKey(event) {
      if(!(event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        let $textarea = document.querySelector('.input-content');
        let $index = getCursorPosition($textarea);
        let preStr = this.inputMessage.slice(0, $index);
        let sufStr = this.inputMessage.slice($index);
        this.inputMessage = preStr + '\n' + sufStr;
        this.$nextTick(() => {
          setCursorPosition($textarea, $index + 1);
          $textarea.scrollTop = $textarea.scrollHeight - $textarea.clientHeight;
        });
      }
      else {
        event.preventDefault();
        this.sendMessage();
      }
    },
    // tab 缩进
    handleTabKey(event) {
      event.preventDefault();
      let $textarea = document.querySelector('.input-content');
      let $index = getCursorPosition($textarea);
      let preStr = this.inputMessage.slice(0, $index);
      let sufStr = this.inputMessage.slice($index);
      this.inputMessage = preStr + '    ' + sufStr;
      this.$nextTick(() => {
        setCursorPosition($textarea, $index + 4);
      });
    },
    sendMessage() {
      if(this.inputMessage === '') {
        return;
      }
      this.emojiPicker = false;
      let date = getFormateDate('yyyy-MM-dd hh:mm:ss');
      let time = new Date().getTime();
      let params = {
        date,
        value: this.inputMessage,
        time,
        contentKey: this.currentMessageKey
      }
      this.$emit('SendMess', params);
      this.inputMessage = '';
    },
    sendPic() {
      let date = getFormateDate('yyyy-MM-dd hh:mm:ss');
      let time = new Date().getTime();
      let params = {
        date,
        value: '[图片]',
        time,
        contentKey: this.currentMessageKey
      }
      this.$emit('SendPic', params);
    },
    removeMessage(key) {
      this.$confirm('是否删除该条消息?', '删除消息', {
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
        delete this.contentBody[key];
          // this.$emit('DeleteMess',this.contentBody[cl[cl.length - 2]]);
        this.$forceUpdate(); // 强制刷新this.contentBody
      })
      .catch(() => {
        return;
      })
    },
    // 总是显示chatDialog 对话框的最底部
    showLatestChat() {
      let ele = document.querySelector('.messageBox');
      if(ele) {
        this.$nextTick(() => {
          ele.scrollTop = ele.scrollHeight - ele.clientHeight;
        })
      }
    },
    // 会话时间线
    TimeLine(time) {
      return time.substr(5, 11);
    },
    load() {
      if(this.currentMessageKey) {
        this.requestData(this.currentMessageKey);
      }
    }
  },
  created() {
    this.load();
  }
}

</script>
<style lang="scss" scoped>
@import '@/style/commonValue';
@import '@/style/chat';

</style>