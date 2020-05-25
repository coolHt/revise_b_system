<template>
  <div class="resumeFields">
    <transition name="loadShadow">
      <div class="loadShadow" v-show="!loadResume">
        <i class="loadgif"></i>
      </div>
    </transition>
    <h1 class="resumeDerive">简历来源: {{cv ? "个人注册" : "58解析"}}</h1>
    <!-- <div class="card first-card">
      <div class="card-title">
        <h4>
          <span class="am-icon-eye"></span>
          <span>简历列表</span>
        </h4>
      </div>
      <div v-if="docUrl" style="padding:10px 30px;">
        <a :href="docUrl" download="resume">
          点击下载简历
        </a>
      </div>
      <div v-else style="padding:10px 30px;">暂无简历附件</div>

      <div class="card-title">
        <h4>
          <span class="am-icon-eye"></span>
          <span>简历预览</span>
        </h4>
      </div>
      <div class="card-content">
        <div style="width:100%;">
          <div class="am-g profileInfor">
            <div class="base-info-pic ">
              <img src="../assets/images/avatar1.png" alt="" class="profile_head">
            </div>
            <div class="" style="float:unset;">
              <div>
                <div class="name">
                  <span class="resumeFieldTitle">候&nbsp;选&nbsp;人: </span>
                  <span class="resumeField">{{psnBaseInfo.psnName}}</span>
                  <span class="resumeField">{{psnBaseInfo.psnSex}}</span>
                  <span class="resumeField">{{Math.abs(currentAge)}}</span>
                  <span class="resumeField">{{psnPersonInfo.psnMarriage}}</span>
                  <span class="resumeField">{{bornLocation}}(籍贯)</span>

                </div>
              </div>
              <div>
                <div class="name">
                  <span class="resumeFieldTitle">当前状况: </span>
                  <span class="resumeField">{{psnBaseInfo.psnNowCompany}} · {{psnBaseInfo.psnNowJob}} ·
                    <i class="fieldBackground">{{psnPersonInfo.psnWorkState}}</i></span>

                </div>
              </div>
              <div>
                <div class="name" style="display: flex;">
                  <span class="resumeFieldTitle">教育信息:&nbsp;</span>
                  <div>
                    <div v-if="psnEduInfo" v-for="edu in psnEduInfo">
                      <span class="resumeField">{{edu.psnSchool}}</span>
                      <span class="resumeField">{{edu.psnMajor}}</span>
                      <span class="resumeField">{{edu.psnDegree}}</span>
                    </div>
                    <div v-else>
                      <span class="resumeField">暂无</span>
                    </div>
                  </div>


                </div>
              </div>
              <div>
                <div class="name">
                  <span class="resumeFieldTitle">联系方式: </span>
                  <span class="resumeField fieldPhone" v-if="contactWay">{{contactWay}}</span>
                  <span v-else>未填</span>

                </div>
              </div>
            </div>

          </div>


        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-title">
        <h4>
          <span class="am-icon-book"></span>
          <span>职业概况</span>
        </h4>
      </div>
      <div class="card-content carrerBox">
        <div class="carrer">
          <p>目前</p>

          <div class="name">
            <span class="resumeFieldTitle">目前行业: </span>
            <span class="resumeField">{{psnPersonInfo.psnIndustry}}</span>
          </div>

          <div class="name">
            <span class="resumeFieldTitle">目前地点: </span>
            <span class="resumeField">{{currentLocation}}</span>
          </div>

          <div class="name">
            <span class="resumeFieldTitle">目前职位: </span>
            <span class="resumeField fieldPhone">{{psnBaseInfo.psnNowJob}}</span>
          </div>

        </div>
        <div class="carrer">
          <p>期望</p>
          <div class="name">
            <span class="resumeFieldTitle">期望年薪: </span>
            <span class="resumeField fieldPhone">{{psnJobIntentInfo.psnIntentPay}}</span>
          </div>

          <div class="name">
            <span class="resumeFieldTitle">期望地点: </span>
            <span class="resumeField fieldPhone">{{intentAdd}}</span>
          </div>

          <div class="name">
            <span class="resumeFieldTitle">期望职位: </span>
            <span class="resumeField fieldPhone">{{psnJobIntentInfo.psnIntentJob}}</span>
          </div>
        </div>

      </div>
    </div>
    <div class="card">
      <div class="card-title">
        <h4>
          <span class="am-icon-magic"></span>
          <span>工作经历</span>
        </h4>
      </div>
      <div v-if="psnWorkInfo">
        <div class="card-content">
          <table class="thumbnailWork" border='1'>
            <thead>
              <tr>
                <th style="width:25%;">时间</th>
                <th style="width:35%;">公司</th>
                <th>职位</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="works in psnWorkInfo">
                <td>{{works.psnWorkStartTime}} 至 {{works.psnWorkEndTime}}</td>
                <td>{{works.psnCompany}}</td>
                <td>{{works.psnJob}}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="card-content" v-for="works in psnWorkInfo">
          <div class="am-g">
            <p class="workCompany">{{works.psnCompany}} <span
                class="companyTime">{{works.psnWorkStartTime}} 至 {{works.psnWorkEndTime}}</span></p>
            <p class="workCompanyInfo">
              <span class="fieldStyle">{{works.psnJobLoc}}</span>
            </p>

            <div class="workCompanyDetail">
              <p class="jobFunField">{{works.psnJob}}</p>
              <div class="workCompanyBase">
                <div>
                  <span class="statementTitle">任职收入:</span><span style="padding-left:15px;">{{works.psnPay}}</span>
                </div>
                <div>
                  <span class="statementTitle">所在部门:</span><span style="padding-left:15px;">{{works.psnJobPart}}</span>
                </div>
              </div>
              <div class="workStatement">
                <p class="statementTitle">工作描述:</p>
                <div class="statementInner">
                  <p v-if="works.psnJobDes!=''">{{works.psnJobDes}}</p>
                  <p v-else>暂无</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="card-content" v-else>
        <p class="eduHistory">暂无</p>
      </div>

      <div class="card">
        <div class="card-title">
          <h4>
            <span class="am-icon-graduation-cap"></span>
            <span>教育经历</span>
          </h4>
        </div>
        <div v-if="psnEduInfo">
          <div class="card-content" v-for="edu in psnEduInfo">
            <p class="eduHistory">{{edu.psnSchool}} · {{edu.psnMajor}} · {{edu.psnDegree}}
              {{edu.psnEduStartTime}} 至 {{edu.psnGradTime}}</p>
          </div>
        </div>
        <div class="card-content" v-else>
          <p class="eduHistory">暂无</p>
        </div>

      </div>

      <div class="card">
        <div class="card-title">
          <h4>
            <span class="am-icon-graduation-cap"></span>
            <span>技能/知识/工具/其他</span>
          </h4>
        </div>
        <div class="card-content tagsContainer">
          <div class="am-g tagsplit">
            <div class="">
              <span class="tagItem" v-for="skill in skillTag">{{skill}}</span>
            </div>
          </div>
          <div class="am-g tagsplit">
            <div class="">
              <span class="tagItem" v-for="know in knowTag">{{know}}</span>
            </div>
          </div>
          <div class="am-g tagsplit">
            <div class="">
              <span class="tagItem" v-for="tool in toolTag">{{tool}}</span>
            </div>
          </div>
          <div class="am-g">
            <div class="">
              <span class="tagItem" v-for="other in otherTag">other</span>
            </div>
          </div>
        </div>
      </div>


      <div class="card" style="padding-bottom:100px;border-bottom:none;box-shadow:none;">
        <div class="card-title">
          <h4>
            <span class="am-icon-graduation-cap"></span>
            <span>自我评价</span>
          </h4>
        </div>
        <div class="card-content">
          <p class="self_comment">{{psnJobIntentInfo.psnIntentInd == ''?'未填写':psnJobIntentInfo.psnIntentInd}}</p>
        </div>
      </div>

    </div> -->
    <Cv :cvResume="cv"></Cv>
    <Inner :innerResume="inner"></Inner>
  </div>
</template>

<script>
  import Cv from "./resume/cvResume"
  import Inner from "./resume/innerResume"
  export default {
    props: ['talentInfo'],
    components:{
      Cv,
      Inner
    },
    data() {
      return {
        initAvatar: require('../assets/images/avatar1.png'),
        //重新开始
        loadResume: false, //加载简历
        inner: null,
        cv: null
      }
    },
    watch: {
      //获取简历信息
      'talentInfo': {
        handler: function(){
          this.loadResume = false;
          this.inner = null;
          this.cv = null;
          this.$store.commit("talentInfo", {
            type: 'pool',
            info: this.talentInfo
          });
        },
        immediate: true
      },
      '$store.state.TALENTS.talent': {
        handler: function(){
          this.inner = null;
          this.cv = null;
          const resume = this.$store.state.TALENTS.talent;
          resume.cvinfo.status ? this.inner = resume.innerinfo : this.cv = resume.cvinfo;
          this.loadResume = true;
        }
      }
    }
  }
</script>