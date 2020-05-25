<template>
<div class="fullScreenBg" @click="hideForm">
    <div class="createProjectForm" @click.stop="">
      <transition name="loadShadow">
          <div class="loadShadow" v-show="loadProject">
            <i class="loadgif"></i>
          </div>
        </transition>
      <i class="closeForm" @click="hideForm"></i>
      <div class="createAccount">
        <input style="position:absolute;z-index:-999;top:0;left:0;" id="copyBox" />
        

        <div class="" >
          <div class="accountFormField">
            <span class="formField"><span style="color:#c82a2e !important;">*</span>手机号:</span>
            <input type="text" class="formFieldInput" style="color:#333;" placeholder="请填写手机号作为登录账号使用" ref="accountInput"
              v-model="accoutData.usertel" @blur="blurCheckType('accountInput')">
          </div>
          <span class="error_text accountError" ref="accountError" style="display:none;"></span>
          <div class="accountFormField">
            <span class="formField"><span style="color:#c82a2e !important;">*</span>企业名称:</span>
            <input type="text" class="formFieldInput" placeholder="请填写姓名或企业名称作为登录账号使用" style="color:#333;" v-model="accoutData.username"
              ref="usernameInput" @blur="blurCheckType('usernameInput')">
          </div>
          <span class="error_text accountError" ref="usernameError" style="display:none;"></span>
          <div class="accountFormField">
            <span class="formField"><span style="color:#c82a2e !important;">*</span>邮箱:</span>
            <input type="text" class="formFieldInput" style="color:#333;" placeholder="请填写邮箱作为登录账号使用" ref="mailInput"
              v-model="accoutData.useremail" @blur="blurCheckType('mailInput')">
          </div>
          <div class="accountFormField">
            <span class="formField">默认密码:</span>
            <input disabled type="text" class="formFieldInput" style="color:#333;" ref="mailInput" value="88088" @blur="blurCheckType('mailInput')">
          </div>
          <span class="error_text accountError" ref="mailError" style="display:none;"></span>
          <span class="centerCheckBtn" @click="produceAccount">生成账号</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import xz from "../../common";
export default {
  props: {
    "entid": {
      type: String,
      default: ""
    }
  },
  data(){
    return {
      loadProject: false,
      //生成账号
      accoutData: {
        username: '',
        useremail: '',
        usertel: '',
        userid_e: '',
        entid: ''
      },
      telReg: /^1[34578]\d{9}$/,
      //正则
      emailReg: /^[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*\.[a-z]{2,}$/,
    }
  },
  watch: {
    "entid": {
      handler: function(){
        if(this.entid){
          // 获取企业信息
          this.loadProject = true;
          xz.getCompanyInformation(this.entid).then(info => {
            this.loadProject = false;
            if(info){
              this.accoutData = {
                username: info.entName,
                useremail: info.entEmail,
                usertel: info.entConTel,
                entid: this.entid,
                userid_e: '',
              }
            }
          })
        }
      },
      immediate: true
    }
  },
  methods: {
    hideForm(){
      this.$emit("closeForm");
    },
    // 生成账号
    produceAccount(){
      // 判断填写
      // 邮箱
      let isError = false;
      if(!this.accoutData.useremail.trim() || !this.emailReg.test(this.accoutData.useremail)){
        isError = true;
        this.$refs.mailError.style.cssText += 'display:block';
        this.$refs.mailError.innerText = '请检查邮箱格式是否正确';
      }
      // 名称
      if(!this.accoutData.username.trim()){
        isError = true;
        this.$refs.usernameError.style.cssText += 'display:block';
        this.$refs.usernameError.innerText = '请填写企业名称';
      }
      // 手机号
      if(!this.accoutData.usertel.trim() || !this.telReg.test(this.accoutData.usertel)){
        isError = true;
        this.$refs.accountError.style.cssText += 'display:block';
        this.$refs.accountError.innerText = '请检查手机号格式是否正确';
      }
      if(isError) return; 
      this.loadProject = true;
      xz.createCompanyAccount(this.accoutData).then( res => {
        this.loadProject = false;
        this.$message({
          message: res ? '创建账号成功!' : '手机号已被注册',
          type: res ? 'success' : 'error'
        });
        console.log(res);
      })
    },
    //blur 检查填写内容
      blurCheckType(type) {
        if (type == 'usernameInput') {
          if (this.accoutData.username.trim() && this.accoutData.username.indexOf(' ') < 0) {
            this.$refs.usernameError.style.cssText += 'display:none';
            this.$refs.usernameError.innerText = '';
            if (this.$refs.usernameInput.classList.contains('error_alert')) {
              this.$refs.usernameInput.classList.remove('error_alert');
            }
          }
        }
        if (type == 'accountInput') {
          if (this.accoutData.usertel.trim() && this.telReg.test(this.accoutData.usertel)) {
            this.$refs.accountError.style.cssText += 'display:none';
            this.$refs.accountError.innerText = '';
            if (this.$refs.accountInput.classList.contains('error_alert')) {
              this.$refs.accountInput.classList.remove('error_alert');
            }
          }else{
            // 
            this.$refs.accountError.style.cssText += 'display:block';
            this.$refs.accountError.innerText = '请检查手机号格式是否正确';
          }
        }
        if (type == 'mailInput') {
          if (this.accoutData.useremail.trim() && this.emailReg.test(this.accoutData.useremail)) {
            this.$refs.mailError.style.cssText += 'display:none';
            this.$refs.mailError.innerText = '';
            if (this.$refs.mailInput.classList.contains('error_alert')) {
              this.$refs.mailInput.classList.remove('error_alert');
            }
          }else{
            this.$refs.mailError.style.cssText += 'display:block';
            this.$refs.mailError.innerText = '请检查邮箱格式是否正确';
          }
        }
      },
    //复制
    copyAccount() {
      var hideTextarea = document.createElement('textarea');
      var systemName = "手机端企业招聘系统\n";
      var pcLogin = "企业手机端登录地址：m.aizhaopin.net\n";
      var msg = '\n密码: 88088';
      var entName = "企业名称: " + this.$refs.entText.innerText;
      var account = "账号: " + this.$refs.accountText.innerText;
      var body = document.getElementsByTagName('body')[0];
      body.appendChild(hideTextarea);
      hideTextarea.style.opacity = "0";
      hideTextarea.style.position = 'absolute';
      hideTextarea.style.left = '-9999px';
      hideTextarea.style.top = '-9999px';
      var selectionObject = window.getSelection();
      var range = document.createRange();
      range.setStart(selectionObject.anchorNode, selectionObject.anchorOffset);
      range.setEnd(selectionObject.focusNode, selectionObject.focusOffset);
      hideTextarea.value = '';
      hideTextarea.value += systemName + pcLogin + entName + "\n" + account + msg;
      hideTextarea.focus();
      hideTextarea.setSelectionRange(0, hideTextarea.value.length);
      document.execCommand('copy');
      // 将此前选中的文本再进行选中
      selectionObject.removeAllRanges();
      selectionObject.addRange(range);
      this.$message({
        message: '复制成功',
        type: 'success'
      });
    },
  }
}
</script>
<style scoped>
  .createProjectForm{
    width: 450px;
    background: #fff;
    padding: 60px 0;
    position: relative;
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
</style>