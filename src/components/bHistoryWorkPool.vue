<template>
  <div class="workPoolItem">
    <div class="row" v-if="openSearch">
      <div class="am-u-md-12 am-u-sm-12 row-mb">
        <div class="search-item">
          <el-form>
            <el-form-item label="姓名：">
              <el-input size="small" class="search-input" v-model="searchInfo.name"></el-input>
            </el-form-item>
            <el-form-item label="手机：">
              <el-input size="small" class="search-input" v-model="searchInfo.tel"></el-input>
            </el-form-item>
            <el-form-item label="学校：">
              <el-input size="small" class="search-input" v-model="searchInfo.school"></el-input>
            </el-form-item>
            <el-form-item label="职位：">
              <el-input size="small" class="search-input" v-model="searchInfo.job"></el-input>
            </el-form-item>
            <el-form-item label="公司：">
              <el-input size="small" class="search-input" v-model="searchInfo.company"></el-input>
            </el-form-item>
            <el-form-item label="全文关键词：">
              <el-input size="small" class="search-input" v-model="searchInfo.keyword"></el-input>
            </el-form-item>
            <el-form-item label="简历状态：">
              <el-radio-group v-model="searchInfo.status" size="small">
                <el-radio-button label="1">已激活</el-radio-button>
                <el-radio-button label="2">待激活</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="联系记录：">
              <el-radio-group v-model="searchInfo.constatus" size="small">
                <el-radio-button label="沟通中"></el-radio-button>
                <el-radio-button label="已拒绝"></el-radio-button>
                <el-radio-button label="无法联系"></el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-button plain size="small" @click="funClearSearch">清空</el-button>
            <el-button type="primary" size="small" @click="funSearch">搜索</el-button>
          </el-form>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="am-u-md-12 am-u-sm-12 row-mb">
        <div>
          <div class="tpl-portlet-title">
            <div>
              <span>
                <a class="btn-open-search" @click="openSearch = !openSearch">打开搜索</a>
              </span>
            </div>
          </div>
          <div class="tpl-scrollable">
            <table>
              <thead>
                <tr>
                  <th>推送职位</th>
                  <th>姓名</th>
                  <th>当前职位</th>
                  <th>当前公司</th>
                  <th>当前年薪</th>
                  <th>用户意向</th>
                  <th>企业意向</th>
                  <th>推送时间</th>
                  <!-- <th>业务状态</th> -->
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item,index) in  historyList" :key="index">
                  <td>
                    <a class="user-name" @click="funShowJobDetail(item)">{{item.jobName?item.jobName:'职位丢失'}}</a>
                  </td>
                  <td>
                    <a class="user-name" @click="funShowPsnDetail(item)">{{item.userName}}</a>
                  </td>
                  <td>{{item.currJob}}</td>
                  <td>{{item.currComp}}</td>
                  <td class="font-green">{{item.currSalary}}</td>
                  <td>
                    <span v-if="item.psnThk == 1">喜欢</span>
                    <span v-else-if="item.psnThk == 2">不喜欢</span>
                    <span v-else-if="!item.psnThk">未处理</span>
                  </td>

                  <td>
                    <span v-if="item.entThk == 1">喜欢</span>
                    <span v-else-if="item.entThk == 2">不喜欢</span>
                    <span v-else-if="item.entThk == 0">未处理</span>
                  </td>

                  <td>
                    {{new Date(item.insertDate).getFullYear() + '-' + (new Date(item.insertDate).getMonth() + 1) + '-' + new Date(item.insertDate).getDate()}}
                  </td>

                </tr>
              </tbody>
            </table>
            <div v-if="historyListNum > 0">
              <el-pagination :page-size="num" :pager-count="5" layout="prev, pager, next" :total="historyListNum"
                @current-change="currentChange" @prev-click="prevClick" @next-click="nextClick"></el-pagination>
            </div>
          </div>
        </div>
      </div>

      <!--个人简历详情dialog-->
      <el-dialog :visible.sync="showPsnDetail" class="personalResume" width="1100px">
        <psnInfoItem :singleInfo="singleInfo" type="all"></psnInfoItem>
      </el-dialog>

      <!--职位详情dialog-->
      <el-dialog :visible.sync="showJobDetail" width="1100px">
        <jobInfoItem :sendjobid="sendjobid" :sententid="sententid" operateApproveal="false"></jobInfoItem>
      </el-dialog>
    </div>

  </div>
</template>
<script>
  import Cookies from "vue-cookies";
  import psnInfoItem from "./PsnInfo";
  import jobInfoItem from "./JobDetail";
  export default {
    components: {
      psnInfoItem,
      jobInfoItem
    },
    data: function () {
      return {
        searchInfo: {
          name: "",
          tel: "",
          school: "",
          job: "",
          company: "",
          status: "",
          keyword: "",
          constatus: ""
        },
        openSearch: false,
        sendjobid: "",
        sententid:"",
        showPsnDetail: false,
        showJobDetail: false,
        num: 10,
        singleInfo: {},
      };
    },
    created() {
      this.$store.commit("passHistory");
    },
    computed:{
      historyList(){ //历史推送人列表
        return this.$store.state.TALENTS.history;
      },
      historyListNum(){ //历史推送人数
        return this.$store.state.TALENTS.historyNum;
      }
    },
    methods: {
      currentChange(data) {
        this.$store.commit("passHistory",data);
      },
      prevClick(data) {
        this.$store.commit("passHistory",data);
      },
      nextClick(data) {
        this.$store.commit("passHistory",data);
      },

      //点击查看个人详情
      funShowPsnDetail(e) {
        this.singleInfo = e;
        this.showPsnDetail = !this.showPsnDetail;
      },
      //点击查看职位信息
      funShowJobDetail(e) {
        this.showJobDetail = !this.showJobDetail;
        this.sendjobid = e.jobId; //用于获取职位信息
        this.sententid = e.entId; //用于获取企业基本信息
      },
      /**
       *  搜索
       */
      funClearSearch: function () {
        this.searchInfo = {};
      },
      funSearch: function () {
        var self = this;
        $.ajax({
          type: "post",
          url: APIB,
          data: {
            userid: Cookies.get("userid-b"),
            entid: Cookies.get("userid-b"),
            action: "edit",
            pagename: "historylist",
            msg: JSON.stringify(self.searchInfo)
          },
          dataType: "json",
          success: function (response) {
            var jsonRes = JSON.parse(response);
            if (jsonRes.status == "ok") {
              //self.historyOrderList = jsonRes.msg.historyOrderList;
            }
          }
        });
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
    padding: 5px;
    border: 1px solid #32c5d2;
    border-radius: 4px;
    color: #32c5d2;
    background-color: #fff;
  }

  .btn-add:hover {
    border-color: #32c5d2;
    color: #fff;
    background-color: #32c5d2;
  }

  .search-item .el-form-item {
    display: inline-block;
    width: 30%;
    margin: 10px;
  }

  .search-item .search-input {
    width: 75%;
  }

  .btn-open-search {
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    color: #606266;
    background-color: #fff;
    padding: 5px;
    margin: 5px;
  }
</style>