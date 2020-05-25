<template>
  <div class="xz_resume">
    <transition name="loadShadow">
      <div class="loadingResume loadShadow" v-show="show_resume">
        <img src="../../assets/images/bean.gif" alt="" class="loadingResume_img">
      </div>
    </transition>
    
    <span class="xz_close_resume" @click="closeResume"></span>
    <div class="xz_resume_container">
      <!--接收必填资料-->
      <wxReusme class="fixWX" :baseResume="baseResume"></wxReusme>
      <div class="xz_resume_part_container">
        <el-tabs v-model="activeName" @tab-click="handleClick" class="resumeNav">
          <el-tab-pane label="详细信息" name="detail"></el-tab-pane>
          <!-- <el-tab-pane label="报名记录" name="enrolment"></el-tab-pane>
          <el-tab-pane label="面试记录" name="interview"></el-tab-pane>
          <el-tab-pane label="沟通记录" name="communication"></el-tab-pane>
          <el-tab-pane label="人才经纪" name="economics"></el-tab-pane> -->
        </el-tabs>
        <div class="resumeInformationParts">
          <ResumeDetail :resume="resume" :baseResume="baseResume"></ResumeDetail>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import xz from "../../common";
import wxReusme from './wx_resume';
//详细信息
import ResumeDetail from './resumeDetail';
export default {
  props: {
    "resume": {
      type: Object,
      default: function(){
        return {}
      }
    }
  },
  components: {
    wxReusme,
    ResumeDetail
  },
  data(){
    return {
      activeName: 'detail',
      baseResume: null,
      show_resume: true
    }
  },
  methods:{
    closeResume(){ //关闭简历
      this.baseResume = "";
      this.$emit("closeResume");
    },
    //设置基本资料
    setBaseResume(resume, source,tel, inner){
      let baseResume = {
        psnName: resume.psnBaseInfo.psnName,
        psnSex: resume.psnBaseInfo.psnSex,
        psnWorkExp: resume.psnBaseInfo.psnWorkExp,
        psnEduLvl: resume.psnBaseInfo.psnEduLvl,
        psnBirth: resume.psnPersonInfo ? resume.psnPersonInfo.psnBirth: "",
        source,
        tel: tel ? (tel.usertel ? tel.usertel : tel.usertel58) : "暂无号码",
        innerResume: inner,
        intentPay: resume.psnJobIntentInfo ? resume.psnJobIntentInfo.psnIntentPay : "",
        intentFun: resume.psnJobIntentInfo ? resume.psnJobIntentInfo.psnStrFuncNames : "",
        overdue: tel ? ((tel.userteltime58 && tel.userteltime58 != '0000-00-00 00:00:00') ? this.$store.getters.formatDate(tel.userteltime58) : '') : '',
        personalProfile: resume.psnJobIntentInfo ? resume.psnJobIntentInfo.psnIntentInd : "未填写",
        otherTag: resume.psnPersonInfo ? resume.psnPersonInfo.psnOthInf: ""
      }
      return baseResume;
    }
  },
  watch: {
    "resume": {
      handler: function(){
        if(this.resume){
            this.show_resume = true;
            //获取用户手机
            xz.getCellNumber(this.resume.orderid).then( res => {
              let matchTel;
              if(res){
                if(Array.isArray(res)){
                  matchTel = res.find( r => r.userid == this.resume.orderid);
                }
              }else{
                console.log("获取手机号失败");
              }
              //获取简历
              xz.userInfo(this.resume.orderid).then( res => {
                if(res){
                  console.log(res);
                  let inner = res.innerinfo;
                  let cv = res.cvinfo;
                  //基本资料                                       
                  cv.status ? this.baseResume = this.setBaseResume(inner,this.resume.source, matchTel, inner) : this.baseResume = this.setBaseResume(cv, this.resume.source, matchTel, inner);
                }else{
                  console.log("获取简历出错");
                }
                this.show_resume = false;
              })
            }); //获取
        }
      },
      immediate: true
    }
  }
}
</script>
<style scoped>
  .loadingResume_img{
    width: 200px;
    height:200px;
    display: block;
    margin: 0 auto;
  }
</style>