<template>
  <div class="brokerForm" @click="shutdownList">
    <div class="formContainer">
      <div class="bindingShaow" v-show="binding">
        <img src="../../assets/images/loadgif.gif" alt="">
      </div>
      <i class="closeOrganization" @click="closeSelect"></i>
      <div class="editOrganization">
        <div class="draft-job">
          <h5>选择企业</h5>
        </div>
        <div class="newBroker">
          <div class="selectSubordinate" >
            <div class="infor_field">
              <label class="field_name"><span style="color:#f38480 !important;">*</span>搜索企业：</label>
              <div class="chooseCompanyList" @click.stop="">
                <input type="text" placeholder="请输入要搜索的企业" v-model="keyword" class="searchKeyWord" ref="companyInput" />
                <div class="companylists" v-show="showCompanyList">
                  <img class="loadJobsGif" src="../../assets/images/Magnify.gif" alt="" v-show="loadingSearchCompany">
                  <div v-show="!loadingSearchCompany">
                    <ul class="com_list" v-show="companyList.length > 0">
                      <li v-for="(c,index) in companyList" v-bind:key="index" @click="checkCompany(c.entName, c.entId, c.isExist)" :class="{'existEnt': c.isExist}">{{c.entName}}</li>
                    </ul>
                    <p v-show="companyList.length == 0" class="noneWithCompany">未找到相应企业</p>
                  </div>
                </div>
              </div>
            </div>
            <p class="alarmText" ref="companyError" style="position:relative;top:-20px;">请选择已录入企业</p>
          </div>
          <!--已选择企业-->
          <div class="bindCompanyContainer">
            <div class="infor_field">
              <label class="field_name">已绑定企业：</label>
              <div class="bindCompanyList">
                <ul class="showBindList">
                  <li v-for="(l, index) in bindLists" :key="index">{{l.entname}}</li>
                </ul>
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
        // 已选择的企业
        bindLists: [],
        // 搜索企业的加载动画
        loadingSearchCompany: false,
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
        //被选中的pubid
        selectPubid: "",
        //职位加载状态
        loadingJob: false,
        //绑定状态
        binding: false,
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
              this.showCompanyList = true;
              this.searchPromoCompany();
            }
          }, 300)
        }
      },
      "userid": {
        handler: function(){
          if(this.userid){
            this.user_id = this.userid;
            this.bindCompanyList();
          }
        },
        immediate:true
      },
    },
    methods: {
      // 获取绑定的企业
      bindCompanyList(){
        this.binding = true;
        xz.projectCompany({
          countnum: 10,
          currpage: 1,
          objid: this.user_id
        }).then(res => {
          this.binding = false;
          this.bindLists = res ? res.msg : [];
        });
      },
      // 搜索企业
      searchPromoCompany(){
        // 如果是被选中了，初始化选中状态，并return
        if(this.isCheck){
          this.isCheck = false;
          return;
        }
        // 
        this.loadingSearchCompany = true;
        let query = JSON.stringify({
          keyword: this.keyword,
          entname: "",
          nation: ""
        });
        // 获取企业列表
        xz.getAllCompany(10000, 1, query).then( list => {
        this.loadingSearchCompany = false;
          this.showCompanyList = true;
          if(list){
            let company = list.msg;
            if(Array.isArray(company)){
              // this.bindLists;
              company.forEach( c => {
                let isExist = this.bindLists.find( l => l.entid === c.entId);
                if(isExist) c.isExist = true;
              })
              this.companyList = company;
            }else{
              this.companyList = [];
            }
          }else{
            this.companyList = [];
          }
        })
      },
      // 选择企业
      checkCompany(n, id, isExist){
        if(isExist){
          return;
        }
        this.linkid = id;
        this.keyword = n;
        this.showCompanyList = false;
        // 设置选中状态
        this.isCheck = true;
        // 初始化样式
        this.$refs.companyInput.classList.remove("error_alert");
        this.$refs.companyError.style.cssText += "display:none";
      },
      // 绑定企业
      bindCompany(){
        if(this.linkid){
          xz.bindCompany({
            objid: this.user_id,
            entid: this.linkid,
            others: ""
          }).then(res => {
            this.binding = false;
            if(res){
              this.linkid = "";
              this.keyword = "";
              this.bindCompanyList();
            }
          })
        }
      },
      // 点击关闭
      closeSelect() {
        this.$emit("closeSelectCompany");
      },
      // 设置推广企业
      addNewCode(){
        // 如果企业id不存在
        let hasEmpty = false;
        if(!this.linkid){
          this.$refs.companyInput.classList.add("error_alert");
          this.$refs.companyError.style.cssText += "display:block";
          hasEmpty = true;
        }
        if(hasEmpty) return;
        this.binding = true;
        this.bindCompany();
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
  .newBroker .infor_field .field_name{
    width: 120px;
    line-height: 33px;
  }
  .selectSubordinate{
    width: 420px;
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
    display: flex;
    margin-top: 30px;
    justify-content: space-between;
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
    min-height: 100px;
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
  .loadJobsGif{
    display: block;
    width: 60px;
    height: auto;
    margin:20px auto 0 auto;
  }
  .existEnt{
    background: #DCDFE6 !important;
    color: #fff !important;
    cursor: default !important;
  }
</style>