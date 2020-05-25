<template>
  <div class="fullScreenBg" @click="hideForm">
    <div class="projectDetailContainer" @click.stop="">
      <i class="closeForm" @click="hideForm"></i>
      <div class="detailCenter">
        <div class="draft-job">
          <h5>基本信息</h5>
        </div>
        <div class="infor_field">
          <label class="field_name">项目名称：</label>
          <input v-model="projectName" type="text" readonly autocomplete="off" />
        </div>

        <div class="infor_field">
          <label class="field_name normalField">营业执照：</label>
          <div style="display:flex;width:400px;" v-show="!isGoverment">
            <input id="licenseId" type="text" placeholder="输入营业执照号码" v-model="certificateId" style="width:400px;" />
          </div>
          <div class="isGoverment">
            <input type="checkbox" v-model="isGoverment" />
            政府机构
          </div>
          <p id="tipLicenseId" class="error_text"></p>
        </div>
        <div class="infor_field">
          <label class="field_name">项目地址：</label>
          <div style="width:550px;display:flex;align-items:center;" >
            <MRegion @cRegion="changeArea" :fullrange="true" :selected="selected.value" :search="true" :class="{'emptyArea': selected.check}"></MRegion>
            <span class="locateSplit">/</span>
            <input id="locDetail" v-model.trim="projectDetail" type="text" placeholder="详细地址" autocomplete="off" />
          </div>
          <p id="tipLoc" class="error_text"></p>
        </div>
        <div class="infor_field">
          <label class="field_name">项目类别：</label>
          <input v-model="projectType" type="text" readonly autocomplete="off" />
        </div>
        <div class="infor_field">
          <label class="field_name">项目介绍：</label>
          <div class>
            <textarea rows="5" placeholder="项目介绍" id="introduction" v-model.trim="contactProfile.value" :class="{'error_alert': contactProfile.check}"></textarea>
          </div>
        </div>
        <div class="infor_field">
          <label class="field_name">联系人：</label>
          <div class>
            <input type="text" placeholder="请输入联系人名称" v-model.trim="contactName.value" :class="{'error_alert': contactName.check}"/>
          </div>
        </div>
        <div class="infor_field">
          <label class="field_name">手机号：</label>
          <div class>
            <input name type="text" v-model.trim="contactNumber.value" placeholder="请输入手机号" :class="{'error_alert': contactNumber.check}"/>
          </div>
        </div>
        <div class="infor_field">
          <label class="field_name">简历邮箱：</label>
          <div class>
            <input id="entemail" type="email" placeholder="输入接受简历的邮箱" v-model.trim="contactMail.value" :class="{'error_alert': contactMail.check}" />
          </div>
        </div>
        <div class="form_save">
          <button type="button" class="btn-search" @click="saveProjectDetail">保存信息</button>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>

</style>
<script>
  import xz from "../../common";
  export default {
    props: {
      projectInfo: Object
    },
    data() {
      return {
        projectId: "",
        entid: "",
        // 项目地址省市区
        selected: {
          value: "",
          check: false
        },
        // 项目详细地址
        projectDetail: "",
        // 项目联系人号码
        contactNumber: {
          value: "",
          check: false
        },
        // 简历邮箱
        contactMail: {
          value: "",
          check: false
        },
        // 项目联系人
        contactName: {
          value: "",
          check: false
        },
        // 项目简介
        contactProfile: {
          value: "",
          check: false
        },
        // 是否是政府
        isGoverment: false,
        // 营业执照
        certificateId: "",
        // 项目类别
        projectType: "",
        // 项目名称
        projectName: ""
      }
    },
    mounted() {

    },
    watch: {
      "projectInfo": {
        handler: function(){
          if(this.projectInfo){
            this.projectId = this.projectInfo.objid;
            this.projectType = this.projectInfo.objtype;
            this.projectName = this.projectInfo.objname;
            this.entid = this.projectInfo.entid;
            this.getProjectDetail(this.entid);
          }
        },
        immediate: true
      }
    },
    methods: {
      // 获取项目详情
      getProjectDetail(entid){
        xz.getCompanyInformation(entid).then( res => {
          if(res){
            this.projectDetail = res.entAdd ? res.entAdd : "";
            if(res.entCertId){
              if(res.entCertId.indexOf('govcn') >= 0){
                this.isGoverment = true;
              }
            }
            this.certificateId = res.entCertId ? res.entCertId : "";
            this.$set(this.selected, "value", res.entNation);
            this.$set(this.contactNumber, "value", res.entConTel);
            this.$set(this.contactMail, "value", res.entEmail);
            this.$set(this.contactProfile, "value", res.entSummary);
            this.$set(this.contactName, "value", res.entConName);
          }
        });
      },

      // 项目地址
      changeArea(datas){
        //区域code
        let dataCode = "";
        if (datas.area) {
          dataCode = datas.area.code;
        } else if (datas.city) {
          dataCode = datas.city.code;
        } else {
          dataCode = datas.province.code;
        }
        this.$set(this.selected, "value", dataCode);
        if(this.selected.check){
          this.$set(this.selected, "check", false);
        }
      },

      // 保存项目详细信息
      saveProjectDetail(){
        if(this.checkInput()){
          let certId = "";
          if(this.isGoverment){
            certId = new Date().getTime() + "govcn";
          }else if(this.certificateId){
            certId = this.certificateId;
          }

          const infor = {
            entAct: this.entid ? "edit" : "new",
            typesign: "inst",
            entid: this.projectId,
            entName: this.projectName,
            entEmail: this.contactMail.value,
            entCertId: certId,
            entNation: this.selected.value,
            entAdd: this.projectDetail,
            entClass: this.projectType,
            entScale: "",
            entSummary: this.contactProfile.value,
            entConName: this.contactName.value,
            entConTel: this.contactNumber.value,
            userid: Cookies.get("userid-b") 
          }
          console.log(infor);
          xz.publishCompany(this.projectId, infor).then(res => {
            if(res){
              this.$message({
                message: '保存信息成功',
                type: 'success'
              });
            
              this.$emit("closeForm", true);
            }else{
              this.$message.error('保存失败');
            }
          })
        }
      },

      // 关闭信息表
      hideForm(){
        this.$emit("closeForm");
      },

      // 检查必填项
      checkInput(){
        let isFill = true;
        // 检查地址选择
        if(!this.selected.value){
          this.$set(this.selected, "check", true);
        }
        // 项目介绍
        if(!this.contactProfile.value){
          isFill = false;
          this.$set(this.contactProfile, "check", true);
        }
        // 项目联系人
        if(!this.contactName.value){
          isFill = false;
          this.$set(this.contactName, "check", true);
        }
        // 项目联系人号码
        if(!this.contactNumber.value){
          isFill = false;
          this.$set(this.contactNumber, "check", true);
        }
        // 项目联系邮箱
        if(!this.contactMail.value){
          isFill = false;
          this.$set(this.contactMail, "check", true);
        }
        
        return isFill;
      }
    }
  }
</script>
<style scoped>
.closeForm{
    position: absolute;
    top: 15px;
    right: 15px;
    display: block;
    width: 30px;
    height: 30px;
    cursor: pointer;
    background: url("../../assets/images/black_close.png") no-repeat;
    background-size: 100% auto;
  }
.projectDetailContainer{
  padding: 50px 0;
  position: relative;
  width: 800px;
  background: #fff;
  margin-top: 20vh;
  height: 90vh;
  overflow-y: auto;
  box-sizing: border-box;
}
.detailCenter{
  width: 700px;
  margin: 0 auto;
}
#introduction{
  width: 550px;
  box-sizing: border-box;
}
.field_name::before{
  content: "*";
  font-size: 14px;
  color: #c82a2e;
}
.normalField::before{
  content: "" !important;
}
</style>
<style>
.emptyArea .trigger_select{
  border: 1px dashed #c82a2e !important;
}
</style>