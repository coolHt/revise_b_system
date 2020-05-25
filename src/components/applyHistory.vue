<template>
  <div>
    <div>
      <div class="searchHistory">
        <input
              type="text"
              class="blurSearch"
              placeholder="请输入关键词查询"
              v-model="searchKeyword"
              style="border-top-right-radius:0;border-bottom-right-radius:0"
            />
            <button class="keyfieldButton" @click="searchHistoryBtn">搜索</button>
      </div>
      <table class="formLoop">
        <thead>
          <tr>
            <th style="width: 10%">姓名</th>
            <th style="width: 8%">联系方式</th>
            <th style="width: 5%">年龄</th>
            <th style="width: 8%">学历</th>
            <th style="width: 8%">工作年限</th>
            <th style="width: 6%">期望年薪</th>
            <th style="width: 8%">期望职能</th>
            <th style="width: 10%">申请职位</th>
            <th style="width: 10%">职位企业</th>
            <th style="width: 8%">申请状态</th>
            <th style="width: 10%">通过时间</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item,index) in historyTalent" :key="index">
            <td>
              <span style="font-weight:bold;cursor:pointer;color:#5b9bd1" class="user-name" @click="checkResume(item)">{{item.psnName}}</span>
            </td>
            <td>
              <el-popover placement="top" width="200" trigger="click">
                <div style="font-weight:bold;font-size: 18px;color:#333;">{{item.tel}}</div>
                <el-button slot="reference">查看号码</el-button>
              </el-popover>
            </td>
            <td>
              <span style="font-weight:bold">{{item.age}}</span>
            </td>
            <td style="font-weight:bold">{{item.edu}}</td>
            <td style="font-weight:bold">{{item.exp}}</td>
            <td style="font-weight:bold">{{item.intentSalary ? item.intentSalary + "万" : "未填写"}}</td>
            <td style="font-weight:bold">{{item.intentJobFun ? item.intentJobFun : "未填写"}}</td>
            <td>
              <a class="user-name" @click="funShowJobDetail(item)">{{item.entJobName}}</a>
            </td>
            <td>{{item.entName}}</td>
            
            <td>{{(item.strstatus == 2 || item.strstatus == "") ? '已通过':'已拒绝'}}</td>
            <td>
              <span v-if="item.changDate">{{ item.changDate | formatDate('.')}}</span>
              <span v-else >未知</span>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="historyNum > 0">
        <el-pagination :current-page="currnum" :page-size="num" :pager-count="5" layout="prev, pager, next"
          :total="historyNum" @current-change="changePage" @prev-click="changePage" @next-click="changePage">
        </el-pagination>
      </div>
    </div>
    <!--总简历-->
    <TotalResume ref="totalResume" @closeResume="closeResume" class="stretchNone" :resume="talentInfo"></TotalResume>
    <!--职位详情dialog-->
    <el-dialog :visible.sync="showJobDetail" width="900px" @close="triggerClose">
      <jobInfoItem :sendjobid="jobId" :funDetail="jobFunDetail" :sententid="sententid" operateApproveal="approve">
      </jobInfoItem>
    </el-dialog>
  </div>
</template>
<script>
  import xz from "../common";
  import jobInfoItem from "./JobDetail";
  import TotalResume from "./resume/totalResume";
  export default {
    components: {
      jobInfoItem,
      TotalResume
    },
    data: function () {
      return {
        searchInfo: {
          username: "",
          usertel: "",
          school: "",
          jobinf: "",
          company: "",
          status: 0,
          keyword: "",
          constatus: "",
          nation: "",
          strstatus: '' //表示已通过的
        },
        showJobDetail: false,
        jobid: '',
        //分页信息
        num: 10,
        currnum: 1,
        totalNum: 0,
        historyNum: 0,
        historyTalent: [],
        bdate: '',
        edate: '',
        sententid: '',
        talentInfo: null,
        //搜索关键字
        searchKeyword: ""
      };
    },
    created() {
      let year = new Date().getFullYear();
      let month = new Date().getMonth() + 1 < 10 ? '0' + (new Date().getMonth() + 1) : new Date().getMonth() + 1;
      let date = new Date().getDate() + 1 < 10 ? '0' + new Date().getDate() : new Date().getDate();
      this.bdate = "2019-01-01";
      this.edate = year + '-' + month + '-' + date;
      //获取所有人才
      this.getDeliveryHistory(
        this.returnSearchField()
      )
    },
    computed: {
      jobFunDetail() {
        return this.$store.state.TALENTS.jobDetail;
      }
    },
    methods: {
      //
      searchHistoryBtn(){
        this.getDeliveryHistory(
          this.returnSearchField()
        )
      },
      //获取申请历史
      getDeliveryHistory(data){
        xz.deliveryTalents(data).then( res => {
          if(res){
            const list = res.myOrderList;
            const num = res.totalCount;
            this.historyTalent = list;
            if(Array.isArray(list)){
              list.forEach((t, index) => {
                xz.userInfo(t.userid_p).then( res => {
                  if(res){
                    let cv = res.cvinfo;
                    if(cv.psnPersonInfo){
                      let birth = cv.psnPersonInfo.psnBirth;
                      if(birth){
                        let age = new Date().getFullYear() - new Date(birth).getFullYear();
                        this.$set(this.historyTalent[index], "age", age)
                      }else{
                        this.$set(this.historyTalent[index], "age", "未填写");
                      }
                    }else{
                      this.$set(this.historyTalent[index], "age", "未填写");
                    }
                    this.$set(this.historyTalent[index], "edu", res.cvinfo.psnBaseInfo.psnEduLvl);
                    this.$set(this.historyTalent[index], "exp", res.cvinfo.psnBaseInfo.psnWorkExp);
                  }
                })
              })
            }
            this.historyNum = parseInt(num);
            this.shadowShow = false;
          }else{
            console.log("获取申请管理/申请历史的人才出错");
          }
        })
      },
      //分页方法
      changePage(data) {
        this.currnum = data;
        this.getDeliveryHistory(
          this.returnSearchField(data)
        )
      },
      //返回出当前的筛选条件
      returnSearchField(page) {
        let msg = {
          "bdate": this.bdate,
          "edate": this.edate ? new Date(this.edate).getFullYear() + '-' + (new Date(this.edate).getMonth() + 1) +
            '-' + new Date(this.edate).getDate() : this.initEnd,
          "countnum": this.num,
          "currpage": page ? page : this.currnum,
          "username": this.searchKeyword, //姓名
          "school": this.searchInfo.school, //学习
          "jobinf": this.searchInfo.jobinf, //职位
          "company": this.searchInfo.company, //公司
          "usertel": this.searchInfo.usertel, //手机
          "status": this.searchInfo.status, //简历状态
          "constatus": this.searchInfo.constatus, //联系记录
          "keyword": "", //关键字查询
          "nation": "",
          "strstatus": '', //状态
        }
        return msg;
      },
      //职位详情关闭的回调，清数据
      triggerClose() {
        //清空jobinfo数据
        this.$store.commit("initJobinfo");
        //清空企业基本信息数据
        this.$store.commit("initBriefInfo");
      },
      //点击查看职位信息
      funShowJobDetail(e) {
        this.showJobDetail = !this.showJobDetail;
        this.jobId = e.jobid;
        this.sententid = e.entId;
      },
      //获取简历
      checkResume(item){
        if(!item.orderid) item.orderid = item.userid_p;
        this.talentInfo = item;
        let resume = this.$refs.totalResume.$el;
        resume.classList.remove("stretchNone");
      },
      //关闭右侧简历
      closeResume(){
        this.talentInfo = "";
        let resume = this.$refs.totalResume.$el;
        resume.classList.value.indexOf("stretchNone") > -1 ? resume.classList.remove("stretchNone") : resume.classList.add("stretchNone");
      },
    }
  };
</script>
<style scoped>
.formLoop{
  margin-top:20px;
}
</style>