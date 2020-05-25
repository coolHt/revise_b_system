<template>
  <div class="workPoolItem">
    <transition name="loadShadow">
      <div class="loadShadow" v-show="loadAccount">
        <i class="loadgif"></i>
      </div>
    </transition>
    <el-tabs>
      <el-tab-pane label="账号信息"></el-tab-pane>
    </el-tabs>
    <div class="entInfoContainer">
      <div>
        <div class="card-content">
          <div class="infor_field">
            <IdentifyInput
              class="identify"
              :identify="userName.identify"
              labelText="用户姓名："
              :mustFill="true"
              width="250px"
              :inputValue="userName.value"
              :valueVerify="userName.identifyType"
              emptyText="请填写用户姓名"
              @returnValue="getUserName"
            ></IdentifyInput>
          </div>
          <div class="infor_field">
            <IdentifyInput
              class="identify"
              :identify="userTel.identify"
              labelText="手机号码："
              :mustFill="true"
              width="250px"
              :inputValue="userTel.value"
              :valueVerify="userTel.identifyType"
              emptyText="请填写手机号码"
              errorText="手机号码格式有误"
              @returnValue="getUserTel"
            ></IdentifyInput>
          </div>
          <div class="infor_field">
            <IdentifyInput
              class="identify"
              :identify="userEmail.identify"
              labelText="登录邮箱："
              :mustFill="true"
              width="250px"
              :inputValue="userEmail.value"
              :valueVerify="userEmail.identifyType"
              emptyText="请填写登录邮箱"
              errorText="邮箱格式有误"
              @returnValue="getUserEmail"
            ></IdentifyInput>
          </div>
          <div class="infor_field">
            <IdentifyInput
              class="identify"
              :identify="userPwd.identify"
              labelText="账号密码："
              :mustFill="true"
              width="250px"
              :inputValue="userPwd.value"
              :valueVerify="userPwd.identifyType"
              emptyText="请填写账号密码"
              @returnValue="getUserPwd"
              category="password"
            ></IdentifyInput>
          </div>
          <div class="infor_field">
            <IdentifyInput
              class="identify"
              :identify="checkPwd.identify"
              labelText="确认密码："
              :mustFill="true"
              width="250px"
              :inputValue="checkPwd.value"
              :valueVerify="checkPwd.identifyType"
              :handlerError="checkPwd.showError"
              emptyText="请确认密码"
              errorText="两次密码输入不匹配"
              @returnValue="getCheckPwd"
              category="password"
            ></IdentifyInput>
          </div>
        </div>
        <div>
          <button class="addBtn" @click="funUpload">确认修改</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import xz from "../common"; //输入框
import IdentifyInput from "../components/form/textInput";
export default {
  components: {
    IdentifyInput
  },
  data: function() {
    return {
      accountInfo: {
        userName: "",
        userTel: "",
        userEmail: "",
        userPwd: ""
      },
      userName: {
        value: "",
        identifyType: "empty",
        identify: false
      },
      userTel: {
        value: "",
        identifyType: "phone",
        identify: false
      },
      userEmail: {
        value: "",
        identifyType: "mail",
        identify: false
      },
      userPwd: {
        value: "",
        identifyType: "empty",
        identify: false
      },
      checkPwd: {
        value: "",
        identifyType: "empty",
        identify: false,
        showError: false
      },
      //原始名称
      orginalName: "",
      loadAccount: false
    };
  },
  created() {
    this.loadAccount = true;
    //获取用户名，手机号码，邮箱地址和密码
    xz.accountInformation().then(res => {
      if (res) {
        this.$set(this.userName, "value", res.StrUserName);
        this.orginalName = res.StrUserName;
        this.$set(this.userTel, "value", res.StrUserMobile);
        this.$set(this.userEmail, "value", res.StrUserEmail);
        this.$set(this.checkPwd, "value", "");
        this.$set(this.userPwd, "value", "");
      } else {
        console.log("获取账号信息错误");
      }
      this.loadAccount = false;
    });
  },
  methods: {
    getUserName(v) {
      this.$set(this.userName, "value", v);
      //如果输入的名字与原来的不一样，那么寻找是否有重名账号
      // if(this.orginalName != v){

      // }
    },
    getUserTel(v) {
      this.$set(this.userTel, "value", v);
    },
    getCheckPwd(v) {
      this.$set(this.checkPwd, "value", v);
      this.$set(this.checkPwd, "showError", false);
    },
    getUserPwd(v) {
      this.$set(this.userPwd, "value", v);
    },
    getUserEmail(v) {
      this.$set(this.userEmail, "value", v);
    },
    // funAjax: function (tp, val, type, tip) {
    //   $.ajax({
    //     type: "post",
    //     url: APIEnt,
    //     data: {
    //       type: "e",
    //       action: "chkusr",
    //       userid: Cookies.get("userid-b"),
    //       entid: Cookies.get("userid-b"),
    //       chktp: tp,
    //       chkval: val
    //     },
    //     dataType: "json",
    //     success: function (response) {
    //       var jsonRes = JSON.parse(response);
    //       if (jsonRes.status == "ok") {} else {
    //         $("#" + type).html(tip);
    //       }
    //     }
    //   });
    //   return false;
    // },
    //提交
    funUpload: function() {
      let access = true;
      if (!this.userName.value) {
        this.$set(this.userName, "identify", true);
        access = false;
      }
      if (!this.userTel.value) {
        this.$set(this.userTel, "identify", true);
        access = false;
      }
      if (!this.userEmail.value) {
        this.$set(this.userEmail, "identify", true);
        access = false;
      }
      if (!this.userPwd.value) {
        this.$set(this.userPwd, "identify", true);
        access = false;
      }
      if (!this.checkPwd.value) {
        this.$set(this.checkPwd, "identify", true);
        access = false;
      }
      if (this.userPwd.value != this.checkPwd.value) {
        this.$set(this.checkPwd, "showError", true);
        access = false;
      }
      if (!access) return;
      this.accountInfo = {
        userName: this.userName.value,
        userTel: this.userTel.value,
        userEmail: this.userEmail.value,
        userPwd: this.userPwd.value
      };
      this.loadAccount = true;
      xz.saveAccountInformation(this.accountInfo).then(res => {
        if (res) {
          this.$message({
            message: "保存成功",
            type: "success"
          });
        } else {
          console.log("保存账号信息错误");
        }
        this.loadAccount = false;
      });
    }
  }
};
</script>