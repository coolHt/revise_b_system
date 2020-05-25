<template>
  <div class="workPoolItem" style="position:relative;">
      <div class="companyList">
        <transition name="loadShadow">
          <div class="loadShadow" v-show="loadTalents">
            <i class="loadgif"></i>
          </div>
        </transition>
        <div class="companyHeadLine">
          <ul class="companyItem">
            <li style="width:23%">职位名</li>
            <li style="width:12%">职能名</li>
            <li style="width:14%;text-align:center;">公司名</li>
            <li style="width:14%;text-align:center;">开始时间</li>
            <li style="width:10%;text-align:center;">招聘人数</li>
            <li style="width:15%;text-align:center;">职位发布人/企业</li>
            <li style="width:12%">操作</li>
          </ul>
        </div>
        <div>
          <ul class="companyItem" v-for="(item,index) in projectList" :key="index">
              <li style="width:23%;font-weight:bold;" class="editCompanyInfor" >
                <a class="user-name" @click="funShowJobDetail(item.jobid,item.entid,item.EntName)"
                  style="font-weight:bold;">{{item.JobName}}</a>
              </li>
              <li style="width:12%">{{item.FuncName}}</li>
              <li style="width:14%;text-align:center;">{{item.EntName}}</li>
              <li style="width:14%;text-align:center;">{{item.InitDate | formatDate}}</li>
              <li style="width:10%;text-align:center;">{{item.JobNum === 0 ? "若干" : item.JobNum}}</li>
              <li style="width:15%;text-align:center;">{{item.UserName ? item.UserName : item.EntName}}</li>
              <li style="width:12%">
                <span class="resolveBtn" @click="funPass(item.jobid,index)">
                  <a>通过</a>
                </span>
                <span class="rejectBtn" @click="beforeClose(item.jobid,index)">
                  <a>拒绝</a>
                </span>
              </li>
            </ul>
        </div>
        <!--分页-->
        <div v-if="projectListNum > 0">
          <el-pagination :page-size="countnum" :pager-count="5" layout="prev, pager, next" :current-page="currentPage"
            :total="projectListNum" @current-change="togglePage" @prev-click="togglePage" @next-click="togglePage">
          </el-pagination>
        </div>
      </div>
    <!--显示职位信息-->
    <el-dialog :visible.sync="jobDetail" width="1100px" class="jobDetailBox">
      <jobInfoItem :companyName="companyName" :funDetail="jobFunDetail" :sendjobid="sendjobid" :sententid="sententid"
        :sendpower="sendpower" @invokePass="funPass" @invokeClose="beforeClose" :currentIndex="currentWatch">
      </jobInfoItem>
    </el-dialog>

    <!--拒绝此项目dialog-->
    <el-dialog title="备注" :visible.sync="closeDialogVisible" width="30%">
      <el-form>
        <el-form-item label="拒绝理由：">
          <el-input type="textarea" :autosize="{ minRows: 4}" v-model="closeMsg.content"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialogVisible = false" class="btn-def">取消</el-button>
        <el-button @click="funClose" class="btn-sub">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import xz from "../common";
  import jobInfoItem from "./JobDetail";
  export default {
    components: {
      jobInfoItem,
    },
    props:{
      listType: {
        type: String,
        default: "",
      },
    },
    data: function () {
      return {
        //分页
        countnum: 10,
        currentPage: 1,
        projectListNum:0,//总数
        jobDetail: false,
        entid: "",
        //遮罩层
        loadTalents: false,
        sendjobid: "",
        sententid: "",
        sendpower: true,
        closeDialogVisible: false,
        jobIndex: "",
        //拒绝项目理由
        closeMsg: {
          jobid: "",
          content: ""
        },
        entJobReviewInfo: [],
        entJobInfo: [],
        jobFunDetail: {},
        companyName: '',
        currentWatch: 0,
        //待审核项目
        projectList: []
      };
    },
    watch: {
      "listType": {
        handler: function(){
          if(this.listType){
            this.getVerityJob(this.listType);
          }
        },
        immediate:true
      }
    },

    methods: {
      togglePage(page) { //翻页
        this.currentPage = page;
        this.getVerityJob(this.listType);
      },
      //拿取职位简历
      funShowJobDetail(jobId, entId, companyName) {
        if (!jobId) {
          this.jobDetail = false;
          return;
        }

        let _this = this;
        this.entJobReviewInfo.forEach(function (v, index) {
          if (v.jobid == jobId) {
            _this.currentWatch = index;
          }
        })

        this.sendjobid = jobId;
        this.sententid = entId;
        if (!this.jobDetail) {
          this.jobDetail = !this.jobDetail;
        }
        //获取职位信息
        xz.getJobInfor(jobId).then((res) =>{
          if(res){
            _this.jobFunDetail = res;
            _this.companyName = companyName;
          }else{
            console.log("获取职位信息失败");
          }
        })
      },
      /**
       * 通过
       */
      funPass(id) {
        this.loadTalents = true;
        let promiseVerity = this.listType === "ent" ? xz.passEntJob(id) : xz.identifyJobPublish(id);

        promiseVerity.then( res => {
          if(res){
            this.getVerityJob(this.listType);
            this.$message({
              message: '职位发布成功',
              type: 'success'
            });
          }else{
            console.log("通过失败");
          }
        })
      },
      /**
       * 拒绝项目
       */
      beforeClose(e, i) {
        this.closeDialogVisible = true;
        this.closeMsg.jobid = e;
        this.closeMsg.content = "";
        this.jobIndex = i;
      },
      funClose() {
        this.closeDialogVisible = false;
        this.loadTalents = true;
        let promiseVerity = this.listType === "ent" ? xz.refuseEntJob(this.closeMsg.jobid) : xz.refuseJobPublish(this.closeMsg);

        promiseVerity.then( res => {
          res ? this.getVerityJob(this.listType) : console.log("拒绝失败");
        })
      },
      //获取审核项目
      getVerityJob(type){
        let promiseVerity = type === "ent" ? xz.entValidateJob(this.countnum, this.currentPage) : xz.verityJob(this.countnum, this.currentPage);
        this.loadTalents = true;
        //获取审核项目
        promiseVerity.then( res => {
          if(res){
            this.projectList =  Array.isArray(res.chkjoblist) ? res.chkjoblist :[];
            this.projectListNum =  parseInt(res.totalnum);
          }
          this.loadTalents = false;
        })
      }
    }
  };
</script>