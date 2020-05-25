<template>
  <div class="workPoolItem">
    <div>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="面试管理" name="manage"></el-tab-pane>
        <!-- <el-tab-pane label="面试历史" name="history"></el-tab-pane> -->
      </el-tabs>
      <div>
        <transition name="loadShadow">
          <div class="loadShadow" v-show="loadList">
            <i class="loadgif"></i>
          </div>
        </transition>
        <div>
          <table class="formLoop">
            <thead>
              <tr>
                <th style="width: 8%">姓名</th>
                <th style="width: 6%">性别</th>
                <th style="width: 14%">申请职位</th>
                <th style="width: 16%">企业名称</th>
                <th style="width: 10%">最高学历</th>
                <th style="width: 8%">工作年限</th>
                <th style="width: 10%">所在地</th>
                <!-- <th style="width: 10%">申请时间</th> -->
                <th style="width: 16%" v-if="activeName=='manage'">面试管理</th>
                <th style="width: 16%" v-else>面试状态</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item,index) in interviewList" :key="index">
                <td>{{item.cvinf.psnBaseInfo.psnName}}</td>
                <td>{{item.cvinf.psnBaseInfo.psnSex}}</td>
                <td>{{item.jobname}}</td>
                <td>{{item.entname}}</td>
                <td>{{item.cvinf.psnBaseInfo.psnEduLvl}}</td>
                <td>{{item.cvinf.psnBaseInfo.psnWorkExp}}</td>
                <td>{{item.addressName}}</td>
                <!-- <td>
                  <span v-if="item.time">{{item.time | formatDate('.')}}</span>
                  <span v-else>未知</span>
                </td> -->
                <td v-if="activeName=='manage'">
                  <button type="button" class="agreeInterview" @click="manipulateInterview(item, 1)">允许面试</button>
                  <button type="button" class="refuseInterview" @click="manipulateInterview(item ,2)">拒绝面试</button>
                </td>
                <td v-else>
                  <span v-if="item.status=='1'">待面试</span>
                  <span v-if="item.status=='3'">已通过</span>
                  <span v-if="item.status=='2'">已拒绝</span>
                </td>
              </tr>
            </tbody>
          </table>
          <div v-if="totalNum > 0">
            <el-pagination
              :current-page="currnum"
              :page-size="num"
              :pager-count="5"
              layout="prev, pager, next"
              :total="totalNum"
              @current-change="changePage"
              @prev-click="changePage"
              @next-click="changePage"
            ></el-pagination>
          </div>
        </div>

        <!--职位详情dialog-->
        <el-dialog :visible.sync="showJobDetail" width="900px" @close="triggerClose">
          <jobInfoItem
            :sendjobid="jobId"
            :funDetail="jobFunDetail"
            :sententid="sententid"
            operateApproveal="approve"
          ></jobInfoItem>
        </el-dialog>
      </div>
    </div>
  </div>
</template>
<script>
import xz from "../common";
import jobInfoItem from "../components/JobDetail";
export default {
  components: {
    jobInfoItem
  },
  data: function() {
    return {
      showPsnDetail: false,
      showJobDetail: false,
      jobid: "",
      //分页信息
      num: 10,
      currnum: 1,
      totalNum: 0,
      interviewList: [],
      sententid: "",
      talentInfo: null,
      loadList: false,
      activeName: "manage"
    };
  },
  created() {
    //获取所有人才
    this.getInterviewList();
  },
  computed: {
    jobFunDetail() {
      return this.$store.state.TALENTS.jobDetail;
    }
  },
  watch: {
    activeName: function() {
      this.currnum = 1;
      this.interviewList = [];
    }
  },
  methods: {
    //切换事件
    handleClick(e) {
      this.activeName = e.name;
      if (this.activeName == "history") {
        this.getInterviewList(1, 9);
      } else {
        this.getInterviewList();
      }
    },
    //获取所有面试列表
    getInterviewList(page = 1, status = 0) {
      this.loadList = true;
      xz.jobProgressEnrolment("", status, page).then(res => {
        console.log(res);
        this.loadList = false;
        if (res) {
          this.totalNum = res.totalnum ? parseInt(res.totalnum) : 0;
          let list = res.psnList;
          if(Array.isArray(list)){
            list.forEach(l => {
              let cv = JSON.parse(l.cvinf);
              l.cvinf = cv;
              let addressObj = this.$store.getters.codeToggleObj(
                cv.psnBaseInfo.psnNation
              );
              let addressName = this.$store.getters.localName(addressObj);
              if (addressName) {
                let addressNameArr = addressName.split("-");
                addressNameArr.length > 1
                  ? (l.addressName = l.addressName = `${addressNameArr[1]}-${addressNameArr[2]}`)
                  : (l.addressName = addressNameArr[0]);
              } else {
                l.addressName = "未填写";
              }
            });
            this.interviewList = list;
          }else{
            this.interviewList = [];
          }
          
        } else {
          this.getInterviewList = [];
          console.log("获取面试列表出错");
        }
      });
    },
    //操作面试允许/拒绝
      manipulateInterview(i, type){
        this.loadList = true;
        xz.manipulateInterview(i.CVID, i.pubid, type).then( res => {
          if(res){
            //重新获取当前面试管理
            this.getInterviewList(this.currnum);
          }else{
            this.loadList = false;
            console.log("操作面试允许/拒绝失败");
          }
        });
      },
    //分页方法
    changePage(data) {
      this.currnum = data;
      if (this.activeName == "history") {
        this.getInterviewList(data, 9);
        return;
      }
      this.getInterviewList(data);
    },
    //职位详情关闭的回调，清数据
    triggerClose() {
      //清空jobinfo数据
      this.$store.commit("initJobinfo");
      //清空企业基本信息数据
      this.$store.commit("initBriefInfo");
    },

    //点击查看个人详情
    funShowPsnDetail(e) {
      //获取个人简历信息
      this.talentInfo = {
        orderid: e.userid_p
      };
      this.showPsnDetail = true;
    },

    //点击查看职位信息
    funShowJobDetail(e) {
      this.showJobDetail = !this.showJobDetail;
      this.jobId = e.jobid;
      this.sententid = e.entId;
    }
  }
};
</script>