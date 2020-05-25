<template>
  <div class="fullScreenBg" @click="hideForm">
    <div class="createProjectForm" @click.stop="">
      <i class="closeForm" @click="hideForm"></i>

      <div class="projectFormField">
        <span class="fieldLabel">项目类别:</span>
        <div class="inputContainer">
          <input type="text" class="projectFieldInput" v-model.trim="productCategory.value" :class="{'error_alert' : productCategory.check}" @blur="checkFillValue('productCategory')">
          <p class="errorText" v-if="productCategory.check">请填写项目类别</p>
        </div>
      </div>
      <div class="projectFormField">
        <span class="fieldLabel">机构名称:</span>
        <div class="inputContainer">
          <input type="text" class="projectFieldInput" v-model.trim="productName.value" :class="{'error_alert' : productName.check}" @blur="checkFillValue('productName')">
          <p class="errorText" v-if="productName.check">请填写机构名称</p>
        </div>
      </div>
      <div class="projectFormField">
        <span class="fieldLabel">项目备注:</span>
        <textarea name="" id="" class="projectFieldTextarea" v-model="productComment.value"></textarea>
      </div>
      
      <button type="button" class="saveProjectBtn" @click="saveCategory">保存项目类别</button>
    </div>
  </div>
</template>
<script>
import xz from "../../common";
export default {
  data(){
    return {
      productCategory:{
        value: "",
        check: false
      },
      productName:{
        value: "",
        check: false
      },
      productComment:{
        value: "",
        check: false
      }
    }
  },
  mounted(){
    xz.getCategory().then(category => {
      console.log(category);
    });
  },
  methods: {
    hideForm(){
      this.$emit("closeForm");
    },
    // 保存项目类别
    saveCategory(){
      if(this.checkFill()){
        let obj = {
          objtype: this.productCategory.value,
          objname: this.productName.value,
          others: this.productComment.value
        }
        xz.addProjectCategory(obj).then(res => {
          if(res){
            this.$message({
              message: '新增成功',
              type: 'success'
            });
            this.$emit("closeForm");
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
      if(!this.productCategory.value){
        isFill = false;
        this.$set(this.productCategory, "check", true);
      }

      // 项目名称
      if(!this.productName.value){
        isFill = false;
        this.$set(this.productName, "check", true);
      }

      return isFill;
    },

    // blur 检查填写
    checkFillValue(type){
      if(this[type].value){
        this.$set(this[type], "check", false);
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