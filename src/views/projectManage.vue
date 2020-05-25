<template>
  <div class="workPoolItem">
    <div>
      <div class="partitionTitle">
        <el-tabs @tab-click="handleClick" v-model="activeName">
          <el-tab-pane label="项目管理" name="first"></el-tab-pane>
          <el-tab-pane label="项目类别" name="second"></el-tab-pane>
        </el-tabs>
        <div class="btnPosRight">
          <button class="addBtnFunction" @click="showCreateForm = true">新增项目类别</button>
          <button class="addBtnFunction" @click="showCreateProject = true">新增项目</button>
        </div>
      </div>
      <div class="companyList" v-show="activeName === 'first'">
        <transition name="loadShadow">
          <div class="loadShadow" v-show="loadProject">
            <i class="loadgif"></i>
          </div>
        </transition>
        <div class="companyHeadLine">
          <ul class="companyItem">
            <li style="width:15%">项目名称</li>
            <li style="width:10%">项目类型</li>
            <li style="width:10%;text-align:center;">备注</li>
            <li style="width:8%;text-align:center;">是否已开通</li>
            <li style="width:8%">创建时间</li>
            <li style="width:47%">操作</li>
          </ul>
        </div>
        <div class="projectTable">
          <ul class="companyItem" v-for="(p, index) in projectList" :key="index">
              <li style="width:15%;font-weight:bold;" class="editCompanyInfor companyTitleField">
                <el-popover placement="bottom" width="200" trigger="click">
                  <div class="qcodeContainer" style="background: #fff;">
                    <div v-if="loadQcode" class="qcodeShadow">
                      <i class="loadgif"></i>
                    </div>
                    <div style="width:200px;height: auto;text-align:center;" v-else>
                      <img
                        :src="projectImg"
                        alt
                        style="width:200px;height:200px;display:block;margin-bottom:5px;"
                        class="qcodeImg" />
                      <p style="font-weight:bold;color: #333;margin: 5px 0;">{{p.objname}}</p>
                      <a :href="projectImg" :download="p.objname+'【项目码】'" target="_blank">点击下载</a>
                    </div>
                  </div>
                  <el-button slot="reference" class="qcodeBtn">
                    <img
                      src="../assets/images/qcode.jpg"
                      alt
                      class="mini_avatar"
                      style="border-radius:0"
                      @click="cerateQCode(p)"
                    />
                  </el-button>
                </el-popover>
                <img @click="showImgSetting(p)" src="../assets/images/simg.png" alt="" class="mini_avatar">
                <span @click="openProjectDetail(p)">{{p.objname}}</span>
              </li>
              <li style="width:10%">{{p.objtype}}</li>
              <li style="width:10%;text-align:center;">{{p.otherinf}}</li>
              <li style="width:8%;text-align:center;color:rgb(231, 80, 90);" >{{p.entid ? "已开通" : "未开通"}}</li>
              <li style="width:8%">{{p.createdate | formatDate}}</li>
              <li style="width:47%">
                <button type="button" class="editButton" @click="editProjectProfile(p)">修改项目资料</button>
                <button type="button" class="editButton" @click="openProjectDetail(p)">{{p.entid ? "项目详情" : "开通项目"}}</button>
                <button type="button" class="editButton" @click="selectCompanyBind(p)">绑定企业</button>
                <button type="button" class="editButton" @click="selectJobsBind(p)">绑定职位</button>
                <button type="button" class="editButton" @click="publishJobs(p)">发布职位</button>
                <button type="button" class="editButton" @click="checkJobs(p, index)">查看职位</button>
              </li>
              <li class="underJob job_list_container" v-if="p.jobs">
                <div class="jobShadow" v-show="p.load">
                  <i class="loadgif"></i>
                </div>
                <div v-if="p.showList && p.showList.length > 0">
                  <ul class="job_li" style="margin:0;border-bottom:1px solid #e4e7ed">
                    <li style="width:15%;box-sizing:border-box;padding-left:10px;">职位名称</li>
                    <li style="width:12%;">职能</li>
                    <li style="width:6%;">学历</li>
                    <li style="width:10%;">年薪</li>
                    <li style="width:10%;text-align:center;">操作人员</li>
                    <li style="width:10%;">创建日期</li>
                    <li style="width:24%;">操作</li>
                  </ul>
                  <div style="background:#f5f5f5;">
                    <ul class="job_li" v-for="(i,jindex) in p.showList" :key="jindex" style="border-bottom:1px dashed #ddd" >
                      <li style="width:15%;">
                        <span @click="editJobInfor(i,p.entid)"
                          class="editCompanyInfor"
                        >{{i.jobname}}</span>
                      </li>
                      <li style="width:12%;">{{i.funcname}}</li>
                      <li style="width:6%;">{{i.edu}}</li>
                      <li style="width:10%;">{{i.salary}}</li>
                      <li style="width: 10%;text-align:center;">{{i.username}}</li>
                      <li style="width:10%;">{{i.insertdate | formatDate}}</li>
                      <li style="width:24%;">
                        <button type="button" class="editToJob" @click="editJobInfor(i,p.entid)"
                        >修改</button>
                        <button class="deleteCompany" type="button" v-if="i.pstatus != 0" @click="outLineAction(i.jobid, p.entid, index)"
                        >下线</button>
                        <button class="deleteCompany" type="button" style="background:#909399;color:#fff;" v-else >已下线</button>
                      </li>
                    </ul>
                  </div>
                  <!--分页处-->
                  <!-- <div v-if="item.jobNum > 0">
                    <el-pagination
                      :page-size="10"
                      :current-page="item.pagenum"
                      :pager-count="5"
                      layout="prev, pager, next"
                      :total="item.totalnum"
                      @current-change="(item) => changeList(item, index)"
                    ></el-pagination>
                  </div> -->
                </div>
                <div v-else>暂无职位</div>
              </li>
            </ul>
        </div>
      </div>
    </div>
    <!--项目类别-->
    <div class="companyList" v-show="activeName === 'second'">
        <transition name="loadShadow">
          <div class="loadShadow" v-show="loadProject">
            <i class="loadgif"></i>
          </div>
        </transition>
        <table class="projectList">
          <thead>
            <tr>
              <th>类别名称</th>
              <th>项目类别</th>
              <th>类别备注</th>
              <th>创建时间</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in projectTypeList" :key="index">
              <td>{{item.objname}}</td>
              <td>{{item.objtype}}</td>
              <td>{{item.others}}</td>
              <td>{{item.createdate | formatDate}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    <!--新增项目类别-->
    <CreateProjectCategory @closeForm="closeForm" v-if="showCreateForm"></CreateProjectCategory>
    <!--新增项目-->
    <CreateProject v-if="showCreateProject" @closeForm="closeCreateProject" :info="projectProfileObj" :detail="changeDetail"></CreateProject >
    <!--项目详情-->
    <ProjectDetail v-if="showProjectDetail" @closeForm="closeProjectDetail" :projectInfo="projectInfo"></ProjectDetail>
    <!--项目图片-->
    <el-dialog
      :visible.sync="assetsContainer"
      width="1000px"
      :destroy-on-close="true"
      :before-close="closeAssets"
    >
      <CompanyExpand :entid="expandImgEnt.id" :entname="expandImgEnt.name" type="project"></CompanyExpand>
    </el-dialog>
    <!--绑定企业-->
    <BindCompany :userid="bindEntid" @closeSelectCompany="closeCompany" v-if="selectCompanyBlock"></BindCompany>
    <!--绑定职位-->
    <BindJobs :userid="bindEntid" v-if="selectJobsBlock" @closeSelectCompany="closeBindJobs"></BindJobs>
    <!---->
    <el-dialog :visible.sync="addJobs" width="1100px" :close-on-click-modal="false"
      :before-close="handleClose" class="newJob" :destroy-on-close="true">
      <PublishJob
        v-if="addJobs"
        project="project"
        :dataDetail="jobDetail"
        :entName="publishEntName"
        :entid="publishId"
        @closePublish="closePublish"
      ></PublishJob>
    </el-dialog>
  </div>
</template>
<script>
  import xz from "../common";
  import "../poster";
  import CreateProjectCategory from "../components/form/createProjectCategory";
  import CreateProject from "../components/form/createProject";
  import ProjectDetail from "../components/form/projectDetailForm";
  import CompanyExpand from "../views/companyExpand";
  import BindCompany from "../components/widgets/projectBindComapny";
  import BindJobs from "../components/widgets/projectBindJobs";
  // 发布职位
  import PublishJob from "../components/publishJob";
  export default {
    components: {
      CreateProject,
      CreateProjectCategory,
      ProjectDetail,
      CompanyExpand,
      BindCompany,
      BindJobs,
      PublishJob
    },
    data: function () {
      return {
        //控制发表职位
        addJobs: false,
        activeName: "first",
        // 项目码路径
        projectImg: "",
        // 加载二维码
        loadQcode: "",
        loadProject:false,
        showCreateForm: false,
        showCreateProject: false,
        showProjectDetail: false,
        assetsContainer: false,
        selectCompanyBlock: false,
        selectJobsBlock: false,
        projectList: [],
        projectTypeList: [],
        currentNum: 1,
        listnum: 0,
        projectInfo: null,
        expandImgEnt: "",
        // 修改的项目基本资料
        projectProfileObj: null,
        // 是否同时修改详情
        changeDetail: false,
        // 绑定操作的项目
        bindEntid: "",
        //
        publishId: "",
        publishEntName: "",
        jobDetail: ""
      };
    },
    created() {
      this.loadProjectList();
      this.loadProjectType();
    },
    computed: {
      
    },
    methods: {
      // 发布
      publishJobs(p){
        if(p.entid){
          this.addJobs = true;
          this.publishId = p.entid;
          // 设置新增状态
          this.jobDetail = "add";
          this.publishEntName = p.objname;
        }else{
          alert("请先开通项目");
        }
      },
      // 修改职位信息
      editJobInfor(item, entid) {
        this.publishId = entid;
        this.addJobs = true;
        //需要获取职位信息
        xz.getJobInformation(item.jobid).then(r => {
          if (r) {
            let detail = r.entJobInfo;
            detail.jobid = item.jobid;
            this.jobDetail = detail;
          } else {
            alert("系统出错");
          }
        });
      },
      // 展开职位列表
      checkJobs(p, index){
        if(p.entid){
          let isShow = this.projectList[index].jobs;
          if(!isShow){
            this.$set(this.projectList[index], "jobs", true);
            this.$set(this.projectList[index], "load", true);
            // 获取职位 
            this.projectJobs(p.entid, index);
          }else{
            this.$set(this.projectList[index], "jobs", false);
          }
          
        }else{
          alert("请先开通项目");
        }
      },
      // 获取项目职位列表
      projectJobs(entid, index){
        xz.joblistInCompany(entid).then(res => {
          this.$set(this.projectList[index], "showList", res ? res : []);
          this.$set(this.projectList[index], "load", false);
        })
      }, 
      // 关闭职位发布页面
      closePublish() {
        this.addJobs = false;
        this.jobDetail = "";
      },
      //开启新增企业表单，更改entid
      publish_job(item) {
        this.addJobs = true;
        this.publishId = item.entId;
        //设置新增状态
        this.jobDetail = "add";
        //企业id
        this.publishEntName = item.entName;
      },
      // 下线职位
      outLineAction(jobid, entid, index){
        xz.offlineJob(jobid, entid).then(res => {
        if (res) {
          //重新获取职位
          this.$set(this.projectList[index], "load", true);
          this.projectJobs(entid, index);
        } else {
          alert("系统出错");
        }
      });
      },
      // 关闭发布职位
      handleClose(done) {
        this.$confirm("确认取消发布？")
          .then(_ => {
            done();
            this.jobDetail = "";
            //重置数据
            this.$store.commit("setJobInit");
          })
          .catch(_ => {});
      },
      //生成项目二维码
      cerateQCode(item) {
        this.loadQcode = true;
        this.projectImg = "";
        //生成项目二维码
        //获取账号信息
        xz.accountInformation().then(account => {
          let data  ={
            username: account.StrUserName,
            userid: account.GdUserId,
            usertel: account.StrUserMobile
          }
          xz.addBroker(data).then( broker => {
            if(broker){
              //生成经济人企业码
              let brokerData = {
                linktype: "E",
                userid: account.GdUserId,
                linkid: item.entid,
                otherinf: "",
                codeid: "",
                idxpath: "pages/projectDetail/projectDetail"
              }
              xz.createPromo(brokerData).then(brokerCode => {
                if(brokerCode){
                  //推广码
                  let bCode = "https://www.azhiye.com/cloudimg/" + brokerCode;
                  poster({
                    logourl: item.entImage ? "https://www.azhiye.com/cloudimg/" + item.entImage : "",
                    codeurl: bCode
                  }).then( img => {
                    this.projectImg = img;
                    this.loadQcode = false;
                  })
                }
              })
            }
          })
        })
      },
      // 加载项目列表
      loadProjectList(){
        this.loadProject = true;
        xz.getProjectList(this.currentNum).then(datalist => {
          this.loadProject = false;
          this.projectList = Array.isArray(datalist.comobjlist) ? datalist.comobjlist : [];
          this.listnum = datalist.totalnum ? datalist.totalnum : 0;
        });
      },
      // 获取项目类型
      loadProjectType(){
        xz.getCategory().then(category => {
          this.projectTypeList = category ? category : [];
        });
      },
      // 项目详情
      openProjectDetail(p){
        this.projectInfo = {
          objid: p.objid,
          objtype: p.objtype,
          objname: p.objname,
          entid: p.entid
        }
        this.showProjectDetail = true;
      },
      // 显示项目图片设置
      showImgSetting(p){
        if(p.entid){
          this.expandImgEnt = {
            id: p.entid,
            name: p.objname
          }
          this.assetsContainer = true;
        }else{
          alert("请先开通项目");
        }
      },
      // 修改项目基本资料
      editProjectProfile(p){
        this.projectProfileObj = {
          objid: p.objid,
          objname: p.objname,
          otherinf: p.otherinf,
          objtype: p.objtype,
          entid: p.entid ? p.entid : ""
        }
        // 如果有entid
        if(p.entid){
          this.changeDetail = true;
        }
        this.showCreateProject = true;
      },
      // 绑定企业 
      selectCompanyBind(p){
        if(p.entid){
          this.bindEntid = p.entid;
          this.selectCompanyBlock = true;
        }else{
          alert("请先开通项目");
        }
      },
      // 绑定职位
      selectJobsBind(p){
        if(p.entid){
          this.selectJobsBlock = true;
          this.bindEntid = p.entid;
        }else{
          alert("请先开通项目");
        }
      },
      // 关闭添加项目类型
      closeForm(){
        this.showCreateForm = false;
      },
      // 关闭新增项目表
      closeCreateProject(v){
        if(v){
          this.loadProjectList();
        }
        this.projectProfileObj = null;
        this.showCreateProject = false;
        this.changeDetail = false;
      },
      // 关闭项目详情
      closeProjectDetail(v){
        this.projectInfo = null;
        this.showProjectDetail= false;
        if(v){
          this.loadProjectList();
        }
      },
      // 关闭项目图片设置
      closeAssets(done){
        this.expandImgEnt = "";
        done();
      },
      // 关闭绑定企业
      closeCompany(){
        this.bindEntid = "";
        this.selectCompanyBlock = false;
      },
      // 关闭绑定职位
      closeBindJobs(){
        this.bindEntid = "";
        this.selectJobsBlock = false;
      }
    }
  };
</script>
<style scoped>
.projectTable .editButton{
  margin-left: 5px;
}
.projectList{
  width: 100%;
}
.flexLayer{
  display: flex;
}
.projectList th,
.projectList td{
  text-align: center;
  font-size: 14px;
  color: #333;
  padding: 8px 0;
}
.editButton{
  padding: 8px 20px;
  border: none;
  color: #fff;
  border-radius: 3px;
  outline: none;
  background: #409eff;
  margin-left: 15px;
}
.addBtnFunction{
    color: #fff;
    background: #409eff;
    border-radius: 3px;
    font-size: 14px;
    padding: 8px 12px;
    border: none;
    margin-left: 15px;
}
.btnPosRight{
  position: absolute;
  right: 0;
  top: 0; 
}
.qcodeBtn {
  padding: 0 !important;
  border: none !important;
}
.qcodeBtn:hover {
  background: #fff !important;
}
</style>