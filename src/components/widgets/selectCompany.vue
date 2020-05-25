<template>
  <div class="brokerForm" @click="shutdownList">
    <div class="formContainer">
      <div class="bindingShaow" v-show="binding">
        <img src="../../assets/images/loadgif.gif" alt="">
      </div>
      <i class="closeOrganization" @click="closeSelect"></i>
      <div class="editOrganization">
        <div class="draft-job">
          <h5>{{permitJob ? "选择职位" : "选择企业"}}</h5>
        </div>
        <div class="newBroker">
          <div class="selectSubordinate" > 
            <div class="infor_field">
              <label class="field_name"><span style="color:#f38480 !important;">*</span>企业名称：</label>
              <div class="chooseCompanyList" @click.stop="">
                <input type="text" placeholder="请输入要搜索的企业" v-model="keyword" class="searchKeyWord" ref="companyInput" />
                <div class="companylists" v-show="showCompanyList">
                  <ul class="com_list" v-show="companyList.length > 0">
                    <li v-for="(c,index) in companyList" v-bind:key="index" @click="checkCompany(c.entName, c.entId)">{{c.entName}}</li>
                  </ul>
                  <p v-show="companyList.length == 0" class="noneWithCompany">未找到相应企业</p>
                </div>
              </div>
            </div>
            <p class="alarmText" ref="companyError" style="position:relative;top:-20px;">请选择已录入企业</p>

            <div class="infor_field" v-show="permitJob" style="align-items:flex-start">
              <label class="field_name"><span style="color:#f38480 !important;">*</span>职位选择：</label>
              <div class="chooseCompanyList companyJobs" ref="jobInput">
                <!--加载效果-->
                <div class="loadJobs" v-show="loadingJob">
                  <img src="../../assets/images/Magnify.gif" alt="" class="loadJobsGif">
                </div>
                <p v-if="!linkid" class="alarmSelect">请选择企业</p>
                <div class="showCompanyJobs" v-else>
                  <ul class="jobs_ul" v-if="jobList.length > 0">
                    <li :class="selectPubid == job.pubid ? 'selectedJob' : ''" v-for="(job, jobIndex) in jobList" v-bind:key="jobIndex" @click="chooseJob(job.pubid)">{{job.jobname}}</li>
                  </ul>
                  <p class="alarmSelect" v-else>此企业暂无职位</p>
                </div>
              </div>
              <p class="alarmText" ref="jobError">请选择要绑定的职位</p>
            </div>
            <div class="infor_field">
              <label class="field_name">备注信息：</label>
              <div class>
                <input type="text" placeholder="请输入备注信息" v-model="note" />
              </div>
            </div>
          </div>
        </div>
        <button type="button" class="addSubordinateBtn" @click="addNewCode">新增</button>
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
      },
      "hasSelectJob": {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        //用户id
        user_id: "",
        companyName: "",
        //企业列表
        companyList: [],
        //职位列表
        jobList: [],
        //显示搜索结果
        showCompanyList: false,
        //搜索关键字
        keyword: "",
        //备注
        note:"",
        timer: null,
        //判断是否被选中
        isCheck: false,
        //企业Id
        linkid: "",
        //开启职位选择
        permitJob: false,
        //被选中的pubid
        selectPubid: "",
        //职位加载状态
        loadingJob: false,
        //绑定状态
        binding: false
      }
    },
    mounted(){
      
    },
    watch: {
      "keyword": {
        handler: function(){ 
          if (this.timer) {
            clearTimeout(this.timer)
          }
          this.timer = setTimeout(() => {
            if(this.keyword){
              this.searchPromoCompany();
            }
          }, 500)
        }
      },
      "userid": {
        handler: function(){
          if(this.userid){
            this.user_id = this.userid;
          }
        },
        immediate:true
      },
      "hasSelectJob": { //是否开启选择职位功能
        handler: function(){
          this.permitJob = this.hasSelectJob ? true : false;
        },
        immediate: true
      }
    },
    methods: {
      //搜索企业
      searchPromoCompany(){
        //如果是被选中了，初始化选中状态，并return
        if(this.isCheck){
          this.isCheck = false;
          return;
        }
        let query = JSON.stringify({
          keyword: this.keyword,
          entname: "",
          nation: ""
        });
        //获取企业列表
        xz.getAllCompany(10000, 1, query).then( list => {
          this.showCompanyList = true;
          if(list){
            let company = list.msg;
            if(Array.isArray(company)){
              this.companyList = company;
            }else{
              this.companyList = [];
            }
          }else{
            this.companyList = [];
          }
        })
      },
      //选择企业
      checkCompany(n, id){
        this.linkid = id;
        this.keyword = n;
        this.showCompanyList = false;
        //设置选中状态
        this.isCheck = true;
        //初始化样式
        this.$refs.companyInput.classList.remove("error_alert");
        this.$refs.companyError.style.cssText += "display:none";
        //如果需要选择职位
        if(this.permitJob){
          this.companyJobs();
        }
      },
      //获取企业下的职位
      companyJobs(){
        this.loadingJob = true;
        xz.joblistInCompany(this.linkid).then( jobs => {
          console.log(jobs);
          this.loadingJob = false;
          if(jobs){
            let joblists = [];
            //筛选上线职位
            jobs.forEach( job => {
              if(job.pstatus == 2){
                joblists.push(job);
              }
            })
            this.jobList = joblists;
          }else{
            this.jobList = [];
          }
        })
      },
      //选择职位
      chooseJob(id){
        this.selectPubid = id;
        this.$refs.jobInput.classList.remove("error_alert");
        this.$refs.jobError.style.cssText += "display:none";
      },
      //点击关闭
      closeSelect() {
        this.$emit("closeSelectCompany");
      },
      //设置推广企业
      addNewCode(){
        //如果企业id不存在
        let hasEmpty = false;
        if(!this.linkid){
          this.$refs.companyInput.classList.add("error_alert");
          this.$refs.companyError.style.cssText += "display:block";
          hasEmpty = true;
        }
        //如果是职位
        if(this.permitJob) {
          if(!this.selectPubid){
            this.$refs.jobInput.classList.add("error_alert");
            this.$refs.jobError.style.cssText += "display:block";
            hasEmpty = true;
          }
        }
        if(hasEmpty) return;
        this.binding = true;
        let data  ={
          linktype: this.permitJob ? "J" : "E",
          userid: this.user_id, //userid
          linkid: this.permitJob ? this.selectPubid : this.linkid, //pubid / entid
          otherinf: this.note,
          codeid: "",
          idxpath: this.permitJob ? "pages/jobDetail/jobDetail" : "pages/companyDetail/companyDetail"
        }
        xz.createPromo(data).then( res => {
          this.binding = false;
          if(res){
            this.$message({
              message: '绑定成功!',
              type: 'success'
            });
            this.$emit("closeSelectCompany");
          }else{
            this.$message.error('绑定失败，请稍后再试');
          }
        });
      },
      //点击外部关闭结果列表
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
  .formContainer {
    position: relative;
    width: 1000px;
    box-sizing: border-box;
    padding: 50px 20px 30px 20px;
    background: #fff;
    margin: 5vh auto 0 auto;
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
    width: 710px;
    margin: 0 auto;
  }
  .newBroker{
    width: 100%;
    margin-top: 30px;
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
  .chooseCompanyList{
    width: 300px;
    position: relative;
    z-index: 99;
  }
  .searchKeyWord{
    width: 100%;
    border: 1px solid #ddd;
    border-radius: 5px;
    outline: none;
    height: 45px;
    box-sizing: border-box;
    color: #424a5e;
    padding: 0 10px;
    font-size: 13px;
  }
  .companylists{
    width: 100%;
    position: absolute;
    left:0;
    top: 45px;
    border: 1px solid #ddd;
    box-sizing: border-box;
    background: #fff;
    max-height: 250px;
    padding: 0 0 10px 0;
    overflow-y: auto;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
  }
  .com_list li,.jobs_ul li{
    padding: 12px;
    color: #333;
    font-size: 14px;
    cursor: pointer;
    width: 100%;
    box-sizing: border-box;
  }
  .com_list li:hover,.jobs_ul li:hover{
    background: #f2f2f2;
  }
  .noneWithCompany{
    font-size: 14px;
    color: #333;
    padding: 20px 0 10px 0;
    box-sizing: border-box;
    padding-left: 10px;
    width: 100%;
  }
  .companyJobs{
    width: 300px;
    border-radius: 5px;
    border:1px solid #ddd;
    box-sizing: border-box;
    max-height: 300px;
    min-height: 100px;
    overflow-y: auto;
    z-index: 1 !important;
    position: relative;
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
  .alarmSelect{
    width: 100%;
    font-size: 14px;
    color: #333;
    box-sizing: border-box;
    padding-left: 10px;
    margin-top: 10px;
  }
  .selectedJob{
    background: #5f4b8b !important;
    color: #fff !important;
  }
  .alarmText{
    margin-left: 150px;
    font-size: 14px;
    color: #c82a2e;
    margin-top:5px;
    display: none;
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
</style>