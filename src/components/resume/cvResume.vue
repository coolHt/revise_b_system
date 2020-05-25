<template>
  <div class="cvResume" v-if="cv">
    <div class="baseResume">
      <div>
        <div class="fieldDouble">
          <div class="singleDouble">
            <span class="resume_fieldName">姓名:</span>
            <span class="resume_fieldResult">{{cv.psnBaseInfo ? cv.psnBaseInfo.psnName : "未填写"}}</span>
          </div>
          <div class="singleDouble">
            <span class="resume_fieldName">手机号:</span>
            <span class="resume_fieldResult">{{cv.psnProBaseSource ? cv.psnProBaseSource.StrUserMobile : "未填写"}}</span>
          </div>
        </div>
        <div class="fieldDouble">
          <div class="singleDouble">
            <span class="resume_fieldName">性别:</span>
            <span class="resume_fieldResult">{{cv.psnBaseInfo ? cv.psnBaseInfo.psnSex : "未填写"}}</span>
          </div>
          <div class="singleDouble">
            <span class="resume_fieldName">年龄:</span>
            <span class="resume_fieldResult">{{cv.age ? cv.age : "未填写"}}</span>
          </div>
        </div>
        <div class="fieldDouble">
          <!-- <div class="singleDouble">
              <span class="resume_fieldName">所在城市</span>
              <span class="resume_fieldResult">{{cv.nation ? cv.nation : "未填写"}}</span>
            </div> -->
          <div class="singleDouble">
            <span class="resume_fieldName">工作年限:</span>
            <span class="resume_fieldResult">{{cv.psnBaseInfo.psnWorkExp ? cv.psnBaseInfo.psnWorkExp : "未填写"}}</span>
          </div>
          <div class="singleDouble">
            <span class="resume_fieldName">最高学历:</span>
            <span class="resume_fieldResult">{{cv.psnBaseInfo.psnEduLvl ? cv.psnBaseInfo.psnEduLvl : "未填写"}}</span>
          </div>
        </div>
        <!-- <div class="fieldDouble">
            <div class="singleDouble">
              <span class="resume_fieldName">工作年限:</span>
              <span class="resume_fieldResult">{{cv.worktime ? cv.worktime : "未填写"}}</span>
            </div>
          </div> -->
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      cvResume: {
        type: Object,
        default: function () {}
      }
    },
    data(){
      return {
        nation: null,
        age: null
      }
    },
    computed: {
      cv() {
        if (this.cvResume) {
          if (this.cvResume.psnPersonInfo) {
            const birthday = this.cvResume.psnPersonInfo.psnBirth;
            if (birthday) this.cvResume.age = new Date().getFullYear() - new Date(birthday).getFullYear();
          }
          //当前位置
          if (this.cvResume.psnBaseInfo.psnNation) {
            let codeObj = this.$store.getters.codeToggleObj(this.cvResume.psnBaseInfo.psnNation);
            let codeName = this.$store.getters.localName(codeObj);
            this.nation = codeName;
          }
          return this.cvResume;
        }
      }
    }

  }
</script>