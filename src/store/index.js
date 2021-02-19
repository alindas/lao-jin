import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    account: {}, // 登录的账户信息
    voteUpList: [], // 登录用户的喜爱文章信息
    collectList: [], // 用户收藏的文章列表
    followList: [], // 用户关注列表
    fansCount: 0, // 用户粉丝数量
    showLoginedDialog: false, // 显示登录对话框
  },
  getters: {
    initState: state => {
      return state.account._id == '' ? false : true;
    }
  },
  mutations: {
    showLoginedDialog: state => {
      state.showLoginedDialog = !state.showLoginedDialog;
    },
    initAccount: (state, value) => {
      state.account = value;
    },
    initVoteUpList: (state, value) => {
      state.voteUpList = value;
    },
    initCollectList: (state, value) => {
      state.collectList = value;
    },
    initFollowList: (state, value) => {
      state.followList = value;
    },
    initFansCount: (state, value) => {
      state.fansCount = value;
    },
    updateFollowList: (state, options) => {
      if (!options[1]) {
        state.followList.unshift(options[0]);
      } else {
        for (let i in state.followList) {
          if (state.followList[i] == options[0]) {
            state.followList.splice(i, 1);
          }
        }
      }
    },
    updateAccountSingle: (state, values) => {
      state.account[values[0]] = values[1];
    }
  },
  actions: {},
  modules: {}
})