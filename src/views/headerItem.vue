<template>
  <div class="headerItem">
    <header class="header-nav">
      <div style="display:flex;align-items:center;">
        <div class="header-logo">
          <a href="javascript:;" class="">
            <img src="../assets/images/logo.jpg" alt>
          </a>
        </div>
        <div class="headerList" @click="showNav = !showNav">
          <i class="fa fa-list" aria-hidden="true"></i>
        </div>
      </div>
      <div class="header-user">
        <span class="header-user-name">{{userName}}</span>
        <div class="header-avatar">
          <ul class="user-setting" >
              <li>
                <a href="#">设置</a>
              </li>
              <li>
                <a href="#">退出</a>
              </li>
            </ul>
        </div>
        <span class="header-logout" @click="logout">
          <i class="fa fa-sign-out" aria-hidden="true"></i>
        </span>
      </div>
    </header>
    <div class="pivotal-content">
      <div class="content-nav" v-show="showNav">
          <ul class="">
            <!-- 菜单元素 -->
            <li :class="{'activeFoucs': active == '/'}">
              <router-link to="./" class="nav-link">
                <i class="fa fa-briefcase nav-icon"></i>
                <span>首页</span>
              </router-link>
            </li>
            <li :class="{'activeFoucs': active == '/ent-apply'}" v-if="companyValidate">
              <router-link to="./ent-apply" class="nav-link">
                <i class="fa fa-file-text nav-icon"></i>
                <span>企业审核</span>
              </router-link>
            </li>
            <li :class="{'activeFoucs': active == '/apply-manage','haveNum' : hasDelivery}" v-if="purviews.talentEnrolment">
              <router-link to="./apply-manage" class="nav-link">
                <i class="fa fa-file-text nav-icon"></i>
                <span>申请管理</span>
              </router-link>
            </li>
            <li :class="{'activeFoucs': active == '/interview-manage', 'haveNum' : hasInterview}" v-if="purviewShow">
              <router-link to="./interview-manage" class="nav-link">
                <i class="fa fa-file-text nav-icon"></i>
                <span>面试管理</span>
              </router-link>
            </li>
            <li :class="{'activeFoucs': active == '/review', 'haveNum' : hasApply}" v-if="purviews.verityJob">
              <router-link to="./review" class="nav-link">
                <i class="fa fa-check-square nav-icon"></i>
                <span>职位审核 <i class="checkNum" v-if="projectListNum > 0">{{projectListNum}}</i></span>
              </router-link>
            </li>
            <li :class="{'activeFoucs': active == '/company-list'}"  v-if="purviews.checkCompany">
              <router-link to="./company-list" class="nav-link">
                <i class="fa fa-bank nav-icon"></i>
                <span>企业列表</span>
              </router-link>
            </li>
            <li :class="{'activeFoucs': active == '/job-manage'}" v-if="purviews.jobList">
              <router-link to="./job-manage" class="nav-link">
                <i class="fa fa-briefcase nav-icon"></i>
                <span>职位列表</span>
              </router-link>
            </li>
            <!-- <li :class="{'activeFoucs': active == '/pool'}">
              <router-link to="./pool" class="nav-link">
                <i class="fa fa-briefcase nav-icon"></i>
                <span>人才公海</span>
              </router-link>
            </li> -->
            <li :class="{'activeFoucs': active == '/staff-manage'}" v-if="purviews.searchTalent">
              <router-link to="./staff-manage" class="nav-link">
                <i class="fa fa-users nav-icon"></i>
                <span>人才管理</span>
              </router-link>
            </li>
            <li :class="{'activeFoucs': active == '/tunnel-promote'}">
              <router-link to="./tunnel-promote" class="nav-link">
                <i class="fa fa-check-square nav-icon"></i>
                <span>渠道推广</span>
              </router-link>
            </li>
            <li :class="{'activeFoucs': active == '/manage'}" v-if="purviews.manageAgency">
              <router-link to="./manage" class="nav-link">
                <i class="fa fa-file-text nav-icon"></i>
                <span>机构管理</span>
              </router-link>
            </li>
            <li :class="{'activeFoucs': active == '/broker'}" >
              <router-link to="./broker" class="nav-link">
                <i class="fa fa-file-text nav-icon"></i>
                <span>经纪人管理</span>
              </router-link>
            </li>
            <li :class="{'sactterStyle': active == '/team'}">
              <a class="nav-link" @click="showChildren=!showChildren">
                <i class="fa fa-file-text nav-icon"></i>
                <span>我的部门</span>
                <i class="fa fa-angle-right nav-list-angle" :class="{'nav-show':showChildren || active == '/team'}"></i>
              </a>
              <ul class="nav-child" style="display:block" v-show="showChildren || active == '/team'">
                <li :class="{'itemScatter': active == '/team'}">
                  <router-link to="./team">
                    <span>部门成员</span>
                  </router-link>
                </li>
              </ul>
            </li> 
            <li :class="{'activeFoucs': active == '/serve-city'}" v-if="purviewShow || jobstartShow">
              <router-link to="./serve-city" class="nav-link">
                <i class="fa fa-file-text nav-icon"></i>
                <span>服务城市管理</span>
              </router-link>
            </li>
            <li :class="{'activeFoucs': active == '/project-manage'}" >
              <router-link to="./project-manage" class="nav-link">
                <i class="fa fa-file-text nav-icon"></i>
                <span>项目管理</span>
              </router-link>
            </li>
            <li v-if="purviews.setupSystem">
              <a class="nav-link" @click="showChildrenNav=!showChildrenNav">
                <i class="fa fa-file-text nav-icon"></i>
                <span>系统设置</span>
                <i class="fa fa-angle-right nav-list-angle" :class="{'nav-show':showChildrenNav}"></i>
              </a>
              <ul class="nav-child" style="display:block" v-show="showChildrenNav">
                <li :class="{'itemScatter': active == '/accset'}">
                  <router-link to="./accset">
                    <span>账号设置</span>
                  </router-link>
                </li>
              </ul>
            </li>
            <li :class="{'activeFoucs': active == '/system'}" v-if="purviewShow">
              <router-link to="./system" class="nav-link">
                <i class="fa fa-file-text nav-icon"></i>
                <span>缓存与配置</span>
              </router-link>
            </li>
          </ul>
      </div>
      <div class="main-content">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
  import xz from "../common";
  export default {
    name: "headerItem",
    components: {},
    data() {
      return {
        showNav: true,
        showChildrenNav: false,
        showChildren: false,
        active: "apply-manage",
        hasApply: false,
        hasDelivery: false,
        hasInterview: false,
        purviewShow: false,
        jobstartShow: false,
        // 企业审核账号
        companyValidate: false
      };
    },
    mounted(){
      
    },
    watch: {
      $route: {
        handler: function () {
          if(Cookies.get("userid-b") === "04F97C95-DF0F-4E4F-90DB-234E969EB323"){
            this.purviewShow = true;
          }
          // 判断杰博
          if(Cookies.get("userid-b") === "a8034cc9-ea31-4df2-91f6-33b375253d4d"){
            this.jobstartShow = true;
          }
          // 企业审核
          if(Cookies.get("userid-b") === "b0aed0ca-7a74-4c7c-89b9-688441893b05"){
            this.companyValidate = true;
          }
          let year = new Date().getFullYear();
          let month = new Date().getMonth() + 1 < 10 ? '0' + (new Date().getMonth() + 1) : new Date().getMonth() + 1;
          let date = new Date().getDate() + 1 < 10 ? '0' + new Date().getDate() : new Date().getDate();
          var edate = year + '-' + month + '-' + date;

          this.active = this.$route.path;
          //获取审核列表
          if(this.$route.name != 'Review'){
            xz.verityJob(10, 1).then( res => {
            if(res){
              if(Array.isArray(res.chkjoblist)){
                res.chkjoblist.length > 0 ?  this.hasApply = true : this.hasApply = false;
              }else{
                this.hasApply = false;
              }
            }else{
              this.hasApply = false;
            }

            res ? this.$store.commit("setLogin", true) : this.$store.commit("setLogin", false);
            })
          }
          

          //获取面试管理
          xz.jobProgressEnrolment("", 0).then( res => {
            if(res){
              res.totalnum > 0 ? this.hasInterview = true : this.hasInterview = false;
            }else{
              this.hasInterview = false;
            }
          })

          //获取申请列表
          xz.deliveryTalents({
            "bdate": "2019-1-1",
            "edate": edate,
            "countnum": 10,
            "currpage": 1,
            "username": "", //姓名
            "school": "", //学习
            "jobinf": "", //职位
            "company": "", //公司
            "usertel": "", //手机
            "status": 1, //简历状态
            "constatus": "", //联系记录
            "keyword": "", //关键字查询
            "nation": "",
            "strstatus": '1'
          }).then(res => {
            if(res){
              if(Array.isArray(res.myOrderList)){
                if(res.myOrderList.length > 0){
                  this.hasDelivery = true;
                }else{
                  this.hasDelivery = false;
                }
              }else{
                this.hasDelivery = false;
              }
            }
          })
        },
        immediate: true
      },
    },
    computed: {
      projectListNum() { //返回项目总数
        return this.$store.state.JOBS.checkJobsNum;
      },
      purviews(){
        return this.$store.state.purview;
      },
      userName(){
        return this.$store.state.adminName;
      }
    },
    methods: {
      logout() {
        Cookies.set('userid-b', '');
        Cookies.set('entid-b', '');
        location.href = "/";
      }
    }
  };
</script>

<style scoped>
  .nav-show {
    transform: rotateZ(-90deg) !important;
  }
  .nav-list-angle{
    margin-left: 30px;
    font-size: 20px;
    transition: all 0.2s linear;
    transform: rotateZ(90deg);
  }
  .activeFoucs{
    background: #5f4b8b;
  }
  .activeFoucs .nav-link{
    background: #5f4b8b !important;
    border-left:none !important;
  }
  .haveNum .nav-icon,
  .activeFoucs .nav-icon{
    color: #fff;
  }
  .activeFoucs .nav-link span{
    color: #fff;
  }
  .itemScatter{
    background: #5f4b8b;
  }
  .itemScatter span{
    color: #fff;
  }
  .itemScatter a{
    background: #5f4b8b !important;
  }
  .itemScatter a span{
    color: #fff !important;
  }
  .haveNum{
    background: #fa7268;
  }
  .haveNum .nav-link span{
    color: #fff;
  }
</style>