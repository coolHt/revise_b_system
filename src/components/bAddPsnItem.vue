<template>
  <div class="workPoolItem">
    <div class="tpl-content-scope">
      <div class="row">
        <div class="am-u-lg-12 am-u-md-12 am-u-sm-12">
          <div class="card">
            <div class="card-title">
              <h4>
                <span class="am-icon-table"></span>
                <span>新增人才</span>
              </h4>
            </div>
            <hr>
            <div class="card-content">
              <form class="am-form am-form-horizontal" id="entBaseInfoForm">
                <fieldset>
                  <div class="am-form-group">
                    <label class="am-u-sm-12 am-form-label">用户姓名：</label>
                    <div class="am-u-sm-12">
                      <input id="name" type="text" placeholder="请输入用户姓名" v-model="newPsnInfo.psnName" class="addCheck">
                    </div>
                  </div>
                  <div class="am-form-group">
                    <label class="am-u-sm-12 am-form-label">手机号码：</label>
                    <div class="am-u-sm-12">
                      <input id="tel" type="text" placeholder="请输入手机号码" v-model="newPsnInfo.tel"  class="addCheck">
                      <span id="tipTel" style="color:#f38480">{{tipTel}}</span>
                    </div>
                  </div>
                  <div class="am-form-group">
                    <label class="am-u-sm-12 am-form-label">当前公司：</label>
                    <div class="am-u-sm-12">
                      <input type="text" id="nowCompany" placeholder="请输入当前公司" v-model="newPsnInfo.psnNowCompany"  class="addCheck">
                    </div>
                  </div>
                  <div class="am-form-group">
                    <label class="am-u-sm-12 am-form-label">当前职位：</label>
                    <div class="am-u-sm-12">
                      <input id="nowJob" type="text" placeholder="请输入当前职位" v-model="newPsnInfo.psnNowJob"  class="addCheck">
                    </div>
                  </div>
                  <div class="am-form-group">
                    <label class="am-u-sm-12 am-form-label">来源渠道：</label>
                    <div class="am-u-sm-12">
                      <select v-model="newPsnInfo.psnFromInfo">
                        <option value="前程无忧">前程无忧</option>
                        <option value="智联招聘">智联招聘</option>
                        <option value="猎聘">猎聘</option>
                        <option value="领英">领英</option>
                        <option value="拉钩">拉钩</option>
                        <option value="Boss直聘">Boss直聘</option>
                        <option value="社交圈">社交圈</option>
                        <option value="其他网站">其他网站</option>
                      </select>
                    </div>
                  </div>
                  <div class="am-form-group">
                    <div class="am-u-sm-3">
                      <button type="submit" class="am-btn am-btn-primary btn-add" @click.prevent="funUpload">确认</button>
                    </div>
                  </div>
                </fieldset>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  var usernameReg = /^[a-zA-Z0-9_-]{4,16}$/;
  var telReg = /^1[34578]\d{9}$/;
  import Cookies from "vue-cookies";
  export default {
    data: function () {
      return {
        userid: "",
        entid: "",
        newPsnInfo: {
          psnName: "",
          tel: "",
          psnNowCompany: "",
          psnNowJob: "",
          psnFromInfo: ""
        },

        tipTel: ""
      };
    },
    created() {
      this.userid = Cookies.get("userid-b");
      this.entid = Cookies.get("entid-b");
    },
    methods: {
      funUpload: function () {
        let addCheck = document.getElementsByClassName("addCheck");
        let hasNone = false;
        for(let i = 0; i < addCheck.length; i++){
          if(addCheck[i].value.trim() == ''){
            addCheck[i].style.cssText += 'border:1px dashed #c82a2e';
            hasNone = true;
          }else{
            addCheck[i].style.cssText += 'border:1px solid #ddd';
            
          }
        }
        var self = this;
        if (telReg.test(self.tel)) {
          self.tipTel = "请输入正确的手机号";
        } else {
          $.ajax({
            url: APIB,
            async: true,
            type: "post",
            dataType: "json",
            data: {
              action: "save",
              userid: self.userid,
              entid: self.entid,
              pagename: "addpsn",
              accountInfo: JSON.stringify(self.newPsnInfo)
            },
            success: function (res) {
              var jsonRes = JSON.parse(res);

              if (jsonRes.status == "ok") {
                self.$emit("funUpload", self.newPsnInfo);
                self.$message({
                  message: jsonRes.msg,
                  type: "success"
                });
              }
            }
          });
        }
      },
      //转换时间格式

      funTranDate: function (item, type) {
        let date = new Date(item);
        let Y = date.getFullYear();
        let M =
          "-" +
          (date.getMonth() + 1 < 10 ?
            "0" + (date.getMonth() + 1) :
            date.getMonth() + 1);
        let D = "-" + date.getDate() + " ";
        if (type == "m") {
          return Y + M;
        }
        return Y + M + D;
      }
    }
  };
</script>
<style scoped>
  td {
    font-size: 1.4rem;
  }

  td span a {
    color: #fff;
  }

  td span a:hover {
    color: #fff;
  }

  .btn-add {
    font-size: 14px;
    padding: 5px 10px;
    border: 1px solid #32c5d2;
    border-radius: 4px;
    color: #fff;
    background-color: #32c5d2;
  }

  .btn-add:hover {
    border-color: #32c5d2;
    color: #fff;
    background-color: #32c5d2;
  }

  .card-title span {
    color: #32c5d2;
  }

  .card {
    border: none;
    box-shadow: none;
    margin: 0;
  }

  .am-form-label {
    text-align: left;
  }
</style>