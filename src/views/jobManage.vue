<template>
  <div class="workPoolItem">
    <div>
      <el-tabs>
        <el-tab-pane label="职位列表"></el-tab-pane>
      </el-tabs>
      <div>
        <div class="searchCon">
          <div>
            <input
              type="text"
              class="blurSearch"
              placeholder="请输入关键词查询"
              v-model="searchJson.keyword"
              style="border-top-right-radius:0;border-bottom-right-radius:0"
            />
            <button class="keyfieldButton" @click="searchJob(1)">搜索</button>
          </div>

          <div v-show="openSearch">
            <div class="search-item searchContainer">
              <div class="singleSearch">
                <span class="searchField">职位名称：</span>
                <input type="text" class="searchInput" v-model="searchJson.jobname" placeholder />
              </div>
              <div class="singleSearch">
                <span class="searchField">公司名称：</span>
                <input type="text" class="searchInput" v-model="searchJson.entname" />
              </div>
              <div class="singleSearch">
                <span class="searchField">职能：</span>
                <input type="text" class="searchInput" v-model="searchJson.funcname" />
              </div>
              <div class="btnContainer" style="margin-top: 0;">
                <button @click="funClearSearch" class="clearButton">清空</button>
              </div>
            </div>
          </div>
          <div class="rightSearch">
            <a class="btn-open-search" @click="openSearch = !openSearch">更多搜索</a>
          </div>
        </div>
      </div>

      <p class="listCount" style="position:relative;">
        共有
        <span style="color:#e7505a;font-weight:bold;">{{joblistNum}}</span> 个
      </p>
      <div class="companyList">
        <transition name="loadShadow">
          <div class="loadShadow" v-show="loadTalents">
            <i class="loadgif"></i>
          </div>
        </transition>
        <div class="companyHeadLine">
          <ul class="companyItem">
            <li style="width:17%">职位名称</li>
            <li style="width:17%">公司名称</li>
            <li style="width:14%;text-align:center;">职能</li>
            <li style="width:7%;text-align:center;">学历</li>
            <li style="width:8%">年薪</li>
            <li style="width:7%;text-align:center;">已报名数</li>
            <li style="width:7%;text-align:center;">待面试数</li>
            <li style="width:7%;text-align:center;">已淘汰数</li>
            <li style="width:7%;text-align:center;">投递人数</li>
            <li style="width:9%">创建日期</li>
          </ul>
        </div>
        <div v-if="jobLists">
          <ul class="companyItem" v-for="(item,index) in jobLists" :key="index">
            <li style="width:17%;" class="editCompanyInfor">
              <a
                class="user-name"
                style="font-weight:bold;"
                @click="editJobInfor(item)"
              >{{item.jobName}}</a>
            </li>
            <li style="width:17%">{{item.entName}}</li>
            <li style="width:14%;text-align:center;">{{item.funcName}}</li>
            <li style="width:7%;text-align:center;">{{item.edu}}</li>
            <li style="width:8%">{{item.salary}}</li>
            <li style="width:7%;text-align:center;">{{item.num ? (item.num.totalcvnum ? item.num.totalcvnum : 0) : 0}}</li>
            <li style="width:7%;text-align:center;">{{item.num ? (item.num.passcvnum ? item.num.passcvnum : 0) : 0}}</li>
            <li style="width:7%;text-align:center;">{{item.num ? (item.num.refusecvnum ? item.num.refusecvnum : 0) : 0}}</li>
            <li style="width:7%;text-align:center;">
              <span
                @click="checkoutStaff(item)"
                style="color:#337ab7;font-weight:bold;cursor:pointer;"
              >{{item.num ? item.num.cvnum : 0}}</span>
            </li>
            <li style="width:9%">{{item.bDate | formatDate('.')}}</li>
          </ul>
        </div>
        <div v-if="joblistNum > 0">
          <el-pagination
            :page-size="countnum"
            :pager-count="5"
            layout="prev, pager, next"
            :total="joblistNum"
            @current-change="searchJob"
            @prev-click="searchJob"
            @next-click="searchJob"
          ></el-pagination>
        </div>
      </div>
    </div>
    <!--职位信息-->
    <el-dialog :visible.sync="addJobs" width="900px" @close="triggerClose">
      <jobInfoItem :sendjobid="jobid" :sententid="entid" operateApproveal="approve"></jobInfoItem>
    </el-dialog>
    <!--投递人-->
    <el-dialog :visible.sync="showDeliver" width="1000px">
      <DeliveryList :jobId="deliverPubId" :jobName="jobName"></DeliveryList>
    </el-dialog>
  </div>
</template>
<script>
import xz from "../common";
import jobInfoItem from "../components/JobDetail";
//投递人列表
import DeliveryList from "../components/deliveryList";
export default {
  components: {
    jobInfoItem,
    DeliveryList
  },
  data: function() {
    return {
      //搜索条件
      searchJson: {
        jobname: "",
        entname: "",
        edu: "", //没有这个搜索一直固定
        funcname: "",
        salary: "",
        datenum: "",
        keyword: ""
      },
      openSearch: false, //是否打开搜索
      ////
      countnum: 10,
      currpage: 1,
      //显示职位信息
      addJobs: false,
      //显示投递人
      showDeliver: false,
      jobid: "",
      entid: "",
      //职位id
      deliverPubId: "",
      //职位名称
      jobName: "",
      jobLists: [],
      joblistNum: 0,
      loadTalents: false
    };
  },
  mounted() {
    //获取所有职位
    this.getTotalJobs(this.postAction());
  },
  methods: {
    //获取所有职位
    getTotalJobs(data) {
      this.loadTalents = true;
      xz.getTotalJobList(data).then(res => {
        if (res) {
          this.jobLists = res.msg;
          this.joblistNum = parseInt(res.totalnum);
          //获取投递的人数
          let jobidlist = [];
          if (Array.isArray(this.jobLists)) {
            this.jobLists.forEach(j => {
              //jobid 集合
              jobidlist.push(j.jobid);
            });
            xz.jobsEnrolment(jobidlist.join()).then(res => {
              if (res) {
                this.jobLists.forEach((job, index) => {
                  // 暂时将修改放在前端 因为其他调用这个接口的的参数已经完成适配 只修改此处的话不需要改动其他地方
                  // Fix: TNtLike
                  let num = res.find(r => r.jobid == job.jobid);
                  this.$set(this.jobLists[index], "num", num);
                });
              }
              this.loadTalents = false;
            });
          } else {
            this.loadTalents = false;
          }
        } else {
          console.log("获取所有职位列表出错");
        }
      });
    },
    //ajax获取列表
    postAction() {
      return {
        countnum: this.countnum,
        currpage: this.currpage,
        status: 1,
        searchinfor: this.searchJson,
        _this: this
      };
    },
    //翻页//关键词搜索//更多搜索
    searchJob(data) {
      this.currpage = data;
      this.getTotalJobs(this.postAction());
    },
    //职位详情关闭的回调，清数据
    triggerClose() {
      //清空jobinfo数据
      this.$store.commit("initJobinfo");
      //清空企业基本信息数据
      this.$store.commit("initBriefInfo");
      // Fix: TNtLike
      this.entid = "";
      this.jobid = "";
    },
    //获取投递人
    checkoutStaff(item) {
      //当前的职位
      if (!item.num || !item.num.cvnum) return;
      this.jobName = item.jobName;
      this.showDeliver = true;
      //获取pubid
      this.deliverPubId = item.jobid;
    },
    //清空搜索条件
    funClearSearch: function() {
      this.searchJson = {
        jobname: "",
        entname: "",
        edu: "", //没有这个搜索一直固定
        funcname: "",
        salary: "",
        datenum: "",
        keyword: ""
      };
    },
    //查看职位信息
    editJobInfor(item) {
      this.addJobs = true;
      this.entid = item.entId;
      this.jobid = item.jobid;
    }
  }
};
</script>
<style scoped>
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
  padding: 10px 15px;
  display: inline-block;
}
.rightSearch {
  position: absolute;
  right: 0;
  top: 0;
}
</style>