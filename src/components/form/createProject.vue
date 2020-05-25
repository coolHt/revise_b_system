<template>
  <div class="fullScreenBg" @click="hideForm">
    <div class="createProjectForm" @click.stop="">
      <transition name="loadShadow">
          <div class="loadShadow" v-show="loadProject">
            <i class="loadgif"></i>
          </div>
        </transition>
      <i class="closeForm" @click="hideForm"></i>
      <div class="projectFormField">
        <span class="fieldLabel">项目类别:</span>
        <div class="inputContainer">
          <el-select v-model="objtype.value" placeholder="请选择" @change="selectCategory" :class="{'error-el' : objtype.check}">
            <el-option
              v-for="item in categoryList"
              :key="item.objtype"
              :label="item.objtype"
              :value="item.objtype">
            </el-option>
          </el-select>
          <p class="errorText" v-if="objtype.check">请选择项目类别</p>
        </div>
      </div>
      
      <div class="projectFormField">
        <span class="fieldLabel">项目名称:</span>
        <div class="inputContainer">
          <input type="text" class="projectFieldInput" v-model.trim="objname.value" :class="{'error_alert' : objname.check}" @blur="checkFillValue('objname')">
          <p class="errorText" v-if="objname.check">请填写项目名称</p>
        </div>
      </div>
      <div class="projectFormField">
        <span class="fieldLabel">项目备注:</span>
        <textarea name="" id="" class="projectFieldTextarea" v-model="others.value"></textarea>
      </div>
      
      <button type="button" class="saveProjectBtn" @click="saveCategory">保存项目类别</button>
    </div>
  </div>
</template>
<script>
import xz from "../../common";
export default {
  props: {
    info: Object,
    detail: {
      type: Boolean,
      default: false
    }
  },
  data(){
    return {
      loadProject: false,
      objid:{
        value: "",
        check: false
      },
      objname:{
        value: "",
        check: false
      },
      objtype:{
        value: "",
        check: false
      },
      others:{
        value: "",
        check: false
      },
      isdel: false,
      // 项目类别
      categoryList: []
    }
  },
  mounted(){
    xz.getCategory().then(category => {
      this.categoryList = category ? category : [];
    });
  },
  watch: {
    "info": {
      handler: function(){
        if(this.info){
          this.$set(this.objid, "value", this.info.objid);
          this.$set(this.objname, "value", this.info.objname);
          this.$set(this.others, "value", this.info.otherinf);
          this.$set(this.objtype, "value", this.info.objtype);
        }
      },
      immediate: true
    }
  },
  methods: {
    hideForm(){
      this.$emit("closeForm");
    },
    // 保存项目类别
    saveCategory(){
      if(this.checkFill()){
        this.loadProject = true;
        let obj = {
          objid: this.objid.value,
          objtype: this.objtype.value,
          objname: this.objname.value,
          others: this.others.value,
          isdel: this.isdel ? "1" : ""
        }
        xz.createProject(obj).then(res => {
          this.loadProject = false;
          if(res){
            this.$message({
              message: '新增成功',
              type: 'success'
            });
            // 修改详情中的数据
            if(this.detail){
              // 获取详细信息
              if(this.info.entid){
                xz.getCompanyInformation(this.info.entid).then(res => {
                  if(res){
                    const infor = {
                      entAct: "edit",
                      typesign: "inst",
                      entid: this.info.entid,
                      entName: this.objname.value,
                      entEmail: res.entEmail,
                      entCertId: res.entCertId,
                      entNation: res.entNation,
                      entAdd: res.entAdd,
                      entClass: res.entClass,
                      entScale: "",
                      entSummary: res.entSummary,
                      entConName: res.entConName,
                      entConTel: res.entConTel,
                      userid: Cookies.get("userid-b") 
                    }
                    xz.publishCompany(this.info.entid, infor)
                  }
                })
              }
            }
            this.$emit("closeForm", true);
          }else{
            this.$message.error('新增失败，请稍后再试');
          }
        })
      }
    },

    // 检查表单是否填写
    checkFill(){
      let isFill = true;
      
      // 项目类别
      if(!this.objtype.value){
        isFill = false;
        this.$set(this.objtype, "check", true);
      }

      // 项目名称
      if(!this.objname.value){
        isFill = false;
        this.$set(this.objname, "check", true);
      }

      return isFill;
    },

    // blur 检查填写
    checkFillValue(type){
      if(this[type].value){
        this.$set(this[type], "check", false);
      }
    },
    selectCategory(v){
      if(v){
        if(this.objtype.check){
          this.$set(this.objtype, "check", false);
        }
      }
    }
  }
}
</script>
<style scoped>
  .createProjectForm{
    position: relative;
    background: #fff;
    border-radius: 5px;
    padding: 70px 50px 50px 50px;
  }
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
  .inputContainer{
    width: 250px;
    margin-left: 10px;
  }
  .projectFieldInput,
  .projectFieldTextarea{
    width: 250px;
    border-radius: 3px;
    border: 1px solid #ddd;
    box-sizing: border-box;
    padding: 0 10px;
    height: 42px;
    outline: none;
  }
  .inputContainer .projectFieldInput{
    width: 100%;
  }
  .projectFieldTextarea{
    height: 80px;
    padding-top: 10px;
    padding-bottom: 10px;
    margin-left: 10px;
  }
  .fieldLabel{
    font-size: 14px;
    line-height: 42px;
    color: #333;
  }
  .fieldLabel::before{
    content: "*";
    color: rgb(243, 132, 128);
  }
  .projectFormField{
    display: flex;
    align-items: flex-start;
    margin-bottom: 15px;
  }
  .saveProjectBtn{
    font-size: 14px;
    display: block;
    margin: 0 auto;
    color: #fff;
    border-radius: 5px;
    padding:10px 14px;
    background: #409eff;
    outline: none;
    border: none;
  }
  .errorText{
    color:#c82a2e;
    margin-top: 8px;
  }
</style>
<style>
.projectFormField .el-input__inner{
  width: 250px;
  border-radius: 3px;
  border: 1px solid #ddd;
  box-sizing: border-box;
  height: 42px;
}
.error-el .el-input__inner{
  border: 1px dashed #c82a2e !important;
}
</style>