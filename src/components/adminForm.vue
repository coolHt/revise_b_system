<template>
  <div class="workPoolItem" ref="addminForm">
    <!--遮罩层-->
    <transition name="loadShadow">
      <div class="loadShadow" v-show="!addMember">
        <i class="loadgif"></i>
      </div>
    </transition>
    <div>
      <h4 class="addJobTitle">新建账号</h4>
      <div class="card-content">
        <div class="agencyContainer adminField">
          <label class="agencyBelong"><span class="mustFillIcon">*</span>所属机构：</label>
          <input readonly type="text" placeholder="请输入机构名称" v-model="agencyName.instname" @click="agencyShow" class="agencySelect" ref="agencyNameInput">
          <p class="error-text" ref="agencyError">请选择所属机构</p>
        </div>
        <div class="infor_field">
          <label class="field_name"> <span style="color:#f38480 !important;">*</span>用户名称：</label>
          <div class="shortNameContainer">
            <input type="text" name="" class="jobNameInput" v-model="userName" @blur="checkRepalicate('name')" ref="nameInput">
            <p ref="nameErr" class="errorAlarm">用户名称已存在</p>
          </div>
        </div>
        <div class="infor_field">
          <label class="field_name"> <span style="color:#f38480 !important;">*</span>手机号码：</label>
          <div class="shortNameContainer">
            <input type="text" name="" class="jobNameInput" v-model="userTel" @blur="checkRepalicate('tel')" ref="telInput">
            <p ref="telErr" class="errorAlarm">手机号已存在</p>
          </div>
        </div>
        <div class="infor_field">
          <label class="field_name"> <span style="color:#f38480 !important;">*</span>登录邮箱：</label>
          <div class="shortNameContainer">
            <input type="text" name="" class="jobNameInput" v-model="userEmail" @blur="checkRepalicate('email')" ref="emailInput">
            <p ref="emailErr" class="errorAlarm">邮箱已存在</p>
          </div>
        </div>
        <div class="adminField">
          <div class="purviewBox">
            <label class="agencyBelong">权限设置：</label>
            <div class="purviewSelectList">
              <el-select v-model="initPurview" placeholder="请选择" @change="selectedPurviewList">
                <el-option v-for="purview in purviewCategory" :key="purview.roletype" :label="purview.rolename"
                  :value="purview.roletype">
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="extraPurview" v-show="purviewList.length > 0">
            <span class="extraTitle">权限</span>
            <el-checkbox-group v-model="selectedExtraList" @change="selectedExtra">
              <el-checkbox :label="p.powercode" v-for="(p, index) in purviewList" :key="index">{{p.powername}}</el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
        <div class="adminField">
          <TextInput :identify="check" labelText="账号密码：" category="password" @returnValue="pwdValue" :inputValue="userPwd.value" :valueVerify="userPwd.identifyType" :mustFill="true" >
          </TextInput>
        </div>
        <div class="adminField" style="margin-bottom:0">
          <label class="agencyBelong"><span class="mustFillIcon">*</span>确认密码：</label>
          <input placeholder="请确认密码" type="password" v-model="checkPwd" @blur="refirmPwdValue" class="normalInput" ref="confirmPwd">
        </div>
        <p class="error-text" ref="errorPwd">密码不一致</p>
        <div style="margin-top:15px">
          <button class="addBtn" @click.prevent="funUpload">新增</button>
        </div>
      </div>
    </div>
    <!--选择机构-->
    <el-dialog :visible.sync="showagency" width="400px" :before-close="closeAgency" :append-to-body="true"
      class="userAgency">
      <div class="selectedContainer">
        <div class="">
          <span>已选择:</span>
          <span v-if="currentSelected != ''">{{currentSelected.instname}}</span>
        </div>
        <button class="selectedAgencyBtn" @click="checkAgency">完成</button>
      </div>
      <vue-tree-list v-if="data" @click="onClick" :model="data" default-tree-node-name="new node"
        default-leaf-node-name="new leaf">
      </vue-tree-list>
      <div v-else class="loadDepartment">
        <span class="loadgif"></span>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {
    VueTreeList,
    Tree,
    TreeNode
  } from 'vue-tree-xz'
  import TextInput from "./form/textInput";
  import xz from "../common";
  export default {
    components: {
      VueTreeList,
      TextInput
    },
    props: {
      closeType: {
        type: Boolean,
        default: false
      }
    },
    data: function () {
      return {
        mailReg:/^[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*\.[a-z]{2,}$/,
        phoneReg:/^1[3456789]\d{9}$/,
        showPurview: true,
        userName: "",
        userEmail: "",
        userTel: "",
        userPwd: {
          value: "",
          identifyType: "empty"
        },
        checkPwd: "",
        //所属地区
        belongArea: "",
        //权限分类
        showDetailPurview: false,
        initPurview: '',
        purviewCategory: [],
        //已选择的权限列表
        checkPurview: [],
        reCheck: [], //选中的分类的详细权限列表
        //额外的权限
        purviewList: [],
        //选择的额外权限
        selectedExtraList: [],
        //显示机构列表
        showagency: false,
        //机构数据
        data: null,
        //已选择的机构
        currentSelected: "",
        agencyName: "",
        roleType: "",
        hasChoice: true, //判断是否可以选择机构
        //验证计数
        check: false,
        //遮罩层
        addMember: true
      };
    },
    watch: {
      'closeType': function () {
        if (this.closeType) {
          //初始化一波
          this.checkPurview = [];
          this.reCheck = []
          this.purviewList = [];
          this.selectedExtraList = [];
          this.initPurview = '';
          this.$emit("clearData");
        }
      }
    },
    mounted(){
      const _this = this;
      //权限分组
      xz.purviewGroup().then((res) => {
        res ? _this.purviewCategory = res : console.log("获取权限组出错");
      });
      //获取机构
      this.getTreeData();
    },
    methods: {
      //判重
      checkRepalicate(t){
        let v = "";
        let type = ""
        let errType = "";
        if(t == "name"){
           v = this.userName;
           type = "nameInput";
           errType = "nameErr";
        }
        if(t == "tel"){
          v = this.userTel;
          type = "telInput";
          errType = "telErr";
        }
        if(t == "email"){
          v = this.userEmail;
          type = "emailInput";
          errType = "emailErr";
        }
        if(v.trim()){
          let isPass = true;
          if(t == "email"){
            if(!this.mailReg.test(this.userEmail)){
              this.$refs[type].classList.add("error_alert");
              this.$refs[errType].style.cssText += "display:block";
              this.$refs[errType].innerText = "邮箱格式错误";
              isPass = false;
            }else{
              isPass = true;
            }
          }
          if(t == "tel"){
            if(!this.phoneReg.test(this.userTel)){
              this.$refs[type].classList.add("error_alert");
              this.$refs[errType].style.cssText += "display:block";
              this.$refs[errType].innerText = "手机号格式错误";
              isPass = false;
            }else{
              isPass = true;
            }
          }
          if(isPass){
            xz.repalicatePhone(v).then(res => {
              if(!res){
                this.$refs[type].classList.add("error_alert");
                this.$refs[errType].style.cssText += "display:block";
                if(t == "email"){
                  this.$refs[errType].innerText = "邮箱已存在";
                }else if(t == "tel"){
                  this.$refs[errType].innerText = "手机号已存在";
                }
              }else{
                this.$refs[type].classList.remove("error_alert");
                this.$refs[errType].style.cssText += "display:none";
              }
            });
          }
        }
      },
      //账号密码
      pwdValue(v) {
        if(v) this.$set(this.userPwd, "value", v);
      },
      agencyShow() {
        if(this.hasChoice) this.showagency = true;
      },
      //获取数据
      getTreeData() {
        xz.getDepartment(this.$store.state.instcode).then((res) => {
          if(res){
            this.data = new Tree(res)
          }else{
            this.agencyName = {
              instcode: this.$store.state.instcode,
              instname: this.$store.state.instname
            }
            this.currentSelected = {
              instcode: this.$store.state.instcode,
              instname: this.$store.state.instname
            }
            this.hasChoice = false;
          }
        })
      },
      //选择部门
      onClick(params) {
        this.currentSelected = params;
      },
      //关闭机构
      closeAgency() {
        this.showagency = false;
      },
      checkAgency() {
        this.agencyName = this.currentSelected;
        this.showagency = false;
        this.$refs.agencyNameInput.classList.remove("error-border");
        this.$refs.agencyError.style.cssText += "display:none";
      },
      //选择权限
      selectedPurviewList(type) {
        const _this = this;
        this.roleType = type;
        xz.purviewGroupList(type).then((res) =>{
          if(res){
            let arr = [];
            res.used.forEach((r) => {
              arr.push(r.powercode);
            })
            _this.selectedExtraList = arr;
            _this.purviewList = [...res.used,...res.unused];
          }else{
            console.log("获取权限租内容错误");
          }
        });
        this.checkPurview = [];
        this.reCheck = [];
      },
      //选择账号地区范围
      selectedPurviewRegion(type){
        
      },
      //更改分类的权限
      reSelected(data) {
        console.log(data);

      },
      //选择额外权限
      selectedExtra(p) {
        console.log(p);
      },
      //确认密码
      refirmPwdValue(){
        let show = "none";
        if(this.checkPwd !== this.userPwd.value){
          this.$refs.confirmPwd.classList.add("error_alert");
          show = "block";
        }else{
          this.$refs.confirmPwd.classList.remove("error_alert");
          show ="none";
        }
        this.$refs.errorPwd.style.cssText += `display:${show}`;
      },
      funUpload: function () {
        const _this = this;
        let hasError = false;
        this.check = true;
        //判断是否为空
        if(!this.userName){
          this.$refs.nameInput.classList.add("error_alert");
          hasError = true;
        }
        if(!this.userEmail || !this.mailReg.test(this.userEmail)){
          this.$refs.emailInput.classList.add("error_alert");
          hasError = true;
        }
        if(!this.userTel || !this.phoneReg.test(this.userTel)){
          this.$refs.telInput.classList.add("error_alert");
          hasError = true;
        }
        if(!this.userPwd.value || !this.checkPwd ){
          hasError = true;
        }
        if(this.userPwd.value !== this.checkPwd){
          this.$refs.errorPwd.style.cssText += `display:block`;
          this.$refs.confirmPwd.classList.add("error_alert");
          hasError = true;
        }
        setTimeout(() => {
          this.check = false;
        },100)
        if(this.$refs.addminForm.getElementsByClassName("error_alert").length > 0){
          return;
        }
        if (hasError){
          return;
        }
        this.addMember = false;
        const data = {
          userName: this.userName,
          userTel: this.userTel,
          userEmail: this.userEmail,
          userPwd: this.userPwd.value,
          instcode: this.currentSelected.instcode,
          instname: this.currentSelected.instname,
          roletype: this.roleType
        }
        const codeList = this.selectedExtraList.join();
        xz.addAdmin(data, codeList).then((res) => {
          if(res){
              _this.$emit("funAddMerber", data);
              _this.checkPwd = "";
              _this.addMember = true;
              _this.$message({
                message: "新增用户成功",
                type: "success"
              });
          }else{
            _this.addMember = true;
            console.log("获取账号信息失败");
          }
        })
      },
    }
  };
</script>
<style scoped>
  .jobNameInput{
    width: 300px;
    border: 1px solid #ddd;
    border-radius: 6px;
    height: 45px;
    font-size: 14px;
    padding: 0 15px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    outline: none;
  }
  .workPoolItem{
    position: relative;
  }
  .seeMorePurview {
    display: inline-block;
    margin-left: 10px;
    color: #0e90d2;
    font-size: 14px;
    cursor: pointer;
    line-height: 45px;
  }

  .purviewContainer {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }

  .purviewContainer p {
    margin: 0;
    color: #333;
  }

  .agencyContainer,
  .purviewBox {
    overflow: hidden;
  }

  .agencySelect {
    width: 300px !important;
    border: 1px solid #ddd !important;
    border-radius: 6px !important;
    height: 45px !important;
    font-size: 14px !important;
    padding: 0 15px !important;
    -webkit-box-sizing: border-box !important;
    box-sizing: border-box !important;
    outline: none !important;
    float: left !important;
  }
  .normalInput{
    width: 300px !important;
    border: 1px solid #ddd;
    border-radius: 6px !important;
    height: 45px !important;
    font-size: 14px !important;
    padding: 0 15px !important;
    -webkit-box-sizing: border-box !important;
    box-sizing: border-box !important;
    outline: none !important;
  }

  .purviewSelectList {
    width: 300px;
    float: left;
  }

  .purviewSelectList .el-select {
    width: 100% !important;
  }

  .agencyBelong {
    display: block;
    width: 150px;
    height: 45px;
    line-height: 45px;
    text-align: right;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    margin: 0;
    padding: 0 10px 0 0;
    float: left;
    margin-bottom: 0;
    color: #333;
    font-size: 15px;
    font-weight: bold;
  }

  .listContainer {
    width: 230px;
    border: 1px solid #333;
    height: 400px;
    border-radius: 5px;
  }

  .singlePurview {
    padding: 5px 0;
    cursor: pointer;
    font-size: 14px;
    color: #333;
    margin: 0;
  }

  .extraPurview,
  .categoryDetail {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    box-sizing: border-box;
    width: 100%;
  }

  .extraPurview .extraTitle {
    margin-top: 15px;
    display: inline-block;
  }

  
  .selectedAgencyBtn {
    color: #fff;
    cursor: pointer;
    border: none;
    box-shadow: none;
    outline: none;
    border-radius: 5px;
    background: #32c5d2;
    padding: 5px 10px;
  }

  .agencyContainer .error-border {
    border: 1px dashed #c82a2e !important;
  }

  .error-text {
    color: #c82a2e;
    font-size: 14px;
    width: 100%;
    margin: 5px 0 0 0;
    padding: 0;
    text-align: left;
    display: none;
    float: left;
    margin-left: 150px;
  }
  .adminField{
    margin-bottom: 15px;
  }
  .addJobTitle{
    font-size: 18px;
    font-weight: 700;
    color: #5f4b8b;
  }
  .errorAlarm{
    display: none;
    font-size: 14px;
    color: #c82a2e;
  }
</style>