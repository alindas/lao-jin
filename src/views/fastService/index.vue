<template>
	<div>
		<div class="subnav" :style="navHeaderState">
      <div class="container clear">
        <el-dropdown trigger="click" @command="changeSchool">
          <button class="collegesLocation">
            <i class="el-icon-location-information"></i>
            {{university}}
          </button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="广东工业大学">广东工业大学</el-dropdown-item>
            <el-dropdown-item command="华南师范大学">华南师范大学</el-dropdown-item>
            <el-dropdown-item command="广州大学">广州大学</el-dropdown-item>
            <el-dropdown-item command="广州第二师范学院">广州第二师范学院</el-dropdown-item>
            <el-dropdown-item command="中山大学">中山大学</el-dropdown-item>
            <el-dropdown-item command="东莞理工学院">东莞理工学院</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <button class="refresh" title="刷新" @click="refresh">
          <i class="el-icon-refresh" :class="refreshClick ? 'refreshAnimation' : null"></i>
        </button>
      </div>
    </div>
		<section class="clear">
			<div class="container">
				<div class="main">
          <transition-group>
            <div class="list" v-for="(list) in lists" :key="list._id">
              <h2 title="任务"><i class="el-icon-s-order"></i>{{list.content}}</h2>
              <h2 title="时间"><i class="el-icon-dish"></i>{{list.addNotes}}</h2>
              <h2 title="报酬"><i class="el-icon-coin"></i>{{list.reward}}</h2>
              <div class="content">
                <div class="actions">
                  <button class="confirm" @click="confirmOrder(list._id, list.Sponsor)"><i class="el-icon-bicycle"></i>&nbsp;接单</button>
                  <button class="more" @click="showReportDialog(list._id)"><i class="el-icon-s-promotion"></i>&nbsp;举报</button>
                </div>
              </div>
            </div>
            <div class="list" v-if="lists.length == 0" key="emptyBox">
              <div class="emptyBox">暂无数据</div>
            </div>
          </transition-group>
          <el-dialog :visible.sync="report" width="25%" :modal-append-to-body="true"
          :append-to-body="true" :close-on-click-modal="false"  @close="closeReportDialog">
            <h3 slot="title">违规信息举报</h3>
            <el-checkbox-group v-model="reportList">
              <el-checkbox label="低质垃圾信息"></el-checkbox>
              <el-checkbox label="辱骂、人身攻击等不友善行为"></el-checkbox>
              <el-checkbox label="有害信息"></el-checkbox>
              <el-checkbox label="色情暴力"></el-checkbox>
            </el-checkbox-group>
            <el-button plain size='small' @click="reportRequest">提 交</el-button>
          </el-dialog>
				</div>
				<MainSidebar/>
			</div>
		</section>
	</div>
	
</template>

<script>
import MainSidebar from '@/components/sidebar/mainSidebar';
import {reportMess, getLightDemand, confirmLightDemand} from '@/axios/request';
import isLogin from '@/utils/loginJudge';
import getFormateDate from '@/utils/dataFormate';

export default {
	name: "index",
	computed: {
		navHeaderState() {
			return this.$parent.navHeaderState ? {} : {transform: 'translateY(0)'};
		},
    
	},
	data() {
		return {
      refreshClick: false,
      refreshValve: true, // 刷新阀门
      university: '东莞理工学院',
			lists: [],
      report: false, 
			reportID: -1,
			reportList: [], // 举报违规列表
		}
	},
	watch: {
	},
	components: {
		MainSidebar,
	},
	methods: {
    closeReportDialog() {
			this.reportID = -1;
			this.reportList = [];
		},
    showReportDialog(demandId) {
      if(!isLogin.call(this)) return;
      this.report = true;
      this.reportID = demandId;
    },
    reportRequest() {
			reportMess({
				user: localStorage.getItem('account'),
				id: this.reportID,
				list: this.reportList
			})
			.then(res => {
				this.report = false;
				console.log(this.reportID);
			})
		},
    confirmOrder(id, sponsor) {
      if(!isLogin.call(this)) return;
      let { _id, name, avatar, phoneNumber, activities } = this.$store.state.account;
      const Receiver = { _id, name, avatar, phoneNumber, activities};
      if(_id === sponsor._id) {
        this.$message.warning('无法接受自己的订单');
        return;
      }
      let timestamp = getFormateDate('Y/M/d h:m');
      let accept = { timestamp, content: '订单接受成功'};
      confirmLightDemand({id, Receiver, accept, sponsor})
      .then(res => {
        if(res.data.message === 'success') {
          // this.$router.push({
          //   name: 'fastService',
          //   params: { orderId: id }
          // })
          this.$router.push('/fastservice/' + id);  
        }else {
          this.$message.warning('订单已删除或已完成');
          for(let item in this.lists) {
            if(this.lists[item]._id == id) {
              this.lists.splice(item,1);
            }
          }
        }
      })
      
    },
    refresh() {
      this.refreshClick = true;
      if(this.refreshValve) {
        this.refreshValve = false;
        setTimeout(() => {
          const university = this.university;
          getLightDemand({university})
          .then(res => {
            this.refreshClick = false;
            this.refreshValve = true;
            this.lists = res.data.lists;
          })
        }, 2000)
      }
    },
    changeSchool(command) {
      this.university = command;
      this.load();
    },
		load() {
      const university = this.university;
      getLightDemand({university})
      .then(res => {
        this.lists = res.data.lists;
      })
		}
	},
	created() {
    this.load();
	}
}
</script>

<style lang="scss" scoped>
@import '@/style/commonValue';

@include rotateAnimation;

@include animate();


section {
	padding-top: 110px;
}

.subnav {
	background: #fff;
	box-shadow: 0 1px 3px rgba(18, 18, 18, .1);
	position: fixed;
	width: 100%;
	z-index: 99;
	height: 45px;
  line-height: 45px;
	transition: transform .2s;
  transform: translateY(65px);
  .collegesLocation {
    @include button;
    min-width: 150px;
    height: 28px;
    margin: 0 10px;
    padding: 0 10px;
    border-radius: 26px;
    font-size: 14px;
    font-weight: 600;
    color: rgb(144, 147, 153);
    background-color: rgb(244, 244, 245);
    i {
      font-size: 18px;
    }
    &:hover {
      color: rgb(230, 162, 60);
      background-color: rgb(253, 246, 236);
    }
  }
  .refresh {
    border: none;
    outline: none;
    width: 30px;
    height: 28px;
    margin: 0 10px;
    color: rgb(94, 91, 91);
    background-color: transparent;
    cursor: pointer;
    i {
      font-size: 20px;
      font-weight: 500;
      transition: transform .2s linear;
    }
  }
}

.main {
	@include content_main;
}

.list {
  border-top: 1px solid #f0f2f7;
  padding: 10px 20px;
  box-sizing: border-box;
  background: #fff;
  h2 {
    padding: 2px 5px;
    font-size: 18px;
    font-weight: 600;
    cursor: pointer;
    i {
      margin: 0 10px;
    }
    &:first-of-type i{
        color: rgb(131, 130, 130);
      }
    &:nth-of-type(2) i{
      color: rgb(95, 146, 194);
    }
    &:last-of-type i{
      color: goldenrod;
    }
  }
  .actions {
      display: flex;
      align-items: center;
      justify-content: left;
      padding: 10px 20px;
      margin: 0 -20px -10px;
      color: #909399;
      background: #fff;
      button {
        @include button;
        width: 100px;
        height: 34px;
        margin: 0 10px;
        padding: 0 10px;
        border-radius: 34px;
        font-size: 14px;
        font-weight: 600;
        color: rgb(230, 162, 60);
        background-color: rgb(253, 246, 236);
        i {
          font-size: 18px;
        }
        &:hover {
          color: #fff;
          background-color: rgb(230, 162, 60);
        }
        &:last-of-type {
          color: rgb(144, 147, 153);
          background-color: rgb(244, 244, 245);
          &:hover {
            color: #fff;
            background-color: rgb(144, 147, 153);
          }
        }
      }
    }
}

.refreshAnimation {
  animation: refreshRotate 1.2s linear infinite;
}
</style>