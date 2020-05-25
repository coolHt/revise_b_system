<template>
  <div class="resumePattern">
    <transition name="loadShadow">
      <div class="loadShadow" v-show="loadTalents">
        <i class="loadgif"></i>
      </div>
    </transition>
    <div class="xz_resume_partiton">
      <p class="xz_resume_partiton_title">用户资料</p>
      <div class="xz_detail_center">
        <div class="xz_detail_part">
          <p class="xz_detail_part_title">手机号: {{personalTel}}</p>
        </div>
      </div>
      <div class="xz_detail_center">
        <div class="xz_detail_part">
          <div class="xz_double_part">
            <div class="customField">
              <p class="customField_title">用户姓名：</p>
              <input class="resume_field_value" type="text" disabled v-model='cv.psnBaseInfo.psnName'>
            </div>
            <div class="customField">
              <p class="customField_title">性别：</p>
              <input class="resume_field_value" type="text" disabled v-model='cv.psnBaseInfo.psnSex'>
            </div>
          </div>
          <div class="xz_double_part">
            <div class="customField">
              <p class="customField_title">出生日期：</p>
              <input class="resume_field_value" type="text" disabled v-model='cv.psnPersonInfo.birth'>
            </div>
            <div class="customField">
              <p class="customField_title">最高学历：</p>
              <input class="resume_field_value" type="text" disabled v-model='cv.psnBaseInfo.psnEduLvl'>
            </div>
          </div>
          <div class="xz_double_part">
            <div class="customField">
              <p class="customField_title">工作年限：</p>
              <input class="resume_field_value" type="text" disabled v-model='cv.psnBaseInfo.psnWorkExp'>
            </div>
            <div class="customField">
              <p class="customField_title">期望年薪：</p>
              <span class="resume_field_value">{{cv.psnJobIntentInfo.psnIntentPay ? cv.psnJobIntentInfo.psnIntentPay + "万" : '未填写'}}</span>
            </div>
          </div>
          <div class="xz_double_part">
            <div class="customField">
              <p class="customField_title">期望职能：</p>
              <span class="resume_field_value">{{cv.psnJobIntentInfo.psnStrFuncNames ? cv.psnJobIntentInfo.psnStrFuncNames: "未填写"}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="xz_resume_partiton">
      <p class="xz_resume_partiton_title">内部资料</p>
    </div>
    
    <div class="xz_detail_center">
      <div class="xz_detail_part">
        <p class="xz_detail_part_title">基本信息</p>
        <div class="xz_double_part">
          <div class="customField">
            <p class="customField_title">用户姓名：</p>
            <input class="resume_field_value" type="text" disabled v-model='psnBaseInfo.psnName'>
          </div>
          <div class="customField">
            <p class="customField_title">性别：</p>
            <input class="resume_field_value" type="text" disabled v-model='psnBaseInfo.psnSex'>
          </div>
        </div>
        <div class="xz_double_part">
          <div class="customField">
            <p class="customField_title">出生日期：</p>
            <input class="resume_field_value" type="text" disabled v-model='psnPersonInfo.psnBirth'>
          </div>
          <div class="customField">
            <p class="customField_title">最高学历：</p>
            <input class="resume_field_value" type="text" disabled v-model='psnBaseInfo.psnEduLvl'>
          </div>
        </div>
        <div class="xz_double_part">
          <div class="customField">
            <p class="customField_title">工作年限：</p>
            <input class="resume_field_value" type="text" disabled v-model='psnBaseInfo.psnWorkExp'>
          </div>
          <div class="customField">
            <p class="customField_title">籍贯：</p>
            <input class="resume_field_value" type="text" disabled v-model='psnBaseInfo.psnNationName'>
          </div>
        </div>
      </div>
      <div class="xz_detail_center">
        <div class="xz_detail_part">
          <p class="xz_detail_part_title">个人资料</p>
          <div class="xz_double_part">
            <div class="customField">
              <p class="customField_title">当前公司：</p>
              <input class="resume_field_value" type="text" disabled v-model='psnBaseInfo.psnNowCompany'>
            </div>
            <div class="customField">
              <p class="customField_title">当前职位：</p>
              <input class="resume_field_value" type="text" disabled v-model='psnBaseInfo.psnNowJob'>
            </div>
          </div>
          <div class="xz_double_part">
            <div class="customField">
              <p class="customField_title">当前年薪：</p>
              <input class="resume_field_value" type="text" disabled v-model='psnPersonInfo.psnCurrSalary'>
            </div>
            <div class="customField">
              <p class="customField_title">当前状态：</p>
              <input class="resume_field_value" type="text" disabled v-model='psnPersonInfo.psnWorkState'>
            </div>
          </div>
          <div class="xz_double_part">
            <div class="customField">
              <p class="customField_title">现居住地：</p>
              <input class="resume_field_value" type="text" disabled v-model='psnPersonInfo.psnPerNationName'>
            </div>

            <div class="customField">
              <p class="customField_title">婚姻状况：</p>
              <input class="resume_field_value" type="text" disabled v-model='psnPersonInfo.psnMarriage'>
            </div>
          </div>
          <div class="xz_double_part">
            <div class="customField">
              <p class="customField_title">工作年份：</p>
              <input class="resume_field_value" type="text" disabled v-model='psnPersonInfo.psnStartWork'>
            </div>
          </div>
        </div>
        <div class="xz_detail_part">
          <p class="xz_detail_part_title">求职意向</p>
          <div class="xz_double_part">
            <div class="customField">
              <p class="customField_title">期望工作：</p>
              <input class="resume_field_value" type="text" disabled v-model='psnJobIntentInfo.psnIntentJob'>
            </div>
            <div class="customField">
              <p class="customField_title">期望年薪：</p>
              <input class="resume_field_value" type="text" disabled v-model='psnJobIntentInfo.psnIntentPay'>
            </div>
          </div>
          <div class="xz_double_part">
            <div class="customField">
              <p class="customField_title">期望地点：</p>
              <input class="resume_field_value" type="text" disabled v-model='psnJobIntentInfo.psnIntentNationName'>
            </div>
            <div class="customField">
              <p class="customField_title">期望职能：</p>
              <input class="resume_field_value" type="text" disabled v-model='psnJobIntentInfo.psnStrFuncNames'>
            </div>
          </div>
        </div>

        <div class="xz_detail_part">
          <p class="xz_detail_part_title">工作经历</p>
          <div class="wx_history" v-if="historyList.length > 0">
            <ul class="wx_history_list">
              <li class="wx_list_item" v-for="(item, index) in historyList" :key="index">
                <div class="wx_history_content">
                  <span>{{item.psnCompany}}</span>
                  <span>{{item.psnJob}}</span>
                </div>
                <div style="display:flex;">
                  <div class="wx_date">
                    <span>{{item.psnWorkStartTime}} - {{item.psnWorkEndTime}}</span>
                  </div>

                </div>
              </li>
            </ul>
          </div>
        </div>
        <div class="xz_detail_part">
          <p class="xz_detail_part_title">教育经历</p>
          <div class="wx_history" v-if="educationList.length > 0">
            <ul class="wx_history_list">
              <li class="wx_list_item" v-for="(item, index) in educationList" :key="index">
                <div class="wx_history_content">
                  <span>{{item.psnSchool}}</span>
                  <span>{{item.psnMajor}}</span>
                </div>
                <div style="display:flex;">
                  <div class="wx_date">
                    <span>{{item.psnEduStartTime}} - {{item.psnGradTime}}</span>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div class="xz_detail_part">
          <p class="xz_detail_part_title">专业技能</p>
          <div class="wx_techique"></div>
          <div class="flexCenterContainer">
            <div class="tagsShow" v-if="professionArr.length > 0">
              <span v-for="(item, index) in professionArr" :key="index" class="tagsShowItem">{{item}}
              </span>
            </div>
          </div>
        </div>
        <div class="xz_detail_part">
          <p class="xz_detail_part_title">个人标签</p>
          <div class="wx_techique"></div>
          <div class="flexCenterContainer">
            <div class="tagsShow" v-if="personalTagArr.length > 0">
              <span v-for="(item, index) in personalTagArr" :key="index" class="tagsShowItem">{{item}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import xz from "../common";
  export default {
    data() {
      return {
        loadTalents: false,
        personalTel: '', //号码
        //简历列表
        psnBaseInfo: {},
        psnJobIntentInfo: {},
        psnPersonInfo: {},
        historyList: [],
        educationList: [],
        professionArr: [],
        personalTagArr: [],
        jobName: '',
        cv: {
          psnBaseInfo: {},
          psnPersonInfo: {},
          psnJobIntentInfo: {},
        }
      };
    },
    created() {
      document.title = this.$route.query.jobname ? this.$route.query.jobname : "职位面试";
      let cvid = this.$route.query.cvid;
      let userid = this.$route.query.userid;
      this.jobName = this.$route.query.jobname;
      this.loadTalents = true;
      //获取个人简历
      xz.userInfo(userid).then(res => {
        if (res) {
          //用户资料
          let cv = res.cvinfo;
          let cvIntentInfo = cv.psnJobIntentInfo ? cv.psnJobIntentInfo : {};
          let personInfo = cv.psnPersonInfo;
          personInfo.birth = this.$store.getters.formatDate(personInfo.psnBirth)
          this.cv = {
            psnBaseInfo: cv.psnBaseInfo,
            psnPersonInfo: personInfo,
            psnJobIntentInfo: cvIntentInfo,
          }
          //内部资料
          let inner = res.innerinfo;
          //基本资料
          let psnBaseInfo = inner.psnBaseInfo ? inner.psnBaseInfo : {};
          if (psnBaseInfo.psnNation) {
            let obj = this.$store.getters.codeToggleObj(psnBaseInfo.psnNation);
            let nationName = this.$store.getters.localName(obj);
            psnBaseInfo.psnNationName = nationName ? nationName : "未填写";
          } else {
            psnBaseInfo.psnNationName = "未填写";
          }
          if(psnBaseInfo.psnName == undefined) psnBaseInfo.psnNationName = "";
          this.psnBaseInfo = psnBaseInfo;
          //个人资料
          let psnPersonInfo = inner.psnPersonInfo ? inner.psnPersonInfo : {};
          if (psnPersonInfo.psnPerNation) {
            let obj = this.$store.getters.codeToggleObj(psnPersonInfo.psnPerNation);
            let nationName = this.$store.getters.localName(obj);
            psnPersonInfo.psnPerNationName = nationName ? nationName : "未填写"
          } else {
            psnPersonInfo.psnPerNationName = "未填写"
          }
          if(psnPersonInfo.psnCurrSalary == undefined) psnPersonInfo.psnPerNationName = "";
          this.psnPersonInfo = psnPersonInfo;
          //求职意向
          let intentInfo = inner.psnJobIntentInfo ? inner.psnJobIntentInfo: {};
          if (intentInfo.psnIntentNation) {
            let obj = this.$store.getters.codeToggleObj(intentInfo.psnIntentNation);
            let regionName = this.$store.getters.localName(obj);
            intentInfo.psnIntentNationName = regionName ? regionName : "未填写";
          } else {
            intentInfo.psnIntentNationName = "未填写";
          }
          if(intentInfo.psnIntentJob == undefined) intentInfo.psnIntentNationName = "";
          this.psnJobIntentInfo = intentInfo
          //处理工作经历
          if (Array.isArray(inner.psnWorkInfo)) {
            this.historyList = inner.psnWorkInfo;
          } else {
            this.historyList = [];
          }
          //处理教育经历
          if (Array.isArray(inner.psnEduInfo)) {
            this.educationList = inner.psnEduInfo;
          } else {
            this.educationList = [];
          }
          //专业技能
          this.professionArr = inner.psnKnowTag ? inner.psnKnowTag.split(',') : [];
          //个人标签
          this.personalTagArr = inner.psnSkillTag ? inner.psnSkillTag.split(',') : [];
        } else {
          console.log("获取个人简历失败");
        }
        this.loadTalents = false;
      })
      //获取电话
      xz.getUserCell(cvid).then(res => {
        res ? this.personalTel = res : this.personalTel = "获取手机号失败";
      })
    },

  };
</script>
<style scoped>
  .resumePattern {
    width: 1200px;
    background: #fff;
    margin: 0 auto;
    position: relative;
    border: 1px solid #333;
    padding: 30px 0;
  }

  .resumePattern .paySalary {
    font-size: 18px !important;
    margin-left: 15px;
  }

  .xz_detail_part_title {
    font-size: 18px;
    font-weight: bold;
    color: #333;
    margin-bottom: 20px;
  }

  .xz_detail_resume {
    width: 100%;
    /* position: relative; */
  }

  .xz_detail_center {
    width: 760px;
    padding-top: 20px;
    margin: 0 auto;
  }

  .xz_double_part {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  .xz_add_cancel,
  .xz_add_history {
    font-size: 14px;
    display: block;
    padding: 8px 20px;
    color: #fff;
    border-radius: 5px;
    outline: none;
    cursor: pointer;
    background: #409eff;
    border: none;
  }

  .xz_add_cancel {
    background: #ed6b75 !important;
    margin-left: 30px !important;
  }

  .customField {
    display: flex;
  }

  .customField_title {
    display: block;
    width: 150px;
    height: 45px;
    line-height: 45px;
    text-align: right;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    margin: 0;
    padding: 0 10px 0 0;
    color: #333;
    font-weight: bold;
    font-size: 14px;
  }

  .flexCenterContainer {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }

  .tagsShow {
    width: 100%;
    display: block;
    margin-bottom: 15px;
    box-sizing: border-box;
    padding-left: 70px;
  }

  .tagsShowItem {
    margin-right: 15px;
    padding: 8px 18px;
    border-radius: 3px;
    background: #409eff;
    color: #fff;
    font-size: 13px;
    position: relative;
  }

  .resume_field_value {
    display: block;
    width: 200px;
    border: none;
    border-bottom: 1px solid #333;
    height: 45px;
    line-height: 45px;
    font-size: 14px;
    padding: 0 15px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    outline: none;
    background: #fff;
  }

  .xz_resume_partiton {
    width: 900px;
    margin: 0 auto;
  }

  .xz_resume_partiton_title {
    font-size: 22px;
    font-weight: 700;
    color: #333;
  }
</style>