<template>
  <div class="innerResume" v-if="inner">
    <div class="fieldDouble">
      <div class="singleDouble">
        <span class="resume_fieldName">姓名:</span>
        <span class="resume_fieldResult">{{inner.psnBaseInfo ? inner.psnBaseInfo.psnName : ""}}</span>
      </div>
      <div class="singleDouble">
        <span class="resume_fieldName">性别:</span>
        <span class="resume_fieldResult">{{inner.psnBaseInfo ? inner.psnBaseInfo.psnSex : ""}}</span>
      </div>
    </div>
    <div class="fieldDouble">
      <div class="singleDouble">
        <span class="resume_fieldName">最高学历:</span>
        <span class="resume_fieldResult">{{inner.psnBaseInfo ? inner.psnBaseInfo.psnEduLvl : ""}}</span>
      </div>
      <div class="singleDouble">
        <span class="resume_fieldName">工作年限:</span>
        <span class="resume_fieldResult">{{inner.psnBaseInfo ? inner.psnBaseInfo.psnWorkExp : ""}}</span>
      </div>
    </div>
    <div class="fieldDouble">
      <div class="singleDouble">
        <span class="resume_fieldName">年龄:</span>
        <span class="resume_fieldResult">{{age ? age : ""}}</span>
      </div>
      <div class="singleDouble">
        <span class="resume_fieldName">当前状态:</span>
        <span class="resume_fieldResult">{{inner.psnPersonInfo ? inner.psnPersonInfo.psnWorkState : ""}}</span>
      </div>
    </div>
    <h4 class="resume_intendTitle">求职意向</h4>
    <div>
      <div class="intendField">
        <span class="resume_fieldName">期望薪资: </span>
        <span class="resume_fieldResult">{{inner.psnJobIntentInfo ? inner.psnJobIntentInfo.psnIntentPay : ""}}</span>
      </div>
      <div class="intendField">
        <span class="resume_fieldName">期望职位: </span>
        <span class="resume_fieldResult">{{inner.psnJobIntentInfo ? inner.psnJobIntentInfo.psnIntentJob : ""}}</span>
      </div>
      <div class="intendField">
        <span class="resume_fieldName">期望地点: </span>
        <span class="resume_fieldResult">{{inner.psnJobIntentInfo ? inner.psnJobIntentInfo.psnIntentAdd : ""}}</span>
      </div>
      <div class="intendField">
        <span class="resume_fieldName">简介: </span>
        <span class="resume_fieldResult">{{inner.psnJobIntentInfo ? inner.psnJobIntentInfo.psnIntentInd : ""}}</span>
      </div>
    </div>

    <div v-if="inner && inner.psnEduInfo">
      <h4 class="resume_intendTitle">教育经历</h4>
      <div v-for="(edu, index) in inner.psnEduInfo" :key="index" class="partitionLine">
        <div class="intendField">
          <span class="resume_fieldName">毕业时间: </span>
          <span class="resume_fieldResult">{{edu.psnGradTime}}</span>
        </div>
        <div class="fieldDouble">
          <div class="singleDouble">
            <span class="resume_fieldName">专业:</span>
            <span class="resume_fieldResult">{{edu.psnMajor}}</span>
          </div>
          <div class="singleDouble">
            <span class="resume_fieldName">学校:</span>
            <span class="resume_fieldResult">{{edu.psnSchool}}</span>
          </div>
        </div>
      </div>
    </div>
    <div v-if="inner && inner.psnWorkInfo">
      <h4 class="resume_intendTitle">工作经历</h4>
      <div v-for="(work, index) in inner.psnWorkInfo" :key="index" class="partitionLine">
        <div class="intendField">
          <span class="resume_fieldName">公司名称: </span>
          <span class="resume_fieldResult">{{work.psnCompany}}</span>
        </div>
        <div class="fieldDouble">
          <div class="singleDouble">
            <span class="resume_fieldName">入职时间:</span>
            <span class="resume_fieldResult">{{work.psnWorkStartTime}}</span>
          </div>
          <div class="singleDouble">
            <span class="resume_fieldName">离职时间:</span>
            <span class="resume_fieldResult">{{work.psnWorkEndTime}}</span>
          </div>
        </div>
        <div class="fieldDouble">
          <div class="singleDouble">
            <span class="resume_fieldName">工作名称:</span>
            <span class="resume_fieldResult">{{work.psnJob}}</span>
          </div>
          <div class="singleDouble">
            <span class="resume_fieldName">薪资:</span>
            <span class="resume_fieldResult">{{work.psnPay}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      innerResume: {
        type: Object,
        default: function () {}
      }
    },
    data() {
      return {
        age: null
      }
    },
    computed: {
      inner() {
        if (this.innerResume) {
          //年龄
          const birthday = this.innerResume.psnPersonInfo.psnBirth;
          if (birthday) this.age = new Date().getFullYear() - new Date(birthday.split(" ")[0]).getFullYear();
          return this.innerResume;
        }
      }
    }
  }
</script>