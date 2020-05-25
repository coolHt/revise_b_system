<template>
  <div class="jobDetailItem">
    <div class="row">
      <p class="job_name" style="margin-bottom: 10px;">{{jobinfo.entJobName}}
        <span class="label label-sm label-success resolveBtn" v-if="hasApproveal" >
          <a @click="parentPass" style="color: #fff;">通过</a>
        </span>
        <span class="label label-sm label-danger rejectBtn" v-if="hasApproveal"  >
          <a @click="parentBeforeClose" style="color: #fff;">拒绝</a>
        </span>
      </p>
      <h1 class="jobDetailTitle">基本要求</h1>
      <div class="jobDetailMargin">
        <ul class="jobDetailUl">
          <li class="jobDetail_li" v-for="(infor,index) in baseRequest" :key="index">
            <span class="li_title">{{infor.name}}: </span>
            <span class="li_text">{{infor.value}}</span>
          </li>
        </ul>
      </div>
      <h1 class="jobDetailTitle">面试设置</h1>
      <div class="jobDetailMargin" style="padding-top: 15px;padding-bottom: 15px;" v-if="interviewList.length > 0">
        <div class="interviewOperator">
          <div class="interviewMember">
            <div class="interviewMember_title">
              <span class="interviewMember_title_field">面试人:</span>
              <span>{{interviewList[0].Username}}</span>
            </div>
            <div class="interviewMember_title">
              <span class="interviewMember_title_field">面试号码:</span>
              <span>{{interviewList[0].Usertel}}</span>
            </div>
          </div>
        </div>
        <div class="interviewData" v-for="(item, index) in interviewList" :key="index">
          <div class="interviewTime" >
            <span class="interviewMember_title_field">开始日期:</span>
            <span>{{item ? item.interviewTime : ''}}</span>
          </div>
          <div class="interviewTime">
            <span class="interviewMember_title_field">开始时间</span>
            <span>{{item ? item.DtBvtime : ''}}</span>
          </div>
          <div class="interviewTime">
            <span class="interviewMember_title_field">结束时间</span>
            <span>{{item ? item.DtEvtime : ''}}</span>
          </div>
        </div> 
      </div>
      <h1 class="jobDetailTitle">职位福利</h1>
      <div class="jobDetailMargin">
        <span v-for="(tag,index) in jobinfo.entWelfareTag" :key="index" class="btn-add">{{tag}}</span>
      </div>
      <h1 class="jobDetailTitle">职位介绍</h1>

      <div class="jobDetailMargin">
        <p class="article" v-html="jobinfo.entJobExplan"></p>
      </div>
      <h1 class="jobDetailTitle">扩展要求</h1>
      <div class="jobDetailMargin">
        <span v-for="(tag,index) in jobinfo.entJobOtherTag" :key="index" class="btn-add">{{tag}}</span>
        <span v-for="(tag,index) in jobinfo.entJobToolTag" :key="index" class="btn-add">{{tag}}</span>
        <span v-for="(tag,index) in jobinfo.entJobSkillTag" :key="index" class="btn-add">{{tag}}</span>
        <span v-for="(tag,index) in jobinfo.entJobKnowTag" :key="index" class="btn-add">{{tag}}</span>

      </div>
    </div>
    <div class="companyBrief">
      <img :src="avatarImg" alt="" class="company_avatar" :error="this.src=avatarImg">
      <p>公司名称: {{briefInfo.entName}}</p>
      <p>公司规模: {{briefInfo.entScale}}</p>
      <p>公司类型: {{briefInfo.entClass}}</p>
      <!-- <p>所在行业: {{briefInfo.entIndustry}}</p> -->
      <p>公司地址: {{company_nation}} {{briefInfo.entAdd}}</p>
      <p class="profileText">简介: {{briefInfo.entSummary}}</p>
    </div>
    <!--拒绝此项目dialog-->
    <el-dialog title="备注" :visible.sync="closeDialogVisible" width="30%" append-to-body>
      <el-form>
        <el-form-item label="拒绝理由：">
          <el-input type="textarea" :autosize="{ minRows: 4}" v-model="closeMsg.content"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialogVisible = false" class="btn-def">取消</el-button>
        <el-button @click="funClose" class="btn-sub">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import Cookies from "vue-cookies";
  import xz from "../common";
  import {
    allLocation,
    province,
    city,
    area,
    findCode,
    findValue,
    circult
  } from "../assets/areaData.js";
  export default {
    props: {
      sendjobid: String, //pubic
      sententid: String, //所在的企业id
      currentIndex: {
        type: Number,
        default: 0,
      },
      //显示操作
      operateApproveal: ''
    },
    data: function () {
      return {
        userid: "",
        entid: "",
        jobid: "",
        closeDialogVisible: false,
        //拒绝项目理由
        closeMsg: {
          jobid: "",
          content: ""
        },
        //公司简介
        avatarImg: require('../assets/images/company_avatar.jpg'),
        intAvatar: require('../assets/images/company_avatar.jpg'),
        company_nation: "",//公司地址
        //职位详情
        languageLevel:"",//语言要求
        
        //通过、拒绝按钮
        hasApproveal: true,
        //基本要求
        baseRequest:[
          // {name:"当前行业",value:""},
          {name:"职位职能",value:""},
          {name:"所在地点",value:""},
          {name:"工作类型",value:""},
          {name:"工作经验",value:""},
          {name:"最低学历",value:""},
          {name:"职位年薪",value:""},
          {name:"掌握外语",value:""}
        ],
        //企业信息
        companyInfor: [
          {name:"销售额规模",value:""},
          {name:"产品种类",value:""},
          {name:"制造工艺",value:""},
          {name:"质量体系",value:""},
          {name:"制造商等级",value:""},
          {name:"配套客户名称",value:""},
          {name:"出口市场",value:""}
        ],
        //面试信息
        interviewList: []
      };
    },
    watch: {
      'operateApproveal': {
        handler: function () {
          if (this.operateApproveal) {
            this.hasApproveal = false
          } else {
            this.hasApproveal = true
          }
        },
        immediate: true
      },
      //获取职位信息
      sendjobid: {
        handler: function () {
          this.jobid = this.sendjobid;
          this.entid = this.sententid;
          //获取职位信息
          this.$store.commit("getJobInfor",this.jobid);
          //获取企业简介
          this.$store.commit("companyProfile",this.entid);
          //获取面试信息
          xz.getInterviewInformation(this.jobid).then(res => {
            if(res){
              if(Array.isArray(res)){
                if(res.length > 0){
                  let list = res;
                  list.forEach( l => {
                    let formatDate = this.$store.getters.formatDate(l.DtvDate);
                    l.interviewTime = formatDate;
                  })
                  this.interviewList = list;
                }else{
                  this.interviewList = [];
                }
              }else{
                this.interviewList = [];
              }
            }else{
              this.interviewList = [];
            }
            
            console.log(this.interviewList);
          });
        },
        immediate: true
      },
    },
    created() {
      this.userid = Cookies.get("userid-b");
      this.entid = Cookies.get("entid-b");
    },
    computed: {
      //企业基本信息
      briefInfo(){
        //转code 
        if (this.$store.state.COMPANYINTRODUCTION.briefInfo.entNation) {
          if(circult(this.$store.state.COMPANYINTRODUCTION.briefInfo.entNation, 'area')){
            this.company_nation = circult(this.$store.state.COMPANYINTRODUCTION.briefInfo.entNation, 'area').name;
          }else{
            this.company_nation = '未填写';
          }
          
        } else {
          this.company_nation = '未填写';
        }
        return this.$store.state.COMPANYINTRODUCTION.briefInfo;
      },
      //企业头像
      company_avator(){
        if(this.$store.state.COMPANYINTRODUCTION.company_avator){
          this.avatarImg = this.$store.state.COMPANYINTRODUCTION.company_avator;
        }else{
          this.avatarImg = this.intAvatar;
        }
      },
      //职位详情
      jobinfo(){
        let info = this.$store.state.JOBS.jobinfo;
        let _this = this;
        //转换任职地点
        let jobArea = circult(info.entJobNation, 'area') ? circult(info.entJobNation, 'area').name + " " + info.entJobAdd : '未填写';
        this.baseRequest.forEach( (item) => {
          // if(item.name == "当前行业") item.value = info.entJobIndustry;
          if(item.name == "职位职能") item.value = info.entJobFun;
          if(item.name == "所在地点") item.value = jobArea;
          if(item.name == "工作类型") item.value = info.entJobWorkType;
          if(item.name == "工作经验") item.value = info.entJobWorkTime;
          if(item.name == "最低学历") item.value = info.entJobEdu;
          if(item.name == "职位年薪") item.value = info.entJobPay;
          if(item.name == "掌握外语") item.value = info.translateLanguage;
        } )
        this.companyInfor.forEach( (item) => {
          if(item.name == "销售额规模") item.value = info.entSell ? info.entSell:"未填写";
          if(item.name == "产品种类") item.value = info.entProcType ? info.entProcType:"未填写";
          if(item.name == "制造工艺") item.value = info.entPorcMade ? info.entPorcMade:"未填写";
          if(item.name == "质量体系") item.value = info.entMassType ? info.entMassType:"未填写";
          if(item.name == "制造商等级") item.value = info.entCustType ? info.entCustType:"未填写";
          if(item.name == "配套客户名称") item.value = info.entCustName ? info.entCustName:"未填写";
          if(item.name == "出口市场") item.value = info.entOutName ? info.entOutName:"未填写";
        } )
        return this.$store.state.JOBS.jobinfo;
      }
    },
    methods: {
      //调用父组件通过和拒绝方法
      parentPass() {
        this.$emit("invokePass", this.sendjobid, this.currentIndex);
        //下一个
        this.$emit("invokeChangeJob", 'next', true);
      },
      parentBeforeClose() {
        this.$emit("invokeClose", this.sendjobid, this.currentIndex);
        //下一个
        this.$emit("invokeChangeJob", 'next', true);
      },

      /**
       * 拒绝项目
       */
      beforeClose(e, i) {
        this.closeDialogVisible = true;
        this.closeMsg.jobid = e;
        this.closeMsg.content = "";
      },
      funClose() {
        this.closeDialogVisible = false;
        self.$emit("funAfter", self.jobid);
        xz.refuseJobPublish(this.closeMsg);
      }
    }
  };
</script>
<style scoped>
  .btn-add {
    margin: 5px;
    display: inline-block;
    font-size: 14px;
    padding: 5px;
    border: 1px solid #5f4b8b;
    border-radius: 4px;
    color: #5f4b8b;
    background-color: #fff;
  }
  .interviewData{
    display: flex;
  }
  .interviewTime{
    display: flex;
  }
  .interviewMember_title{
    margin-right: 30px;
  }
  .interviewTime{
    margin-right: 30px;
    margin-bottom: 10px;
  }
  .interviewMember_title_field{
    font-size: 14px;
    color: #333;
    font-weight: bold;
    margin-right: 10px;
  }
  .interviewMember{
    display: flex;
  }
  .interviewOperator{
    margin-bottom: 10px;
  }
</style>