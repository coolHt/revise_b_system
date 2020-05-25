<!--投递人列表-->
<template>
  <div>
    <transition name="loadShadow">
      <div class="loadShadow" v-show="loadDeliverLists">
        <i class="loadgif"></i>
      </div>
    </transition>
    <div class="deliversList">
      <p class="deliveryListJob">{{jobName}}</p>
      <ul class="resume_collection">
        <li class="resume_item" v-for="(d, index) in deliverLists" :key="index">
          <router-link target="_blank" :to="{name:'resume', query:{cvid:d.cvid,userid:d.userid,jobname:jobName}}">
            <!-- <span class="postTime">投递时间:
            </span> -->
            <p class="resume_intent">
              <span style="margin-right:15px;">求职意向:</span>
              <!--期望岗位 -->
              <span class="member_brief">{{jobName}}</span>
              <!--期望地点 -->
              <span class="member_brief">{{d.PurStation}}</span>
            </p>
            <p class="resume_intent">
              <span style="margin-right:15px;">手机号码:</span>
              <!--手机号码 -->
              <span class="member_brief">{{d.usertel}}</span>
            </p>
            <div class="resume_member">
              <img :src="avatarImg" class="member_avatar">
              <div class="member_info">
                <!-- 名字/年龄/当前状态 -->
                <p class="member_name">{{d.psnBaseInfo.psnName}} <span class="cheetStyle">{{d.age}}岁</span></p>
                <div class="deliveryField">
                  <div class="deliveryFieldSingle">
                    <span class="deliveryFieldSingle_title">性别:</span>
                    <span class="deliveryFieldSingle_value">{{d.psnBaseInfo.psnSex ? d.psnBaseInfo.psnSex : "未填写"}}</span>
                  </div>
                  <div class="deliveryFieldSingle">
                    <span class="deliveryFieldSingle_title">出生年月:</span>
                    <span class="deliveryFieldSingle_value" v-if="d.psnPersonInfo.psnBirth">{{d.psnPersonInfo.psnBirth | formatDate}}</span>
                    <span class="deliveryFieldSingle_value" v-else>未填写</span>
                  </div>
                  <div class="deliveryFieldSingle">
                    <span class="deliveryFieldSingle_title">最高学历:</span>
                    <span class="deliveryFieldSingle_value">{{d.psnBaseInfo.psnEduLvl ? d.psnBaseInfo.psnEduLvl : "未填写"}}</span>
                  </div>
                </div>
                <div class="deliveryField">
                  <div class="deliveryFieldSingle">
                    <span class="deliveryFieldSingle_title">工作年限:</span>
                    <span class="deliveryFieldSingle_value">{{d.psnBaseInfo.psnEduLvl ? d.psnBaseInfo.psnWorkExp : "未填写"}}</span>
                  </div>
                  <div class="deliveryFieldSingle">
                    <span class="deliveryFieldSingle_title">期望年薪:</span>
                    <span class="deliveryFieldSingle_value">{{d.psnJobIntentInfo.psnIntentPay ? d.psnJobIntentInfo.psnIntentPay + "万" : "未填写"}}</span>
                  </div>
                  <div class="deliveryFieldSingle">
                    <span class="deliveryFieldSingle_title">期望职能:</span>
                    <span class="deliveryFieldSingle_value">{{d.psnJobIntentInfo.psnStrFuncNames ? d.psnJobIntentInfo.psnStrFuncNames : "未填写"}}</span>
                  </div>
                </div>
              </div>
            </div>
          </router-link>
        </li>
      </ul>
      <!--投递人列表分页-->
      <div v-if="dataPageSize > 0">
        <el-pagination :page-size="dataPageSize" :pager-count="5" layout="prev, pager, next" :total="totalDeliver"
        @next-click="changeDeliver" @prev-click="changeDeliver" @current-change="changeDeliver">
      </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import xz from "../common";
  export default {
    props: {
      //接受当前的职位名称(因为接受的职位信息格式不同，所以从里面拿职位名称麻烦，不如直接传一个)
      jobName: {
        type: String,
        default: ''
      },
      //jobid用来获取当前职位下的人
      jobId: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        //数据列表页码
        dataCurrentNum: 1,
        dataPageSize: 10,
        //默认头像
        avatarImg: require('../assets/images/avatar1.png'),
        psnBaseInfo: {},
        psnPersonInfo:{},
        psnJobIntentInfo: {},
        jobid: "",
        totalDeliver: 0,
        deliverLists: [],
        loadDeliverLists: true
      }
    },
    watch: {
      'jobId': {
        handler: function () {
          if (this.jobId) {
            this.dataCurrentNum = 1;
            this.dataPageSize = 10;
            this.jobid = this.jobId;
            this.changeDeliver();
          }
        },
        immediate: true
      }
    },
    methods: {
      //投递人翻页
      changeDeliver(page) {
        this.dataCurrentNum = page ? page : 1;
        this.loadDeliverLists = true;
        xz.deliveryList(
          this.jobid,
          this.dataCurrentNum,
          this.dataPageSize
        ).then( res => {
          if(res){
            this.totalDeliver = res.totalnum;
            let list = res.msg.userinflst;
            if(Array.isArray(list)){
              list.forEach( l => {
                l.psnBaseInfo = l.userinf.psnBaseInfo ? l.userinf.psnBaseInfo : {};
                l.psnPersonInfo = l.userinf.psnPersonInfo ? l.userinf.psnPersonInfo : {};
                l.psnJobIntentInfo = l.userinf.psnJobIntentInfo ? l.userinf.psnJobIntentInfo : {};
                
                let age = "";
                if(l.psnPersonInfo.psnBirth){
                  age = new Date().getFullYear() - new Date(l.psnPersonInfo.psnBirth).getFullYear();
                }else{
                  age = "未填写";
                }
                l.age = age;
              })
              this.deliverLists = list;

            }else{
              this.totalDeliver = 0;
              this.deliverLists = [];
            }
          }else{
            this.totalDeliver = 0;
            this.deliverLists = [];
          }
          this.loadDeliverLists = false;
          
          console.log(res);
        });
      },
    }
  }
</script>
<style scoped>
.deliveryField{
  width: 100%;
  display: flex;
  justify-content: flex-start;
  margin-bottom: 10px;
}
.deliveryFieldSingle{
  display: flex;
}
.deliveryFieldSingle span{
  display: block;
  color: #333;
  font-size: 14px;
}
.deliveryFieldSingle_title{
  width: 65px;
}
.deliveryFieldSingle_value{
  width: 150px;
}
</style>