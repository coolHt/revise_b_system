<template>
  <div class="psnInfoItem">
    <div class="briefInfo">
      <!--名片-->
      <div class="briefInformation" v-if="card && type != 'pool'">
        <div class="infor_field">
          <span class="field_name">{{card.psnName}}</span>

          <span style="color:#fff;" class="label label-sm label-danger" v-if="inforData.status == 0">待激活</span>
          <span style="color:#fff;" class="label label-sm label-success" v-else-if="inforData.status == 1">已激活</span>
        </div>
        <div class="infor_field">
          <span>{{card.psnNowCompany}} —— {{card.psnNowJob}}</span>
        </div>
        <div class="infor_field">
          <span v-if="inforData.tel">{{inforData.tel}}</span>
          <span v-else>未填写</span>
        </div>
      </div>
    </div>
    <div class="accessoryList">
      <el-collapse v-model="activeNames" @change="handleChange" v-if="type != 'pool'">
        <el-collapse-item>
          <template slot="title">
            <span class="fiddleTitle" style="color:#5f4b8b;font-size:14px;font-weight:bold;">附件列表</span>
          </template>
          <div class="accessoryPart">
            <h3>用户附件</h3>
            <div class="accessories">
              <p>暂无简历</p>
            </div>
          </div>
          <div class="accessoryPart">
            <h3>内部附件</h3>
            <div class="accessories">
              <p>暂无简历</p>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect"
      v-if="type != 'pool'">
      <el-menu-item index="1">用户简历</el-menu-item>
      <el-menu-item index="2">内部资料</el-menu-item>
      <el-menu-item index="3">推送历史</el-menu-item>
    </el-menu>

    <div v-show="activeIndex=='1' && type != 'pool'">
      <UserResume :resume="cvinfo"></UserResume>
    </div>
    <div v-show="activeIndex=='2' || type == 'pool'">
      <ResumeItem :resume="innerInfo" :orderId="psnid" :type="type"></ResumeItem>
    </div>
    <div v-show="activeIndex=='3' && type != 'pool'">
      <p>尚未开通，敬请期待</p>
    </div>
  </div>
</template>
<script>
  import ResumeItem from "./bResumeEntry";
  import Cookies from "vue-cookies";
  import UserResume from "./userResume";

  export default {
    props: {
      singleInfo: Object, //个人字段
      type: String, //类型，是pool 还是all
    },
    components: {
      ResumeItem,
      UserResume
    },
    data: function () {
      return {
        psnid: "",
        activeIndex: "1",
        activeNames: [],
        //内部资料
        innerInfo: {},
        //主动简历
        cvinfo: {},
        //头部简介
        card: {},
        //个人的记录属性
        inforData: {}
      };
    },
    mounted() {
      this.psnid = this.singleInfo.userid_p;
      let data = {
        type: this.type,
        info: this.singleInfo
      }
      this.$store.commit("talentInfo", data); //获取个人信息
    },
    watch: {
      '$store.state.TALENTS.talent': function () {
        //获取到父组件传过来的个人的所有简历
        let resume = this.$store.state.TALENTS.talent;
        //个人投递简历
        if (resume.cvinfo.status != 'error') {
          this.cvinfo = resume.cvinfo;
        } else {
          this.cvinfo = '';
        }

        //内部简历
        if (JSON.stringify(resume.innerinfo) != "{}") {
          this.innerInfo = resume.innerinfo;
        } else {
          this.innerInfo = '';
        }
        if (this.cvinfo) {
          this.card = this.cvinfo.psnBaseInfo;
        } else {
          this.card = this.innerInfo.psnBaseInfo;
        }

      },
      //个人的记录属性
      singleInfo: {
        handler: function () {
          this.psnid = this.singleInfo.userid_p;
          let data = {
            type: this.type,
            info: this.singleInfo
          }
          this.$store.commit("talentInfo", data); //获取个人信息
        }
      }
    },

    methods: {
      handleSelect(key, keyPath) {
        //用于分开获取内部资料/用户简历 暂时保存
        // if (key == 2) {
        //   $.ajax({
        //     url: APIB,
        //     async: true,
        //     type: "post",
        //     beforeSend: function (request) {
        //       request.setRequestHeader("token", Cookies.get("token"));
        //     },
        //     data: {
        //       'action': 'edit',
        //       'type': 'p',
        //       'userid': self.info.userid,
        //       'entid': self.info.entid,
        //       'cvid': self.info.CVID,
        //       'signMsg': self.info.signMsg,
        //       'jobid': self.info.jobid,
        //       'pagename': 'psnbaseinfo'
        //     },
        //     success: function (res) {

        //     }
        //   })
        // }

        this.activeIndex = key;
      },
      handleChange(val) {
        console.log(val);
      }
    }
  };
</script>
<style scoped>
  .row-mb {
    margin: 0 20px;
  }

  .psnInfoNav .el-tabs__item .is-top .is-active {
    color: #32c5d2;
  }

  .name {
    margin: 15px 0;
    position: relative;
    display: inline-block;
    height: 22px;
    font-size: 22px;
    line-height: 22px;
  }

  .tel {
    margin: 10px 0;
    position: relative;
    display: inline-block;
    height: 18px;
    font-size: 18px;
    line-height: 18px;
  }

  .pay {
    color: #e7505a;
  }



  .title {
    height: 15px;
    font-size: 15px;
    line-height: 15px;
  }

  .btn-add {
    display: inline-block;
    font-size: 12px;
    padding: 2px;
    border: 1px solid #32c5d2;
    border-radius: 4px;
    color: #fff;
    background-color: #32c5d2;
  }

  .btn-not-add {
    display: inline-block;
    font-size: 12px;
    padding: 2px;
    border: 1px solid #e7505a;
    border-radius: 4px;
    color: #fff;
    background-color: #e7505a;
  }

  .article {
    width: 50%;
    /* word-wrap:break-word */
  }

  .el-menu {
    margin-bottom: 10px;
  }
</style>