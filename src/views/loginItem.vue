<template>
  <div class="login-container">
    <div class="login-box">
      <div class="logo-img">
        <img src="../assets/images/maxlogo.jpg" alt="" />
      </div>
      <form id="login_form1" action="" method="post" autocomplete="off" class="am-form" data-am-validator>
        <div style="margin-bottom:30px;">
          <div class="am-form-group" style="margin-bottom:5px;">
            <label for="doc-vld-name-2"><i class="fa fa-user" aria-hidden="true"></i></label>
            <input type="text" placeholder="输入账号" required v-model="username" />
          </div>
          <p id="person-login-tips1" style="font-size:14px;color:#c82a2e;"></p>
        </div>

        <div style="margin-bottom:8px;">
          <div class="am-form-group" style="margin-bottom:5px;">
            <label for="doc-vld-email-2"><i class="fa fa-key" aria-hidden="true"></i></label>
            <input type="password" placeholder="输入密码" required v-model="password" @change="hiddenError"/>
          </div>
          <p id="person-login-tips2" style="font-size:14px;color:#c82a2e;"></p>
          <p ref="passwordError" style="font-size:14px;color:#c82a2e;display:none;">账号或密码错误</p>
        </div>
        <button id="btn-enterprise-login" type="button" class="am-btn am-btn-secondary" @click="funLogin">登录</button>
      </form>
    </div>
    <div class="loginPage" v-if="showLoging">
      <i class="loadgif"></i>
    </div>
    <Vcode :show="isShow" @onSuccess="onSuccess" @onClose="onClose"
          :imgs="[verityImg2,verityImg1,verityImg3,verityImg4]" />
  </div>
</template>
<script>
  import xz from "../common";
  import Vcode from "vue-puzzle-vcode";
  export default {
    components: {
      Vcode
    },
    data() {
      return {
        username: "",
        password: "",
        showLoging: false,
        isShow: false,
        verityImg1: require('../assets/images/promo_detailed_bg.jpg'),
        verityImg2: require('../assets/images/banner4.jpg'),
        verityImg3: require('../assets/images/test4.jpg'),
        verityImg4: require('../assets/images/banner3.jpg')
      };
    },
    methods: {
      //隐藏提示
      hiddenError(){
        let errWords = this.$refs.passwordError;
        if(errWords){
          errWords.style.cssText += "display:none";
        }
        
      },
      funLogin() {
        if (this.password && this.username) {
          this.isShow = true;
        }
      },
      onSuccess(){
        this.isShow = false; // 通过验证后，需要手动隐藏模态框
        const _this = this;
        _this.showLoging = true;
          //登录 
          xz.userLogin(this.username, this.password).then( res => {
            if(res){
              Cookies.set("userid-b", res.userid);
              Cookies.set("entid-b", res.entid);
              //登录成功或获取权限并设置
              xz.getMemberPurview(res.userid).then( res => {
                _this.$store.commit("admissonList", res); //设置权限
                _this.$store.commit("setLogin", true);
              })
              //获取账号信息
              xz.accountInformation().then( res => {
                _this.$store.commit("setAdminName", res.StrUserName);
              })
            }else{
              let errWords = this.$refs.passwordError;
              errWords.style.cssText += "display:block";
              _this.showLoging = false;
            }
          })
      },
      // 用户点击遮罩层，应该关闭模态框
      onClose(){
         this.isShow = false;
      }
    }
  };
</script>
<style scoped>
  .logo-img img {
    width: 100%;
    height: auto;
    display: block;
  }

  .hasAccount {
    width: 326px;
    margin: 0 auto 5px auto;
  }

  .login-container input {
    font-size: 16px;
  }

  .hasAccount {
    font-size: 16px;
  }
  .login-container .login-box .am-form .am-form-group{
    border-bottom: 2px solid #5f4b8b;
    overflow: hidden;
  }
  .login-container .login-box .am-form .am-form-group label{
    float: left;
  }
.login-container .login-box .logo-img{
  width: 219px;
  margin: 0 auto;
}
.login-container .login-box{
  width: 326px;
  margin: 0 auto;
}
.login-container .login-box .am-form{
  margin-top: 68px;
}
.login-container .login-box .am-form .am-form-group input{
    width: 265px;
    float: left;
    outline: none;
    margin-left: 10px;
    border: 0;
    background: 0 0;
    -webkit-box-shadow: none;
    box-shadow: none;
    padding: .5em;
    line-height:1.2;
}
.login-container .login-box .am-form .am-btn-secondary{
  width: 164px;
    height: 50px;
    background: #5f4b8b;
    border-color: #5f4b8b;
    border-radius: 27px;
    display: block;
    margin: 50px auto 0;
    font-size: 16px;
    font-weight: 400;
    outline: none;
    padding: .5em 1em;
    vertical-align: middle;
    color: #fff;
}
.login-container .login-box .am-form .am-form-group label i{
  font-size: 24px;
    color: #5f4b8b;
}
label {
    display: inline-block;
    margin-bottom: 5px;
    font-weight: 700;
}
.loginPage{
  position: absolute;
  width: 100%;
  height: 100vh;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  background: rgba(255,255,255,0.4);
}

</style>