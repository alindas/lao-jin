import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        account: {}, // 登录的账户信息
        notice: { // 系统通知信息
            chat: {},
            system: {
                '0': 0,
                '1': 0,
                '2': 0
            }
        },
        voteUpList: [], // 登录用户的喜爱文章信息
        collectList: [], // 用户收藏的文章列表
        followList: [], // 用户关注列表
        fansCount: 0, // 用户粉丝数量
        followTagsList: [], // 用户关注的标签列表
        showLoginedDialog: false, // 显示登录对话框
    },
    getters: {
        initState: state => {
            return state.account._id == '' ? false : true;
        },
        userDB: state => {
            return state.account;
        }
    },
    mutations: {
        updateWallet: (state, value) => {
            state.account.account = state.account.account + value.data;
        },
        addChatNotice: (state, value) => {
            state.notice.chat = value.data;
        },
        addSysNotice: (state, value) => {
            state.notice.system[value.type] = state.notice.system[value.type] + 1;
        },
        updateSysNotice: (state, value) => {
            state.notice.system[value] = 0;
        },
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
        initFollowTagsList: (state, value) => {
            state.followTagsList = value;
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
        },
        updateFollowTags: (state, values) => {
            state.followTagsList = values;
        },
        updateAccount: (state, account) => {
            state.account['account'] = account;
        }
    },
    actions: {},
    modules: {}
})