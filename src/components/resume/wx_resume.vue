<template>
  <div class="wx_resume">
    <div class="flexCenter">
      <p class="xz_contact_profile">来源: {{resume.source}}</p>
      <p class="xz_contact_profile" v-if="resume.overdue">过期时间: {{resume.overdue}}</p>
      <img src="../../assets/images/logo.jpg" alt="" class="wx_resume_logo">
      <div class="wx_resume_field">
        <p class="wx_resume_title">真实姓名</p>
        <p class="wx_resume_value">{{resume.psnName}}</p>
      </div>
      <div class="wx_resume_field">
        <p class="wx_resume_title">个人简介</p>
        <p class="wx_resume_value">{{resume.personalProfile}}</p>
      </div>
      <div class="wx_resume_field">
        <p class="wx_resume_title">手机号码</p>
        <p class="wx_resume_value">{{resume.tel}}</p>
      </div>
      <div class="wx_resume_field">
        <p class="wx_resume_title">性别</p>
        <div class="wx_gender">
          <div class="genderType leftType" :class="{'selectedGender' : resume.psnSex == '男'}">
            <img src="../../assets/images/ic_male.png" alt="">
            <span>男</span>
          </div>
          <div class="genderType" :class="{'selectedGender' : resume.psnSex == '女'}">
            <img src="../../assets/images/ic_female.png" alt="">
            <span>女</span>
          </div>
        </div>
      </div>
      <div class="wx_resume_brief borderBottom">
        <div class="wx_brief_field">
          <p class="wx_briefName">出生年月</p>
          <p class="wx_resume_value">{{resume.psnBirth ? resume.psnBirth : "未填写"}}</p>
        </div>
        <div class="wx_brief_field">
          <p class="wx_briefName">最高学历</p>
          <p class="wx_resume_value">{{resume.psnEduLvl ? resume.psnEduLvl : "未填写"}}</p>
        </div>
        <div class="wx_brief_field">
          <p class="wx_briefName">工作年限</p>
          <p class="wx_resume_value">{{resume.psnWorkExp ? resume.psnWorkExp : "未填写"}}</p>
        </div>
      </div>
      <div class="wx_resume_brief borderBottom" style="justify-content: flex-start !important;">
        <div class="wx_brief_field">
          <p class="wx_briefName">期望年薪</p>
          <p class="wx_resume_value">{{resume.intentPay ? resume.intentPay + "万" : "未填写"}}</p>
        </div>
        <div class="wx_brief_field">
          <p class="wx_briefName">其他经历</p>
          <p class="wx_resume_value">{{resume.intentFun ? resume.intentFun : "未填写"}}</p>
        </div>
      </div>
      <div class="wx_resume_field">
        <p class="wx_briefName">期望职能</p>
        <div class="other_tag">
          <span class="other_tag_item checkTag" v-show="item.isCheck" v-for="(item, index) in otherTag" v-bind:key="index">{{item.label}}</span>
        </div>
      </div>
      <div class="wx_resume_field">
        <p class="wx_upload_resume">简历附件</p>
        <p class="wx_resume_value">暂无附件</p>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      "baseResume": {
        type: Object,
        default: function(){
          return {}
        }
      }
    },
    data(){
      return {
        resume: {},
        otherTag: [{
          label: "参军经历",
          value: "army",
          isCheck: false
        },{
          label: "国外工作",
          value: "abroad",
          isCheck: false
        },{
          label: "创业经历",
          value: "employment",
          isCheck: false
        }]
      }
    },
    watch: {
      "baseResume": {
        handler: function(){
          if(this.baseResume){
            //生日格式转换
            let birth = this.baseResume.psnBirth.split(" ")[0];
            if(this.baseResume.psnBirth) this.baseResume.psnBirth = this.$store.getters.formatDate(birth);
            this.resume = this.baseResume;
            if(this.baseResume.otherTag){
              let otherTag = this.otherTag;
              let userTag = this.baseResume.otherTag.split(',');
              userTag.forEach( t => {
                let i;
                let isExist = otherTag.find( (o, index) => {
                  if(o.value == t){
                    i = index;
                    return o;
                  }
                });
                if(isExist){
                  otherTag[i].isCheck = true;
                }
              })
              this.otherTag = otherTag;
            }
          }
        },
        immediate: true
      }
    }
  }
</script>
<style scoped>
  .wx_resume {
    display: flex;
    width: 400px;
    height: 100%;
    background: #fff;
    box-sizing: border-box;
    padding-top: 40px;
  }
  .flexCenter{
    width: 100%;
  }
  .wx_resume_logo {
    display: block;
    width: 110px;
    height: 110px;
    margin: 0 auto 0 auto;
    border: 1px solid #333;
    border-radius: 50%;
    box-sizing: border-box;
  }

  .wx_resume_field {
    margin: 0 auto;
    width: 80%;
    border-bottom: 1px solid #ddd;
    padding: 10px 0;
  }

  .wx_resume_title {
    text-align: center;
    color: #b1b1b1;
    font-size: 14px;
  }

  .wx_resume_value {
    color: #333;
    font-size: 14px;
    line-height: 25px;
    margin-top: 10px;
    text-align: center;
  }

  .wx_gender {
    display: flex;
    justify-content: center;
    margin-top: 10px;
  }

  .leftType {
    margin-right: 30px;
  }

  .genderType {
    display: flex;
    align-items: center;
    padding: 3px 10px 3px 6px;
    border-radius: 80px;
    border: 1px solid #b1b1b1;
  }

  .genderType img {
    display: block;
    width: 18px;
    height: auto;
    margin-right: 5px;
  }

  .genderType span {
    color: #b1b1b1;
    font-size: 14px;
  }

  .wx_resume_brief {
    display: flex;
    width: 80%;
    margin: 0 auto;
    justify-content: space-between;
    padding: 10px 0;
  }

  .borderBottom {
    border-bottom: 1px solid #ddd;
  }

  .wx_brief_field {
    width: 33%;
  }

  .wx_briefName {
    display: block;
    text-align: center;
    font-size: 14px;
    width: 100%;
    color: #b1b1b1;
  }
  .wx_upload_resume {
    font-size: 14px;
    color: #b1b1b1;
  }
  .selectedGender{
    border:1px solid #fa7268 !important;
    background: #fa7268;
  }
  .selectedGender span{
    color: #fff !important;
  }
  .leftType.selectedGender{
    background:#5f4b8b !important;
    border:1px solid #5f4b8b !important;
  }
  .xz_contact_profile{
    width: 80%;
    font-weight: bold;
    color: #333;
    font-size: 15px;
    margin: 0 auto;
  }
  .other_tag{
    width: 100%;
    display: flex;
    margin-top:12px;
  }
  .other_tag_item{
    font-size: 15px;
    width: 30%;
    color: #fa7268;
    padding: 6px 0;
    text-align: center;
    border: 1px solid #fa7268;
  }
  .other_tag_item:nth-child(2){
    margin: 0 5%;
  }
  .checkTag{
    background: #fa7268 !important;
    color: #fff !important;
  }
</style>