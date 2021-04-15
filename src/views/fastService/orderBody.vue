<template>
  <section>
    <div class="orderBody">
      <div class="orderIntro">
        <div class="customer" v-if="!isSponsor">
          <img :src="sponsorAvatar" alt="">
          <span>{{order.Sponsor.name}}</span>
          <span><i class="el-icon-phone"></i>{{ order.Sponsor.phoneNumber }}</span>
        </div>
        <div class="customer" v-else-if="isAccepct">
          <img :src="receiverAvatar" alt="">
          <span>{{order.Receiver.name}}</span>
          <span><i class="el-icon-phone"></i>{{ order.Receiver.phoneNumber }}</span>
        </div>
        <div class="customer none" v-else>
          <span>待接单...</span>
        </div>
        <div class="orderMess">
          <h2 title="订单编号"><i class="el-icon-paperclip"></i>{{order._id}}</h2>
          <h2 title="任务"><i class="el-icon-s-order"></i>{{order.content}}</h2>
          <h2 title="时间"><i class="el-icon-dish"></i>{{order.addNotes}}</h2>
          <h2 title="报酬"><i class="el-icon-coin"></i>{{order.reward}}</h2>
          <div class="action-btn-box">
            <button class="finish-btn btn" @click="orderAction('finish')" v-if="isAccepct">订单完成</button>
            <button class="cancel-btn btn" @click="orderAction('cancel')" v-if="isSponsor && !isAccepct">订单取消</button>
          </div>
          
        </div>
      </div>
      <div class="orderTimeline">
        <el-timeline>
          <el-timeline-item v-for="item in order.timeLines" :key="item.content" 
          :timestamp="item.timestamp" placement="top">
            <el-card>
              <h4>{{item.content}}</h4>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </div>
      
    </div>
    
  </section>
</template>

<script>
import { getLightDemandSingle, updataLightDemand, createNewChat } from '@/axios/request';
export default {
  name: 'orderBody',
  data() {
    return {
      order: {
        "Sponsor": {
          "_id": "",
          "phoneNumber": "",
          "avatar": {
            "mimetype": "image/jpeg",
            "base64": ""
          },
          "name": ""
        },
        "Receiver": {},
        "content": "",
        "addNotes": "",
        "reward": 0,
        "timeLines": "",
        "chatHist": "",
        "university": "",
        "accepct": false
        }
    }
  },
  watch: {
    '$route.params.id': function (id) {
      this.load();
    }
  },
  computed: {
    sponsorAvatar() {
      return 'data:'+this.order.Sponsor.avatar.minetype+';base64,'+this.order.Sponsor.avatar.base64;
    },
    receiverAvatar() {
      return 'data:'+this.order.Receiver.avatar.minetype+';base64,'+this.order.Receiver.avatar.base64;
    },
    isSponsor() {
      return this.order.Sponsor._id === this.$store.state.account._id;
    },
    isAccepct() {
      return this.order.accept;
    }
  },
  methods: {
    async load() {
      const id = this.$route.params.id;
      let res = await getLightDemandSingle({id});
      this.order = res.data.contentBody;
    },
    orderAction(type) {
      const data = {
        id: this.$route.params.id,
        reward: this.order.reward,
      }
      let { avatar:savatar, ...sponsor } = this.order.Sponsor;
      data.sponsor = sponsor;
      if(type != 'cancel') {
        let { avatar:ravatar, ...receiver } = this.order.Receiver;
        data.receiver = receiver;
      }
      const reqType = type == 'finish' ? 
        (sponsor._id == localStorage.getItem('account') ? 'sponsorFinish' : 'receiverFinish') :
        type;
      data.reqType = reqType;
      updataLightDemand(data)
      .then(res => {
        if(res.data.message === 'success') {
          this.$router.push('/relax');
          this.$message({
            message: res.data.decs
          });
        }
      })
    },
    goChat() {
      const sponsor = this.order.Sponsor;
      const receiver = this.order.Receiver;
      createNewChat({
        sponsor,
        receiver
      })
      .then(res => {
        console.log(res.data.chat);
        this.$router.push({
          name: 'lettersWKey',
          params: {
            key: res.data.chat._id
          }
        })
      })
    }
  },
  created() {
    this.load();
  }
}

</script>
<style lang="scss">
@import '@/style/commonValue';

section {
  padding-top: 65px;
}

.orderBody {
  margin: 10px auto;
  width: 694px;
  display: block;
  .orderIntro {
    position: relative;
    box-sizing: border-box;
    padding: 10px;
    height: 80px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .customer {
      flex: 1 1;
      font-size: 16px;
      font-weight: 600;
      img {
        width: 40px;
        border-radius: 40px;
        margin-right: 10px;
        vertical-align: middle;
      }
      span {
        margin-right: 10px;
        &:first-of-type {
          font-size: 16px;
          font-weight: 700;
        }
        &:last-of-type {
          font-size: 14px;
          font-weight: 600;
          i {
            font-size: 17px;
            color: $light-gray;
          }
        }
      }
    }
    .orderMess {
      position: absolute;
      bottom: 0;
      right: 0;
      transform: translateY(100%);
      width: 270px;
      height: 300px;
      box-shadow: 0 0 1px 2px rgba(161, 160, 160, 0.048);
      h2 {
        padding: 2px 5px;
        font-size: 18px;
        font-weight: 600;
        word-break: break-all;
        cursor: pointer;
        i {
          margin: 0 10px;
        }
        &:first-of-type i{
          color: rgb(230, 120, 113);
        }
        &:nth-of-type(2) i{
          color: rgb(131, 130, 130);
        }
        &:nth-of-type(3) i{
          color: rgb(95, 146, 194);
        }
        &:last-of-type i{
          color: goldenrod;
        }
      }
      .action-btn-box {
        display: flex;
        padding: 20px 10px; 
        justify-content: space-between;
        align-items: center;
        .btn {
          @include button;
          width: 6.5rem;
          height: 2.5rem;
          border-radius: 2.5rem;
          line-height: 2.5rem;
          text-align: center;
        }
        .finish-btn {
          border:1px solid #fAAf00;
          background-color: rgb(253, 246, 236);
          color:#fAAf00;
          &:hover {
            background-color: #fAAf00;
            color:#fff;
          }

        }
        .cancel-btn {
          border:1px solid rgb(211, 212, 214);
          background-color: rgb(244, 244, 245);
          color: rgb(144, 147, 153);
          &:hover {
            background-color: rgb(144, 147, 153);
            color:#fff;
          }
        }
      }
    }
  }
  .orderTimeline {
    width: 400px;
    
  }
}

.none {
  height: 40px;
  line-height: 40px;
  opacity: .5;
  cursor: default;
  span {
    display: inline-block;
    transform: scale(1.3);
  }
}


</style>