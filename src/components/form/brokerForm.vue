<template>
  <div class="brokerForm">
    <div class="formContainer">
      <i class="closeOrganization" @click="closeOrganizationform"></i>
      <div class="editOrganization">
        <!-- <div class="draft-job">
          <h5>内部经纪人</h5>
        </div> -->
        <el-tabs v-model="activeName" @tab-click="switchCreation">
          <el-tab-pane label="内部经纪人" name="inner"></el-tab-pane>
          <el-tab-pane label="外部经纪人" name="out"></el-tab-pane>
        </el-tabs>
        <div class="newBroker">
          <div class="selectSubordinate"  v-show="activeName == 'inner'"> 
            <div class="infor_field">
              <label class="field_name">下级列表：</label>
              <div class="chooseSubordinate">
                <el-select v-model="selectedSubordinate" placeholder="请选择下级人员" @change="selectSubordinate">
                  <el-option
                    v-for="(item, index) in subordinateList"
                    :key="index"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </div>    
            </div>
          </div>
          <div class="createOutBroker" v-show="activeName == 'out'" ref="createF">
            <div class="infor_field">
              <label class="field_name">经纪人名称：</label>
              <div class="inputSubordinate">
                <input type="text" ref="brokerName" v-model="brokername" @blur="checkName">
                <p class="error-text" ref="error_name">经纪人名称已存在</p>
              </div>
            </div>
            <div class="infor_field">
              <label class="field_name">经纪人号码：</label>
              <div class="inputSubordinate">
                <input type="text" ref="brokerNumber" v-model="brokernumber" @blur="checkNumber">
                <p class="error-text" ref="error_num"></p>
              </div>    
            </div>
          </div>
        </div>
        <button type="button" class="addSubordinateBtn" @click="addNewBroker">新增</button>
      </div>
    </div>
  </div>
</template>
<script>
  import xz from "../../common";
  export default {
    props: {

    },
    data() {
      return {
        phoneReg:/^1[3456789]\d{9}$/,
        activeName: "inner",
        subordinate: "",
        //下级人员列表
        subordinateList: [],
        //已选择的下级
        selectedSubordinate: null,
        //外部经纪人名称
        brokername: "",
        brokernumber: ""
      }
    },
    mounted(){
      //获取下级人员列表
      xz.groupMember().then( member => {
        if(member && Array.isArray(member)){
          member.forEach( m => {
            this.subordinateList.push({
              value: m.id,
              label: m.userName,
              mobile: m.usermobile
            })
          })
        }else{
          this.subordinateList = [];
        }
      })
    },
    methods: {
      //点击关闭
      closeOrganizationform() {
        this.$emit("closeform");
      },
      //选择下级
      selectSubordinate(d){
        this.selectedSubordinate = d;
      },
      //新增经纪人
      addNewBroker(){
        if(this.activeName == "inner"){
          let broker = this.subordinateList.find( s => s.value == this.selectedSubordinate);
          let data  ={
            username: broker.label,
            userid: broker.value,
            usertel: broker.mobile
          }
          xz.addBroker(data).then(res => {
            if(res){
              this.$message({
                message: "新增经纪人成功",
                type: "success"
              });
              this.$emit("refresh");
            }else{
              this.$message.error('系统错误，请稍后再试');
            }
          });
        }else{//out
          //外部
          let hasErr = false;
          if(!this.brokername.trim()){ //如果名称没有填
            this.$refs.brokerName.classList.add("error_alert");
            this.$refs.error_name.style.cssText += "display:block";
            this.$refs.error_name.innerText = "请填写经纪人名称";
            hasErr = true;
          }
          //如果手机号没有填
          if(!this.brokernumber.trim()){
            this.$refs.brokerNumber.classList.add("error_alert");
            this.$refs.error_num.style.cssText += "display:block";
            this.$refs.error_num.innerText = "请填写手机号码";
            hasErr = true;
          }
          if(this.$refs.createF.getElementsByClassName("error_alert").length > 0){
            hasErr = true;
          }
          if(hasErr) return;
          let data  ={
            username: this.brokername,
            userid: "",
            usertel: this.brokernumber
          }
          xz.addBroker(data).then(res => {
            if(res){
              this.brokername = "";
              this.brokernumber = "";
              this.$message({
                message: "新增经纪人成功",
                type: "success"
              });
              this.$emit("refresh");
            }else{
              this.$message.error('系统错误，请稍后再试');
            }
          });
        }
        
      },
      //切换经纪人
      switchCreation(){
        console.log(this.activeName);
      },
      //检查名字
      checkName(){
        let n = this.brokername.trim();
        if(n){
          xz.repalicatePhone(n).then( res => {
              if(!res){
                this.$refs.brokerName.classList.add("error_alert");
                this.$refs.error_name.style.cssText += "display:block";
                this.$refs.error_name.innerText = "名称已存在";
              }else{
                this.$refs.brokerName.classList.remove("error_alert");
                this.$refs.error_name.style.cssText += "display:none";
              }
            })
        }
      },
      //检查手机号
      checkNumber(){
        let num = this.brokernumber.trim();
        if(num){
          let formatError = false;
          if(!this.phoneReg.test(num)){
            this.$refs.brokerNumber.classList.add("error_alert");
            this.$refs.error_num.style.cssText += "display:block";
            this.$refs.error_num.innerText = "手机号码格式错误";
            formatError = true;
          }
          if(!formatError){
            xz.repalicatePhone(num).then( res => {
              if(!res){
                this.$refs.brokerNumber.classList.add("error_alert");
                this.$refs.error_num.style.cssText += "display:block";
                this.$refs.error_num.innerText = "手机号码已存在";
              }else{
                this.$refs.brokerNumber.classList.remove("error_alert");
                this.$refs.error_num.style.cssText += "display:none";
              }
            })
          }
        }
      }
    }
  }
</script>
<style scoped>
  .formContainer {
    position: relative;
    width: 1000px;
    box-sizing: border-box;
    padding: 50px 20px 30px 20px;
    background: #fff;
    margin: 5vh auto 0 auto;
  }
  .brokerForm {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.4);
    z-index: 999;
  }
  .editOrganization{
    width: 710px;
    margin: 0 auto;
  }
  .newBroker{
    width: 100%;
    margin-top: 30px;
  }
  .addSubordinateBtn{
    display: block;
    margin: 20px auto 0 auto;
    border:none;
    outline: none;
    color: #fff;
    background:#409eff;
    border-radius: 5px;
    padding: 8px 25px;
    font-size: 14px;
  }
  .inputSubordinate input{
    width: 100%;
  }
  .inputSubordinate{
    width: 300px;
  }
  .error-text {
    color: #c82a2e;
    font-size: 14px;
    width: 100%;
    margin: 5px 0 0 0;
    padding: 0;
    text-align: left;
    display: none;
  }
</style>
<style>
.chooseSubordinate .el-input__inner{
  width: 250px;
}
</style>