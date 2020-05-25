<template>
  <div class="brokerForm" @click="shutdownList">
    <div class="formContainer">
      <div class="bindingShaow" v-show="binding">
        <img src="../../assets/images/loadgif.gif" alt="">
      </div>
      <i class="closeOrganization" @click="closeSelect"></i>
      <div class="editOrganization">
        <div class="draft-job">
          <h5>选择职位</h5>
        </div>
        <div class="newBroker">
          <div class="selectSubordinateContainer">
            <!--下拉框-->
            <div class="choiceSubordinate">
              <span>选择已绑定企业: </span>
              <el-select v-model="selectEntId" placeholder="请选择" @change="searchCompanyJobs">
                <el-option
                  v-for="item in companyList"
                  :key="item.entid"
                  :label="item.entname"
                  :value="item.entid">
                </el-option>
              </el-select>
            </div>
            <!--筛选-->
            <div class="filterContainer">
              <div class="filter-item">
                <span>关键词:</span>
                <input type="text" v-model="keyword">
              </div>
              <div class="filter-item">
                <span>企业名称:</span>
                <input type="text" v-model="companyName">
              </div>
              <div class="filter-item">
                <span>职位名称:</span>
                <input type="text" v-model="jobName">
              </div>
              <div class="filter-item">
                <span>职能:</span>
                <input type="text" v-model="roleName">
              </div>
              <div class="filterBtnContainer">
                <button type="button" class="searchBtn" @click="searchCompanyJobs">搜索职位</button>
                <button type="button" class="searchBtn clearBtn" @click="clearCondition">清空</button>
              </div>
            </div>
            <div class="selectSubordinate"> 
              <!--职位列表-->
              <div class="projectJobList">
                <transition name="loadShadow">
                  <div class="loadShadow" v-show="loadJobs">
                    <i class="loadgif"></i>
                  </div>
                </transition>
                
                <div class="projectJobContainer">
                  <div class="allCheckBtn">
                    <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange"></el-checkbox>
                  </div>
                  <el-checkbox-group v-model="checkJobList" @change="showCheckList">
                  <table class="projectJobTable">
                    <thead>
                      <tr>
                        <th style="width: 25%" class="projectJobName projectHeader">
                          职位名称
                        </th>
                        <th style="width: 20%">公司名称</th>
                        <th style="width: 20%">职能</th>
                        <th style="width: 10%">学历</th>
                        <th style="width: 10%">年薪</th>
                        <th style="width: 15%">创建日期</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(job, index) in totalList" :key="index">
                        <td class="projectJobName">
                          <el-checkbox :label="job.jobid" :disabled="job.isExist"></el-checkbox>
                          {{job.jobName}}
                        </td>
                        <td>{{job.entName}}</td>
                        <td>{{job.funcName}}</td>
                        <td>{{job.edu}}</td>
                        <td>{{job.salary}}</td>
                        <td>{{job.bDate | formatDate}}</td>
                      </tr>
                    </tbody>
                  </table>
                  </el-checkbox-group>
                </div>
                <el-pagination
                  :page-size="countnum"
                  :pager-count="6"
                  layout="prev, pager, next"
                  :total="totalJobNum"
                  @current-change	="togglePage"
                >
                </el-pagination>
              </div>
              <button type="button" class="addSubordinateBtn" @click="addNewCode">新增</button>
            </div>
          </div>
          
          <!--已选择企业-->
          <div class="bindCompanyContainer">
            <div class="infor_field">
              <label class="field_name">已绑定职位：</label>
              <div class="bindCompanyList">
                <ul class="showBindList">
                  <li v-for="(j, index) in bindJobsList" :key="index">{{j.jobname}}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import xz from "../../common";
  export default {
    props: {
      "userid": {
        type: String,
        default: ""
      }
    },
    data() {
      return {
        // 全部职位中选择的职位
        checkJobList: [],
        checkAll: false,
        isIndeterminate: true,
        // 用户id
        user_id: "",
        // 企业列表
        companyList: [],
        // 全部职位
        totalList: [],
        // 职位列表
        jobList: [],
        // 已选择的职位列表
        bindJobsList: [],
        // 搜索关键字
        keyword: "",
        // 搜索企业名称
        companyName: "",
        // 搜索职位名称
        jobName: "",
        // 搜索职能
        roleName: "",
        // 备注
        note:"",
        // 职位加载状态
        loadingJob: false,
        // 绑定状态
        binding: false,
        // 全选
        allCheck: false,
        // 单页职位数量
        countnum: 20,
        totalJobNum: 0,
        // 当前职位页码
        currpage: 1,
        // 选择的企业的id
        selectEntId: "",
        loadJobs: true
      }
    },
    mounted(){
    },
    watch: {
      "userid": {
        handler: function(){
          if(this.userid){
            this.user_id = this.userid;
            this.bindCompanyList();
            this.bindJobList();
          }
        },
        immediate:true
      },
    },
    methods: {
      // 更改全选状态
      showCheckList(value){
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.countnum;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.countnum;
      },
      // 职位全选
      handleCheckAllChange(val){
        // 获取所有获取到的职位
        let jobidArr = [];
        if(val){
          this.totalList.forEach( j => {
            // 如果不存在
            if(!j.isExist){
              jobidArr.push(j.jobid);
            }
          })
        }
        this.checkJobList = val ? jobidArr : [];
        this.isIndeterminate = false;
      },
      // 获取全部职位列表
      totalJobs(){
        this.loadJobs = true;
        this.checkJobList = [];
        this.checkAll = false;
        let filters = {
          countnum: this.countnum,
          currpage: this.currpage,
          status: 1,
          searchinfor: {
            entid: this.selectEntId,
            jobname: this.jobName,
            entname: this.companyName,
            edu: "", //没有这个搜索一直固定
            funcname: this.roleName,
            salary: "",
            datenum: "",
            keyword: this.keyword
          }
        };
        xz.getTotalJobList(filters).then( list => {
          this.loadJobs = false;
          if(list){
            let joblists =[];
            if(Array.isArray(list.msg)){
              let lists = list.msg;
              lists.forEach( job => {
                let isExist = this.bindJobsList.find( c => c.jobid === job.jobid);
                if(isExist) job.isExist = true;
                joblists.push(job);
              })
              // 判断是否已经存在
              let jobList = Array.isArray(list.msg) ? list.msg : [];
              jobList.forEach( j => {
                let isExist = this.bindJobsList.find( job => job.jobid === j.jobid);
                j.isExist = isExist ? true : false;
              })
              this.totalList = jobList;
              console.log(jobList);
            }
            this.totalJobNum = list.totalnum;
          }else{
            this.totalList = [];
          }
        })
      },
      // 初始化所有筛选
      clearCondition(){
        this.selectEntId = "";
        this.jobName = "";
        this.companyName = "";
        this.roleName = "";
        this.keyword = "";
      },
      // 选择绑定的企业
      searchCompanyJobs(){
        this.currpage = 1;
        this.totalJobs();
      },
      // 翻页
      togglePage(t){
        this.currpage = t;
        this.totalJobs();
      },
      // 获取已绑定的职位
      bindJobList(){
        this.binding = true;
        xz.projectJobs({
          objid: this.user_id,
          countnum: 10,
          currpage: 1,
        }).then(jobsData => {
          // 获取所有职位
          this.totalJobs();
          this.binding = false;
          this.bindJobsList = jobsData ? jobsData.msg : [];
        });
      },
      //
      // 获取绑定的企业
      bindCompanyList(){
        xz.projectCompany({
          objid: this.user_id,
          countnum: 10,
          currpage: 1,
        }).then(res => {
          this.companyList = res ? res.msg : [];
        });
      },
      
      // 选择所有职位中的职位
      selectedJobFromAll(j, i){
        if(!j.isExist){
          this.$set(this.totalList[i], "selected", this.totalList[i].selected ? false : true);
          this.isExistInSelected(j);
        }
      },
      // 选择职位
      chooseJob(id,i, isExist){
        if(isExist) return;
        this.$set(this.jobList[i], "selected", this.jobList[i].selected ? false : true);
      },
      // 绑定职位
      bindJobs(jobidList){
        xz.bindJobs({
          objid: this.user_id,
          jobid: jobidList,
          others: ""
        }).then(res => {
          this.binding = false;
          if(res){
            this.bindJobList();
            this.jobList = [];
          }
        });
      },
      // 不选择企业直接绑定职位
      bindJobsWithoutCompany(jobidList){
        xz.jobBindProject({
          objid: this.user_id,
          jobid: jobidList,
          others: ""
        }).then(res => {
          this.binding = false;
          if(res){
            this.bindJobList();
          }
        });
      },
      // 点击关闭
      closeSelect() {
        this.$emit("closeSelectCompany");
      },
      // 设置推广企业
      addNewCode(){
        if(this.checkJobList.length >0){
          this.binding = true;
          this.bindJobsWithoutCompany(this.checkJobList.join());
        }
      },
      // 点击外部关闭结果列表
      shutdownList(){
        if(this.showCompanyList){
          this.companyList = [];
          this.showCompanyList = false;
        }
      }
    }
  }
</script>
<style scoped>
  .projectJobTable th,
  .projectJobTable td{
    text-align: center;
    font-size: 14px;
    padding: 6px 0;
  }
  .projectJobTable th{
    font-weight: bold;
    background: #f4f4f4;
  }
  .projectJobTable tr{
    border-bottom: 1px solid #F2F5F8;
  }
  .projectJobTable .projectJobName{
    text-align: left;
    box-sizing: border-box;
    padding-left: 10px;
  }
  
  .filterContainer{
    width: 100%;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    margin-top: 15px;
  }
  .filterBtnContainer{
    display: flex;
    width: 100%;
    margin-top: 10px;
  }
  .searchBtn{
    padding: 8px 20px;
    outline: none;
    border-radius: 5px;
    font-size: 14px;
    margin-right: 15px;
    background: #409eff;
    border: 1px solid #409eff;
    color: #fff;
    margin-left:20px;
  }
  .filterBtnContainer .searchBtn{
    width: auto;
  }
  .clearBtn{
    border: 1px solid #333;
    color: #333;
    background: #fff !important;
  }
  .filter-item{
    display: flex;
    align-items: center;
    margin-right: 15px;
  }
  .filter-item span{
    margin-right: 10px;
    color: #333;
    font-size: 14px;
  }
  .filter-item input{
    border: 1px solid #ddd;
    border-radius: 3px;
    height: 40px;
    width: 130px;
    line-height: 40px;
    color: #333;
    font-size: 14px;
    box-sizing: border-box;
    padding: 0 8px;
    outline: none;
  }
  .choiceSubordinate{
    display: flex;
    align-items: center;
  }
  .choiceSubordinate span{
    margin-right: 10px;
    font-size: 14px;
    font-weight: bold;
  }
  .projectJobTable{
    margin-top: 20px;
  }
  
  .projectJobList{
    position: relative;
  }
  .projectJobList,
  .projectJobTable{
    width: 100%;
  }

  .newBroker .infor_field .field_name{
    width: 120px;
    line-height: 33px;
  }
  .selectSubordinateContainer{
    width: 100%;
  }
  .selectSubordinate{
    width: 100%;
  }
  .bindCompanyContainer{
    width: 420px;
  }
  .bindCompanyContainer .infor_field{
    align-items: flex-start;
  }
  .showBindList li{
    font-size: 14px;
    padding: 5px;
    color: #333;
    width: 100%;
    box-sizing: border-box;
  }
  .bindCompanyList{
    width: 300px;
    border-radius: 5px;
    height: 320px;
    padding: 10px 0;
    overflow-y: auto;
    border:1px solid #ddd;
    box-sizing: border-box;
  }
  .formContainer {
    position: relative;
    width: 1000px;
    box-sizing: border-box;
    padding: 50px 20px 30px 20px;
    background: #fff;
    margin: 5vh auto 0 auto;
    height: 90vh !important;
    overflow-y: auto;
  }
  .brokerForm {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.4);
    z-index: 999;
  }
  .editOrganization{
    width: 850px;
    margin: 0 auto;
  }
  .newBroker{
    width: 100%;
  }
  .addSubordinateBtn{
    display: block;
    margin: 20px auto 0 auto;
    border:none;
    outline: none;
    color: #fff;
    background:#409eff;
    border-radius: 5px;
    padding: 8px 25px;
    font-size: 14px;
  }

  .loadJobs{
    position: absolute;
    top:0;
    right:0;
    bottom:0;
    left:0;
    background: #fff;
    display: flex;
    align-items: center;
  }
  .loadJobs .loadJobsGif{
    display: block;
    width: 60px;
    height: auto;
    margin:0 auto;
  }

  .selectedJob{
    background: #5f4b8b !important;
    color: #fff !important;
  }

  .bindingShaow{
    position: absolute;
    left:0;
    top:0;
    right:0;
    bottom: 0;
    display: flex;
    align-items: center;
    background: rgba(255,255,255, 0.6);
    z-index: 999
  }
  .bindingShaow img{
    display: block;
    width: 45px;
    height: auto;
    margin:0 auto;
  }
  .existEnt{
    background: #DCDFE6 !important;
    color: #fff !important;
    cursor: default !important;
  }
  .projectJobContainer{
    position: relative;
  }
  .projectHeader{
    padding-left: 40px !important;
  }
  .allCheckBtn{
    position: absolute;
    left: 10px;
    top: 8px;
  }
</style>
<style>
.projectJobTable .el-checkbox__label{
    display: none !important;
  }
  .projectJobName .el-checkbox{
    margin-right: 10px;
  }
</style>