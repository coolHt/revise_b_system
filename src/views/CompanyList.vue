<template>
  <div class="workPoolItem">
    <div style="position:relative;">
      <button
        class="addCompany"
        type="button"
        @click="openAddForm"
        v-if="purviews.manageCompany"
      >新增企业</button>
      <el-tabs @tab-click="triggleTab">
        <el-tab-pane label="我的企业"></el-tab-pane>
        <el-tab-pane label="企业列表"></el-tab-pane>
      </el-tabs>
      <div class="searchCon" style="display:flex;margin-bottom:20px;">
        <input
          style="height: 45px;margin-right: 20px;"
          type="text"
          class="blurSearch"
          placeholder="请输入企业名称查询"
          v-model="keyword"
          v-on:keyup.enter="searchKeyWord"
        />
        <!--区域搜索-->
        <MRegion :fullrange="true" :selected="selectedRegion" @cRegion="getRegion" :search="true"></MRegion>
        <!-- <div v-if="currentNation.length > 0" class="selecteArea">
          <el-select v-model="instnation" placeholder="请选择" @change="searchCurrentAgency">
            <el-option
              v-for="item in currentNation"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            ></el-option>
          </el-select>
        </div> -->

        <p class="listCount">
          共有
          <span style="color:#e7505a;font-weight:bold;">{{totalCompany}}</span> 个
        </p>
      </div>
      <div class="companyList">
        <transition name="loadShadow">
          <div class="loadShadow" v-show="loadTalents">
            <i class="loadgif"></i>
          </div>
        </transition>
        <div class="companyHeadLine">
          <ul class="companyItem">
            <li style="width:20%">公司名称</li>
            <li style="width:13%">营业执照</li>
            <li style="width:10%;text-align:center;">职位数</li>
            <li style="width:8%;text-align:center;">申请人数</li>
            <li style="width:8%">资料类型</li>
            <li style="width:12%">录入人</li>
            <li style="width:29%">操作</li>
          </ul>
        </div>
        <div ref="companys">
          <div v-if="companyLists">
            <ul class="companyItem" v-for="(item,index) in companyLists" :key="index">
              <li style="width:20%;font-weight:bold;" class="editCompanyInfor companyTitleField">
                <img
                  :src="item.entImage ? 'https://www.azhiye.com/cloudimg/' + item.entImage : avatarImg"
                  alt
                  class="mini_avatar"
                  @click="showAssets(item)"
                />

                <el-popover placement="bottom" width="200" trigger="click">
                  <div class="qcodeContainer" style="background: #fff;">
                    <div v-if="loadQcode" class="qcodeShadow">
                      <i class="loadgif"></i>
                    </div>
                    <div style="width:200px;height: auto;text-align:center;" v-else>
                      <img
                        :src="canvasImg"
                        alt
                        style="width:200px;height:200px;display:block;margin-bottom:5px;"
                        class="qcodeImg"
                      />
                      <p style="font-weight:bold;color: #333;margin: 5px 0;">{{item.entName}}</p>
                      <a :href="canvasImg" download="企业码" target="_blank">点击下载</a>
                    </div>
                  </div>
                  <el-button slot="reference" class="qcodeBtn">
                    <img
                      src="../assets/images/qcode.jpg"
                      alt
                      class="mini_avatar"
                      style="border-radius:0"
                      @click="cerateQCode(item)"
                    />
                  </el-button>
                </el-popover>

                <span @click="editCompanyInfor(item.entId)">{{item.entName}}</span>
              </li>
              <li style="width:13%">{{item.entCertId}}</li>
              <li style="width:10%;text-align:center;">
                <span
                  v-if="item.jobNum > 0"
                  style="cursor:pointer;color:rgb(231, 80, 90);font-size: 20px;"
                  @click="viewJob(item.entId, index)"
                >{{item.jobNum}}</span>
                <span
                  v-else
                  style="cursor:pointer;color:rgb(231, 80, 90);font-size: 20px;"
                >{{item.jobNum}}</span>
              </li>
              <li
                style="width:8%;text-align:center;color:rgb(231, 80, 90);font-size: 20px;"
              >{{item.cvNum}}</li>
              <li style="width:8%">{{item.notice}}</li>
              <li style="width:12%;word-break: break-all;">{{item.userName}}</li>
              <li style="width:29%">
                <button class="deleteCompany" style="margin-right:8px;background:#edaf54;margin-bottom: 5px" type="button" @click="drawEntText(item)" >企业海报</button>
                <span class="addJobBtn" style="margin-bottom: 5px" @click="publish_job(item)" v-if="purviews.manageJob">新增职位</span>
                <span class="viewJob" @click="viewJob(item.entId, index)">查看职位</span>
                <span
                  class="viewJob"
                  style="background:#36c6d3;;margin-bottom: 5px"
                  @click="viewJob(item.entId, index, true)"
                >刷新职位</span>
                <span
                  class="viewJob"
                  v-if="createAccountRole"
                  style="background:#36c6d3;margin-bottom: 5px"
                  @click="createCompanyAccount(item)"
                >{{item.hasAccount ? "查看账号" : "生成企业账号"}}</span>
              </li>
              <li class="underJob job_list_container" style="display:none;">
                <div class="jobShadow">
                  <i class="loadgif"></i>
                </div>
                <div v-if="item.jobs">
                  <ul class="job_li" style="margin:0;border-bottom:1px solid #e4e7ed">
                    <li style="width:7%;">职位码</li>
                    <li style="width:15%;box-sizing:border-box;padding-left:10px;">职位名称</li>
                    <li style="width:12%;">职能</li>
                    <li style="width:6%;">学历</li>
                    <li style="width:10%;">年薪</li>
                    <li style="width:5%;text-align:center;">投递人数</li>
                    <li style="width:8%;text-align:center;">操作人员</li>
                    <li style="width:8%;">创建日期</li>
                    <li style="width:24%;" v-if="purviews.manageJob">操作</li>
                  </ul>
                  <div style="background:#f5f5f5;">
                    <ul
                      class="job_li"
                      v-for="(i,jindex) in item.showList"
                      :key="jindex"
                      style="border-bottom:1px dashed #ddd"
                    >
                    <li style="width:7%">
                      <el-popover placement="bottom" width="200" trigger="click">
                        <div class="qcodeContainer" style="background: #fff;">
                          <div v-if="loadJobQcode" class="qcodeShadow">
                            <i class="loadgif"></i>
                          </div>
                          <div style="width:200px;height: auto;text-align:center;" v-else>
                            <img
                              :src="jobCodeImg"
                              alt
                              style="width:200px;height:200px;display:block;margin-bottom:5px;"
                              class="qcodeImg"
                            />
                            <p style="font-weight:bold;color: #333;margin: 5px 0;">{{i.jobname}}</p>
                            <a :href="jobCodeImg" download="职位码" target="_blank">点击下载</a>
                          </div>
                        </div>
                        <el-button slot="reference" class="qcodeBtn">
                          <img
                            src="../assets/images/qcode.jpg"
                            alt
                            class="mini_avatar"
                            style="border-radius:0;margin-right:0;"
                            @click="cerateJobCode(i, item)"
                          />
                        </el-button>
                      </el-popover>
                      <!-- <img src="../assets/images/qcode.jpg" alt="" class="jobCode"> -->
                    </li>
                      <li
                        style="width:15%;box-sizing:border-box;padding-left:10px;font-weight:bold;"
                        class="job_item_name"
                      >
                        <span
                          @click="editJobInfor(i,item.entId)"
                          class="editCompanyInfor"
                        >{{i.jobname}}</span>
                      </li>
                      <li style="width:12%;">{{i.funcname}}</li>
                      <li style="width:6%;">{{i.edu}}</li>
                      <li style="width:10%;">{{i.salary}}</li>
                      <li style="width:5%;text-align:center;color:#5b9bd1;cursor:pointer">
                        <span @click="checkoutStaff(i,i.cvnum)">{{i.num ? i.num : 0}}</span>
                      </li>
                      <li style="width: 8%;text-align:center;">{{i.username}}</li>
                      <li
                        style="width:8%;"
                      >{{new Date(i.insertdate).getFullYear()+"."+(new Date(i.insertdate).getMonth()+1)+"."+new Date(i.insertdate).getDate()}}</li>
                      <li style="width:24%;" v-if="purviews.manageJob">
                        <button
                          class="deleteCompany"
                          style="background:#409eff"
                          type="button"
                          v-if="i.pstatus == 2"
                          @click="setImg(i, item)"
                        >职位海报</button>
                        <button
                          type="button"
                          class="editToJob"
                          @click="editJobInfor(i, item.entId)"
                        >修改</button>
                        <button
                          class="deleteCompany"
                          type="button"
                          v-if="i.pstatus != 0"
                          @click="outLineJob(i, item.entId, jindex, index)"
                        >下线</button>
                        <button
                          class="deleteCompany"
                          type="button"
                          v-if="i.pstatus == 0"
                          style="background:#909399;color:#fff;"
                        >已下线</button>
                        <button
                          class="deleteCompany"
                          type="button"
                          v-if="i.pstatus == 1"
                          style="background:#36c6d3;color:#fff;"
                        >审核中</button>
                        <button
                          class="deleteCompany"
                          type="button"
                          v-if="i.pstatus == 3"
                          style="background:#909399;color:#fff;"
                        >被拒绝</button>
                        <el-popover
                          v-if="i.pstatus == 3"
                          placement="top-start"
                          width="400"
                          trigger="hover"
                          @show="getJobHisotry(i)"
                        >
                          <div class="rejectHistory">
                            <h1 class="rejectTitle">拒绝记录</h1>
                            <div class="rejectRecord">
                              <div class="rejectLoadContainer" v-if="rejectLoad">
                                <img src="../assets/images/loadgif.gif" alt class="loadImg" />
                              </div>
                              <table class="rejectTable" v-else>
                                <thead>
                                  <tr>
                                    <th style="width: 50%">拒绝理由</th>
                                    <th style="width: 35%">操作人</th>
                                    <th style="width: 15%">日期</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr
                                    v-for="(r, i) in rejectReasonList"
                                    :key="i"
                                    class="rejectItem"
                                  >
                                    <th>{{r.content}}</th>
                                    <th>{{r.username}}</th>
                                    <th>{{r.date}}</th>
                                  </tr>
                                  <tr
                                    v-for="(r, i) in rejectReasonList"
                                    :key="i"
                                    class="rejectItem"
                                  >
                                    <th>{{r.content}}</th>
                                    <th>{{r.username}}</th>
                                    <th>{{r.date}}</th>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                          <el-button slot="reference">查看审核历史</el-button>
                        </el-popover>
                      </li>
                    </ul>
                  </div>
                  <!--分页处-->
                  <div v-if="item.jobNum > 0">
                    <el-pagination
                      :page-size="10"
                      :current-page="item.pagenum"
                      :pager-count="5"
                      layout="prev, pager, next"
                      :total="item.totalnum"
                      @current-change="(item) => changeList(item, index)"
                    ></el-pagination>
                  </div>
                </div>
                <div v-else>暂无职位</div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div v-if="totalCompany > 0">
        <el-pagination
          :page-size="pageSize"
          :pager-count="5"
          layout="prev, pager, next"
          :total="totalCompany"
          @next-click="changeCompanyList"
          @prev-click="changeCompanyList"
          @current-change="changeCompanyList"
        ></el-pagination>
      </div>
    </div>
    <!--新增企业-->
    <el-dialog
      :visible.sync="addform"
      width="1000px"
      style="margin-top:10vh"
      @close="closeAddForm"
      class="newEnt"
      :close-on-click-modal="false"
    >
      <div class="entInfoContainer">
        <div class="card">
          <div class="card-content">
            <div id="entBaseInfoForm">
              <div class="draft-job">
                <h5>基本信息</h5>
              </div>
              <div class="infor_field">
                <label class="field_name">
                  <span style="color:#c82a2e !important;">*</span>企业名称：
                </label>
                <div
                  class="searchCompanyName"
                  :class="searchDown === true && isRegister?'alreadyRegister':''"
                  style="position:relative;"
                >
                  <div class="isRegister" v-if="searchDown !== null">
                    <img
                      class="registerLoad"
                      v-if="searchDown === false"
                      src="../assets/images/loadgif.gif"
                      alt
                    />
                    <span
                      v-if="searchDown === true && isRegister"
                      style="color:#c82a2e !important;"
                    >企业名称已存在</span>
                    <span
                      v-if="searchDown === true && !isRegister"
                      style="color:#67C23A !important"
                    >企业名称可使用</span>
                  </div>
                  <input
                    id="companyName"
                    type="text"
                    placeholder="输入企业名称"
                    v-model="entBaseInfo.entName"
                    @click.stop
                    ref="entName"
                    @blur="checkentName"
                  />
                  <button type="button" @click.stop="searchMatch">搜索</button>
                  <div v-show="showResult" class="showResult" @click.stop>
                    <ul>
                      <li
                        v-for="(com, index) in searchResult"
                        :key="index"
                        class="company_item"
                        @click="selectCom(com)"
                        :class="com.userId?'disableSelect':''"
                      >
                        <span>{{com.entName}}</span>
                        <span class="companyType">{{com.notice}}</span>
                      </li>
                    </ul>
                  </div>
                </div>
                <p id="tipCompanyName" class="error_text"></p>
              </div>

              <div class="infor_field">
                <label class="field_name">
                  <span style="color:#c82a2e !important;">*</span>营业执照：
                </label>
                <div style="display:flex;width:400px;" v-show="!isGoverment">
                  <input
                    id="licenseId"
                    type="text"
                    placeholder="输入营业执照号码"
                    v-model="entBaseInfo.entCertId"
                    @blur="inputCheck('entCertId')"
                    ref="entCertId"
                    style="width:400px;"
                  />
                </div>
                <div class="isGoverment">
                  <input type="checkbox" v-model="isGoverment" />
                  政府机构
                </div>
                <p id="tipLicenseId" class="error_text"></p>
              </div>
              <div class="infor_field">
                <label class="field_name">
                  <span style="color:#c82a2e !important;">*</span>企业地址：
                </label>
                <div style="width:550px;display:flex;align-items:center;" ref="entRegion">
                  <MRegion
                    @cRegion="changeArea"
                    :fullrange="true"
                    :selected="selected"
                    :search="true"
                  ></MRegion>
                  <span class="locateSplit">/</span>
                  <input
                    id="locDetail"
                    v-model="entBaseInfo.entAdd"
                    type="text"
                    placeholder="详细地址"
                    autocomplete="off"
                  />
                </div>
                <p id="tipLoc" class="error_text"></p>
              </div>
              <div class="infor_field">
                <label class="field_name">企业行业：</label>
                <el-select v-model="entBaseInfo.entIndustry" placeholder="请选择">
                  <el-option
                    v-for="item in companyIndustry"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </div>
              <div class="infor_field">
                <label class="field_name">企业性质：</label>
                <el-select v-model="entBaseInfo.entClass" placeholder="请选择">
                  <el-option
                    v-for="item in companyProperty"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </div>
              <div class="infor_field">
                <label class="field_name">企业规模：</label>
                <el-select v-model="entBaseInfo.entScale" placeholder="请选择">
                  <el-option
                    v-for="item in companyScale"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </div>
              <div class="infor_field">
                <label class="field_name">
                  <span style="color:#c82a2e !important;">*</span>企业介绍：
                </label>
                <div class>
                  <textarea
                    rows="5"
                    placeholder="企业介绍"
                    id="introduction"
                    v-model="entBaseInfo.entSummary"
                    ref="entSummary"
                    @blur="checkentSummary"
                  ></textarea>
                </div>
                <p id="entSummary" class="error_text"></p>
              </div>
              <div class="infor_field">
                <label class="field_name">联系人：</label>
                <div class>
                  <input type="text" placeholder="请输入联系人名称" v-model="entBaseInfo.entConName" />
                </div>
              </div>
              <div class="infor_field">
                <label class="field_name">手机号：</label>
                <div class>
                  <input name type="text" v-model="entBaseInfo.entConTel" placeholder="请输入手机号" />
                </div>
              </div>
              <div class="infor_field">
                <label class="field_name">
                  <span style="color:#c82a2e !important;">*</span>简历邮箱：
                </label>
                <div class>
                  <input
                    id="entemail"
                    type="email"
                    placeholder="输入接受简历的邮箱"
                    v-model="entBaseInfo.entEmail"
                    ref="tipEntEmail"
                    @blur="inputCheck('entEmail')"
                  />
                </div>
                <p id="tipEntEmail" class="error_text"></p>
              </div>
              <div class="form_save" v-if="purviews.manageCompany">
                <button
                  type="button"
                  class="btn-search"
                  @click="funUpload()"
                  v-if="!isRegister"
                >保存信息</button>
                <button
                  type="button"
                  class="btn-search"
                  style="cursor:auto;color: #fff;background: #ccc;"
                  v-else
                >保存信息</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
    <!---->
    <el-dialog
      :visible.sync="addJobs"
      width="1100px"
      :close-on-click-modal="false"
      :before-close="handleClose"
      class="newJob"
      :destroy-on-close="true" >
      <PublishJob
        v-if="addJobs"
        :dataDetail="jobDetail"
        :entName="publishEntName"
        :entid="publishId"
        @closePublish="closePublish"
      ></PublishJob>
    </el-dialog>
    <!---->
    <el-dialog :visible.sync="offLine" width="30%">
      <span>确定是否下线职位?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="offLine = false">取 消</el-button>
        <el-button type="primary" @click="outLineAction">确 定</el-button>
      </span>
    </el-dialog>
    <!--投递人-->
    <el-dialog :visible.sync="showDeliver" width="1000px">
      <DeliveryList :jobId="jobId" :jobName="jobName"></DeliveryList>
    </el-dialog>
    <el-dialog
      :visible.sync="assetsContainer"
      width="1000px"
      :destroy-on-close="true"
      :before-close="closeAssets"
    >
      <CompanyExpand :entid="editId" :entname="publishEntName"></CompanyExpand>
    </el-dialog>
    <el-dialog
      :visible.sync="ifshowimg"
      :destroy-on-close="true"
      :before-close="closeAssets"
      width="800px"
    >
      <div class="posterContainer">
        <p v-if="!bgcodeimg">图片加载中</p>
        <div style="width: 100%;text-align:center;margin-bottom: 30px;" v-else>
          <a :href="bgcodeimg" :download="posterJob" target="_blank" style="padding: 12px 35px;background:#5f4b8b;color:#fff;">点击下载</a>
        </div>
        
        <img :src="bgcodeimg" style="width:500px;display:block;margin-bottom:5px;height: auto;" />
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="ifshowentimg"
      :destroy-on-close="true"
      :before-close="closeAssets"
      width="800px"
    >
      <div class="posterContainer">
        <p v-if="!entbgcodeimg">图片加载中</p>
        <div style="width: 100%;text-align:center;margin-bottom: 30px;" v-else>
          <a :href="entbgcodeimg" :download="posterEnd" target="_blank" style="padding: 12px 35px;background:#5f4b8b;color:#fff;">点击下载</a>
        </div>
        <img :src="entbgcodeimg" style="width:500px;display:block;margin-bottom:5px;height: auto;" />
      </div>
    </el-dialog>
    <!--生成企业账号表单-->
    <CreateCompanyAccount v-if="showCreateAccount" @closeForm="showCreateAccount = false" :entid="creatEntid"></CreateCompanyAccount>
  </div>
</template>
<script>
</script>
<script>
import "../poster"; //海报功能库
import xz from "../common";
import PublishJob from "../components/publishJob";
//投递人列表
import DeliveryList from "../components/deliveryList";
//企业图片
import CompanyExpand from "./companyExpand";
// 生成企业账号表单
import CreateCompanyAccount from "../components/form/createCompanyAccount";
export default {
  components: {
    PublishJob,
    DeliveryList,
    CompanyExpand,
    CreateCompanyAccount
  },
  data: function() {
    return {
      // 判断有没有权限给企业生成账号
      createAccountRole: false,
      // 开启生成账号表单 
      showCreateAccount: false,
      creatEntid: "",
      posterJob: "",
      posterEnd: "",
      selectedRegion: "", //已选择的筛选区域
      canvasImg: "",
      loadQcode: false,
      loadJobQcode: false,
      jobCodeImg: "",
      ownCompany: "1",
      qcodeUrl: require("../assets/images/qcode.jpg"),
      //备份修改的企业名称
      backUpName: "",
      searchDown: null, //需要初始化
      //判断是否已被注册
      isRegister: true, //需要初始化
      avatarImg: require("../assets/images/simg.png"),
      assetsContainer: false,
      loadTalents: false,
      selected: "", //已有的地区code
      //账号生成表单展示
      showCreateForm: false,
      addform: false,
      //控制发表职位
      addJobs: false,
      //企业id
      publishId: "",
      //企业名称
      publishEntName: "",
      //新增企业
      entBaseInfo: {
        entName: "",
        entEmail: "",
        entCertId: "",
        entAdd: "",
        entIndustry: "",
        entConName: "",
        entConTel: "",
        entClass: "",
        entScale: "",
        entSummary: "",
        entNation: ""
      },
      //判断是否是政府部门
      isGoverment: false,
      companyProperty: this.$store.state.ADDCOMPANY.companyProperty,
      companyScale: this.$store.state.ADDCOMPANY.scale,
      companyIndustry: this.$store.state.ADDCOMPANY.companyIndustry,
      //正则
      emailReg: /^[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*\.[a-z]{2,}$/,
      telReg: /^1[34578]\d{9}$/,
      reg: /[\s\S`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im,
      licenseIdReg: /^(?:(?![IOZSV])[\dA-Z]){2}\d{6}(?:(?![IOZSV])[\dA-Z]){10}$/,
      approve: true,
      showResult: false,
      jobDetail: "",
      editId: "",
      offLine: false, //下线提醒
      //分页
      pageSize: 10,
      currentNum: 1,
      outJobid: "",
      outEntid: "",
      //展示投递人
      showDeliver: false,
      //职位名称
      jobName: "",
      //职位id
      jobId: "",
      //企业id
      entId: "",
      //数据列表页码
      dataCurrentNum: 1,
      dataPageSize: 10,
      //初始化内部职位表单数据
      keyword: "",
      //生成账号
      accoutData: {
        username: "",
        useremail: "",
        usertel: "",
        userid_e: ""
      },
      accountEntid: "",
      //原来的营业执照号码
      oldCertId: "",
      companyLists: [],
      //添加企业计数器，防止多次添加
      count: 0,
      offlineEntid: "",
      offlineIndex: "",
      isPublish: false,
      //企业简称
      briefName: {
        value: "",
        identifyType: "empty",
        checkEmpty: false
      },
      //拒绝理由
      rejectReasonList: [],
      //加载拒绝理由
      rejectLoad: false,
      //搜索当前所在区域
      instnation: "",
      //是否查看当前机构的企业
      searchCurrent: false,
      //当前所在机构
      currentNation: [],
      ifshowimg: false,
      bgimg: require("../assets/images/bg.jpg"),
      bgcodeimg: "",
      ifshowentimg: false,
      entbgcodeimg: ""
    };
  },
  mounted() {
    // 判断是不是BBase权限
    if(Cookies.get("userid-b") === '04F97C95-DF0F-4E4F-90DB-234E969EB323'){
      this.createAccountRole = true;
    }
    const _this = this;
    document.addEventListener("click", function() {
      _this.showResult = false;
    });
  },
  computed: {
    //权限
    purviews() {
      return this.$store.state.purview;
    },
    loadDeliverLists() {
      //投递人遮罩层
      return this.$store.state.TALENTS.loadDeliverLists;
    },
    searchResult() {
      if (this.$store.state.ADDCOMPANY.companyMatch.length > 0) {
        this.showResult = true;
      }
      return this.$store.state.ADDCOMPANY.companyMatch;
    },
    //判断是否有账号
    isHasCheck() {
      //null是初始化， false是没有， true是有
      return this.$store.state.ADDCOMPANY.isHas;
    }
  },
  watch: {
    "$store.state.instcode": {
      handler: function() {
        if (this.$store.state.instnation) {
          //暂时不限制区域，直接打开所有的
          let t = this.$store.state.instnation;
          if (t != "all" && t != "全国") {
            let tArr = t.split(",");
            let arr = [];
            let totalCode = [];
            tArr.forEach(t => {
              let tCode = "";
              let obj = this.$store.getters.codeToggleObj(t);
              let localName = this.$store.getters.localName(obj);
              let nameArr = localName.split("-");
              let tName = nameArr[nameArr.length - 1];
              
              tCode = t;
              totalCode.push(tCode); //我的企业code集合
              arr.push({
                name: tName,
                code: tCode
              });
            });
            this.currentNation = arr;
          }
          this.instnation = "";
          this.searchField(); //获取数据
        }
      },
      immediate: true
    },
    //获取修改的企业信息
    "$store.state.ADDCOMPANY.companyInfor": {
      handler: function() {
        const infor = this.$store.state.ADDCOMPANY.companyInfor;
        if (infor) {
          let certId = infor.entCertId;
          if (certId.indexOf("govcn") > 0) {
            //如果是政府
            this.isGoverment = true;
          }
         
          this.entBaseInfo = infor; //这里会拿到执照
          console.log(infor);
          this.oldCertId = certId; //保存原来的
          // this.entBaseInfo.entNation ? this.selected = this.entBaseInfo.entNation : this.selected = '';
          if (this.entBaseInfo.entNation) {
            this.selected = this.entBaseInfo.entNation;
          } else {
            this.entBaseInfo.entNation = this.selected;
          }
        }
      }
    },
    "$store.state.ADDCOMPANY.accountInfo": {
      handler: function() {
        if (!this.$store.state.ADDCOMPANY.accountInfo) {
          this.accoutData = {
            //初始化
            username: "",
            useremail: "",
            usertel: "",
            userid_e: ""
          };
        } else {
          this.accoutData = {
            //初始化
            username: this.$store.state.ADDCOMPANY.accountInfo.strUserName,
            useremail: this.$store.state.ADDCOMPANY.accountInfo.strUserEmail,
            usertel: this.$store.state.ADDCOMPANY.accountInfo.strUserMobile,
            userid_e: this.$store.state.ADDCOMPANY.accountInfo.userid
          };
        }
      }
    },
    "$store.state.ADDCOMPANY.produceSuccess": {
      handler: function() {
        if (this.$store.state.ADDCOMPANY.produceSuccess) {
          this.showCreateForm = false;
          this.accoutData = {
            //初始化
            username: "",
            useremail: "",
            usertel: "",
            userid_e: ""
          };
          alert("账号生成成功");
        }
      }
    },
    isGoverment: {
      handler: function() {
        if (!this.isGoverment) {
          if (this.oldCertId) {
            if (this.oldCertId.indexOf("govcn") > -1) {
              this.entBaseInfo.entCertId = "";
            }
          }
        }
      }
    }
  },
  methods: {
    //生成jobcode
    cerateJobCode(i, item){
      this.loadJobQcode = true;
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
              linktype: "J",
              userid: account.GdUserId,
              linkid: i.pubid,
              otherinf: "",
              codeid: "",
              idxpath: "pages/jobDetail/jobDetail"
            }
            xz.createPromo(brokerData).then(brokerCode => {
              poster({
                logourl: item.entImage ? "https://www.azhiye.com/cloudimg/" + item.entImage : "",
                codeurl: brokerCode ? "https://www.azhiye.com/cloudimg/" + brokerCode : ""
              }).then(img => {
                this.loadJobQcode = false;
                this.jobCodeImg = img;
                //this.bgcodeimg = img;
              });
            })
          }
        })
      })
    },
    //地区选择
    getRegion(r) {
      let code = "";
      if (r.area) {
        code = r.area.code;
      } else if (r.city) {
        code = r.city.code;
      } else {
        code = r.province.code;
      }
      this.selectedRegion = code;
      //搜索
      this.searchKeyWord();
    },
    //切换面板
    triggleTab(t){
      if(t.label == "企业列表"){
        this.ownCompany = "";
      }else if(t.label == "我的企业"){
        this.ownCompany = "1";
      }
      this.currentNum = 1;
      this.searchField();
    },
    initCom() {
      //初始化企业表单
      //重置原来的营业执照
      this.oldCertId = "";
      this.entBaseInfo = {
        entName: "",
        entEmail: "",
        entCertId: "",
        entAdd: "",
        entIndustry: "",
        entConName: "",
        entConTel: "",
        entClass: "",
        entScale: "",
        entSummary: "",
        entNation: ""
      };
      //this.clearSelectCode();
      this.backUpName = "";
      this.isGoverment = false;
      this.searchDown = null;
      //判断是否已被注册
      this.isRegister = true;
    },
    //打开新增表单
    openAddForm() {
      this.addform = true;
      this.editId = "";
    },
    // 企业生成账号
    createCompanyAccount(ent){
      this.showCreateAccount = true;
      this.creatEntid = ent.entId;
    },
    //生成企业二维码
    cerateQCode(item) {
      this.loadQcode = true;
      this.canvasImg = "";
      //生成企业二维码
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
              linkid: item.entId,
              otherinf: "",
              codeid: "",
              idxpath: "pages/companyDetail/companyDetail"
            }
            xz.createPromo(brokerData).then(brokerCode => {
              if(brokerCode){
                //推广码
                let bCode = "https://www.azhiye.com/cloudimg/" + brokerCode;
                poster({
                  logourl: item.entImage ? "https://www.azhiye.com/cloudimg/" + item.entImage : "",
                  codeurl: bCode
                }).then( img => {
                  this.canvasImg = img;
                  this.loadQcode = false;
                })
              }
            })
          }
        })
      })
    },
    //显示企业的图片
    showAssets(item) {
      this.editId = item.entId;
      this.publishEntName = item.entName;
      this.assetsContainer = true;
    },
    //搜索
    searchField() {
      this.loadTalents = true;
      let str = JSON.stringify({
        keyword: this.keyword,
        entname: "",
        nation: this.selectedRegion,
        ownCompany: this.ownCompany
      });
      xz.getAllCompany(this.pageSize, this.currentNum, str).then(res => {
        console.log(res);
        let list = res.msg;
        this.companyLists = list;
        this.totalCompany = res.totalnum;
        if (Array.isArray(list)) {
          let entid = [];
          let companyAccount = [];
          list.forEach((l, index) => {
            //企业头像没有设置就清空
            if (
              l.entImage == "https://zhishiimg.oss-cn-hangzhou.aliyuncs.com/"
            ) {
              this.$set(this.companyLists[index], "entImage", "");
            }
            entid.push(l.entId);
            companyAccount.push(xz.companyAccountInformation(l.entId));
          });
          entid = entid.join();
          xz.companyAccountInformation("bc5d1dd7-6b0a-4980-b6dc-fad715f2fc61")
          Promise.all(companyAccount).then(account => {
            account.forEach( (a,i) => {
              list[i].hasAccount = a ? true : false;
            })
          })
          //
          xz.jobDeliveryNum(entid).then(res => {
            if (Array.isArray(res)) {
              this.companyLists.forEach((c, index) => {
                let num = res.find(r => r.entId == c.entId);
                if (num) {
                  this.$set(this.companyLists[index], "jobNum", num.jobNum);
                  this.$set(this.companyLists[index], "cvNum", num.cvNum);
                } else {
                  this.$set(this.companyLists[index], "jobNum", 0);
                  this.$set(this.companyLists[index], "cvNum", 0);
                }
              });
            } else {
              this.companyLists.forEach((c, index) => {
                this.$set(this.companyLists[index], "jobNum", 0);
                this.$set(this.companyLists[index], "cvNum", 0);
              });
            }
            this.loadTalents = false;
          });
        }
      });
    },
    //关键词搜索
    searchKeyWord() {
      this.currentNum = 1;
      this.searchField();
    },
    //blur 检查填写内容
    blurCheckType(type) {
      if (type == "usernameInput") {
        if (
          this.accoutData.username.trim() &&
          this.accoutData.username.indexOf(" ") < 0
        ) {
          this.$refs.usernameError.style.cssText += "display:none";
          this.$refs.usernameError.innerText = "";
          if (this.$refs.usernameInput.classList.contains("error_alert")) {
            this.$refs.usernameInput.classList.remove("error_alert");
          }
        }
      }
      if (type == "accountInput") {
        if (
          this.accoutData.usertel.trim() &&
          this.telReg.test(this.accoutData.usertel)
        ) {
          this.$refs.accountError.style.cssText += "display:none";
          this.$refs.accountError.innerText = "";
          if (this.$refs.accountInput.classList.contains("error_alert")) {
            this.$refs.accountInput.classList.remove("error_alert");
          }
        }
      }
      if (type == "mailInput") {
        if (
          this.accoutData.useremail.trim() &&
          this.emailReg.test(this.accoutData.useremail)
        ) {
          this.$refs.mailError.style.cssText += "display:none";
          this.$refs.mailError.innerText = "";
          if (this.$refs.mailInput.classList.contains("error_alert")) {
            this.$refs.mailInput.classList.remove("error_alert");
          }
        }
      }
    },
    //查看修改当前企业信息
    editCompanyInfor(id) {
      this.editId = id;
      this.addform = true;
      this.$store.commit("editCompanyInformation", id);
      this.isRegister = false;
    },

    checkoutStaff(item, num) {
      //获取投递人列表
      if (!num) return;
      this.showDeliver = true;
      //获取职位名称
      this.jobName = item.funcname;
      //获取pubid
      this.jobId = item.jobid;
    },
    //强制清空code内容
    clearSelectCode() {
      this.selected = "";
      let c = this.$refs.entRegion;
      if (c) {
        let selectContainer = c.getElementsByClassName("trigger_select")[0];
        if (selectContainer) {
          selectContainer.value = "";
        }
      }
    },
    //关闭企业新增表单
    closeAddForm() {
      this.initCom();
      this.editId = "";
      this.isRegister = true;
      //清除提示
      this.$refs.entSummary.classList.remove("error_alert");
      this.$refs.entName.classList.remove("error_alert");
      this.$refs.entCertId.classList.remove("error_alert");
      let r = this.$refs.entRegion.getElementsByClassName("trigger_select")[0];
      r.classList.remove("error_alert");
      $("#tipCompanyName").html("");
      $("#entSummary").html("");
      $("#tipLicenseId").html("");
      $("#tipLoc").html("");
    },
    //选择区域
    changeArea(datas) {
      //区域code
      let dataCode = "";
      if (datas.area) {
        dataCode = datas.area.code;
      } else if (datas.city) {
        dataCode = datas.city.code;
      } else {
        dataCode = datas.province.code;
      }
      this.entBaseInfo.entNation = dataCode;
      if (this.entBaseInfo.entNation) {
        let r = this.$refs.entRegion.getElementsByClassName(
          "trigger_select"
        )[0];
        if (r.classList.contains("error_alert")) {
          r.classList.remove("error_alert");
        }
        $("#tipLoc").html("");
      }
    },
    inputCheck(type) {
      if (this.entBaseInfo.entName && type == "entName") {
        if (!this.reg.test(this.entBaseInfo.entName)) {
          $("#tipCompanyName").html("请输入正确的公司名称");
        } else {
          $("#tipCompanyName").html("");
        }
      }

      if (this.entBaseInfo.entEmail && type == "entEmail") {
        if (!this.emailReg.test(this.entBaseInfo.entEmail)) {
          $("#tipEntEmail").html("请输入正确的企业邮箱");
        } else {
          if (this.$refs.tipEntEmail.classList.contains("error_alert")) {
            this.$refs.tipEntEmail.classList.remove("error_alert");
          }
          $("#tipEntEmail").html("");
        }
      }

      if (this.entBaseInfo.entCertId && type == "entCertId") {
        if (
          !this.licenseIdReg.test(this.entBaseInfo.entCertId) &&
          !this.isGoverment
        ) {
          $("#tipLicenseId").html("请输入正确的营业执照号码");
        } else {
          $("#tipLicenseId").html("");
          if (this.$refs.entCertId.classList.contains("error_alert"))
            this.$refs.entCertId.classList.remove("error_alert");
        }
      }
    },
    /**有值就去掉提示**/
    checkentName() {
      if (this.entBaseInfo.entName.trim()) {
        //搜索
        if (this.backUpName != this.entBaseInfo.entName) {
          this.backUpName = this.entBaseInfo.entName;
          this.searchDown = false;
          xz.searchRepetition(this.entBaseInfo.entName).then(res => {
            if (res) {
              this.searchDown = true;
              if (res.length > 0) {
                //如果有值
                const exist = res.find(
                  t => t.entName === this.entBaseInfo.entName
                );
                exist ? (this.isRegister = true) : (this.isRegister = false);
              } else {
                //没有值
                this.isRegister = false;
              }
              if (!this.isRegister) {
                $("#tipCompanyName").html("");
                if (this.$refs.entName.classList.contains("error_alert"))
                  this.$refs.entName.classList.remove("error_alert");
              }
            } else {
              console.log("企业名称查重出错");
            }
          });
        }
      } else {
        //，没有填写就清除提示
        this.searchDown = null;
        this.isRegister = true;
      }
    },
    checkentSummary() {
      if (this.entBaseInfo.entSummary.trim()) {
        $("#entSummary").html("");
        if (this.$refs.entSummary.classList.contains("error_alert"))
          this.$refs.entSummary.classList.remove("error_alert");
      }
    },
    /********/
    searchMatch() {
      //搜索匹配的企业
      let field = this.entBaseInfo.entName.trim();
      //do something
      if (field) {
        this.$store.commit("searchMatch", field);
      }
    },
    //翻页
    changeCompanyList(page) {
      this.currentNum = page;
      this.searchField();
      let companys = this.$refs.companys;
      let jobContainer = companys.getElementsByClassName("job_list_container");
      for (let i = 0; i < jobContainer.length; i++) {
        jobContainer[i].style.cssText += "display:none";
      }
      window.scrollTo(0, 0);
    },
    selectCom(com) {
      if (com.userId) {
        return;
      } else {
        //获取企业信息
        this.showResult = false;
      }
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
    //关闭职位发布页面
    closePublish() {
      this.addJobs = false;
      this.jobDetail = "";
    },
    handleClose(done) {
      const _this = this;
      if (this.purviews.manageJob) {
        this.$confirm("确认取消发布？")
          .then(_ => {
            done();
            this.jobDetail = "";
            //重置数据
            this.$store.commit("setJobInit");
          })
          .catch(_ => {});
      } else {
        _this.addJobs = false;
        _this.jobDetail = "";
      }
    },
    //关闭企业图片
    closeAssets(done) {
      console.log(this.editId);
      done();
    },
    //获取当前公司下的所有职位
    viewJob(entId, index, stretch) {
      this.entId = entId;
      const _this = this;
      let companys = this.$refs.companys;
      let jobContainer = companys.getElementsByClassName("job_list_container")[
        index
      ];
      let shaodow = jobContainer.getElementsByClassName("jobShadow")[0];
      shaodow.style.cssText += "display:flex";
      if (stretch) {
        jobContainer.style.display = "block";
      } else {
        jobContainer.style.display == "none"
          ? (jobContainer.style.display = "block")
          : (jobContainer.style.display = "none");
      }
      //获取职位
      xz.joblistInCompany(entId).then(res => {
        console.log(res);
        if (res) {
          res.forEach(item => {
            xz.codeToInfor(item.nation).then(inres => {
              if (inres.City == null) {
                item.nation = inres.Province;
              } else {
                item.nation = inres.City;
              }
            });
          });
          _this.$set(_this.companyLists[index], "jobs", res);
          _this.$set(_this.companyLists[index], "totalnum", res.length);
          _this.$set(_this.companyLists[index], "pagenum", 1);
          //jobid列表
          shaodow.style.cssText += "display:none";
          //获取职位申请人数
          if (!res) return; //如果没有职位
          let jobList = [];
          res.forEach(job => jobList.push(job.jobid));
          if (res.length > 0) {
            let showList = [];
            for (let i = 0; i < 10; i++) {
              if (res[i]) showList.push(res[i]);
            }
            _this.$set(_this.companyLists[index], "showList", showList);
          }
        } else {
          _this.$set(_this.companyLists[index], "showList", []);
          //jobid列表
          shaodow.style.cssText += "display:none";
        }
      });
    },
    //职位列表分页
    changeList(e, ind) {
      let jobs = this.companyLists[ind].jobs;
      //开始数
      let s = e - 1;
      let showList = [];
      for (let i = s * 10; i < (s + 1) * 10; i++) {
        if (jobs[i]) showList.push(jobs[i]);
      }
      this.$set(this.companyLists[ind], "showList", showList);
      this.$set(this.companyLists[ind], "pagenum", e);
    },
    //职位下线确认框
    outLineJob(item, entid, jindex, index) {
      this.outJobid = item.jobid;
      this.outEntid = entid;
      this.offLine = true;
      this.parIndex = jindex;
      this.offlineEntid = entid;
      this.offlineIndex = index;
    },
    //职位下线功能
    outLineAction() {
      this.offLine = false;
      xz.offlineJob(this.outJobid, this.outEntid).then(res => {
        if (res) {
          this.outJobid = "";
          this.outEntid = "";
          //重新获取职位
          this.viewJob(this.offlineEntid, this.offlineIndex, true);
        } else {
          alert("系统出错");
        }
      });
    },
    //新增修改企业信息
    funUpload() {
      //如果没有entNation,则赋值之前的
      if (!this.entBaseInfo.entNation) {
        this.entBaseInfo.entNation = this.selected;
      }
      if (!this.isPublish) {
        this.isPublish = true;
      } else {
        return;
      }
      let approve = true;
      if (!this.reg.test(this.entBaseInfo.entName)) {
        $("#tipCompanyName").html("请输入正确的公司名称");
        //.error_alert
        if (!this.$refs.entName.classList.contains("error_alert")) {
          this.$refs.entName.classList.add("error_alert");
        }
        approve = false;
      }
      if (
        !this.licenseIdReg.test(this.entBaseInfo.entCertId) &&
        !this.isGoverment
      ) {
        $("#tipLicenseId").html("请输入正确的营业执照号码");
        if (!this.$refs.entCertId.classList.contains("error_alert")) {
          this.$refs.entCertId.classList.add("error_alert");
        }
        approve = false;
      }
      if (!this.reg.test(this.entBaseInfo.entNation)) {
        let r = this.$refs.entRegion.getElementsByClassName(
          "trigger_select"
        )[0];
        if (!r.classList.contains("error_alert")) {
          r.classList.add("error_alert");
        }
        $("#tipLoc").html("请选择企业所在地");
        approve = false;
      }

      if (!this.entBaseInfo.entSummary.trim()) {
        //简介不能为空
        if (!this.$refs.entSummary.classList.contains("error_alert")) {
          this.$refs.entSummary.classList.add("error_alert");
        }
        approve = false;
      }
      //监测邮箱是否为空
      if (!this.emailReg.test(this.entBaseInfo.entEmail)) {
        if (!this.$refs.tipEntEmail.classList.contains("error_alert")) {
          this.$refs.tipEntEmail.classList.add("error_alert");
        }
        $("#tipEntEmail").html("请检查简历邮箱");
        approve = false;
      }
      if (!approve) {
        let box = document.getElementsByClassName("newEnt")[0];
        box.scrollTop = 0;
        this.isPublish = false;
      }
      if (this.isGoverment) {
        //如果是政府部门，手动创建营业执照
        if (this.oldCertId && this.oldCertId.indexOf("govcn") > 0) {
          this.entBaseInfo.entCertId = this.oldCertId;
        } else {
          this.entBaseInfo.entCertId = new Date().getTime() + "govcn";
        }
      }
      if (approve) {
        this.$set(this.entBaseInfo, "entAct", this.editId ? "edit" : "new");
        this.$set(this.entBaseInfo, "typesign", "ent");

        let dataList = {
          entid: this.editId
            ? this.editId
            : "",
          infor: this.entBaseInfo
        };
        const _this = this;
        
        //发布修改企业
        xz.publishCompany(dataList.entid,dataList.infor).then(res => {
          if (res) {
            this.isPublish = false;
            this.isRegister = true;
            alert("成功");
            _this.initCom();
            //重置原来的营业执照
            _this.oldCertId = "";
            _this.searchField();
            _this.editId = "";
            _this.addform = false;
          } else {
            this.isPublish = false;
            alert("请检查营业执照是否重复或手机号格式是否正确");
          }
        });
      }
    },
    //修改职位信息
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
    //查看当前机构下的企业
    searchCurrentAgency(e) {
      this.instnation = e;
      this.selectedRegion = e;
      this.searchField(); //获取数据
    },
    //生成企业码
    createCompanyCode(item) {
      xz.getTunnelInformation(Cookies.get("userid-b")).then(res => {
        let tunnel = res.find(r => r.StrPipName == "面试签到");
        xz.getTunnelPath(
          tunnel.GdPipId,
          item.entId,
          item.entName,
          "",
          Cookies.get("userid-b")
        );
      });
    },
    //获取职位的审核历史
    getJobHisotry(i) {
      this.rejectLoad = true;
      xz.jobIdentifyHistory(i.jobid).then(res => {
        if (res) {
          let list = res;
          list.forEach(l => {
            l.date = this.$store.getters.formatDate(l.datetime);
          });
          this.rejectReasonList = list;
        } else {
          console.log("获取职位审核历史失败");
        }
        this.rejectLoad = false;
      });
    },

    setImg(i, item) {
      console.log(i);
      console.log(item);
      this.posterJob = `【${i.shortentname}】${i.jobname}`;
      this.ifshowimg = true;
      this.bgcodeimg = "";
      //获取账号信息
      xz.accountInformation().then(account => {
        let data  = {
          username: account.StrUserName,
          userid: account.GdUserId,
          usertel: account.StrUserMobile
        }
        xz.addBroker(data).then( broker => {
          if(broker){
            //生成经济人企业码
            let brokerData = {
              linktype: "J",
              userid: account.GdUserId,
              linkid: i.pubid,
              otherinf: "",
              codeid: "",
              idxpath: "pages/jobDetail/jobDetail"
            }
            xz.createPromo(brokerData).then(brokerCode => {
              poster({
                poster: "job",
                hourPay: i.hourPay,
                logourl: item.entImage ? "https://www.azhiye.com/cloudimg/" + item.entImage : "",
                codeurl: brokerCode ? "https://www.azhiye.com/cloudimg/" + brokerCode : "",
                entName: i.shortentname,
                fullEntName: item.entName,
                entClass: item.entClass,
                entScale: item.entScale,
                jobname: i.jobname,
                salary: i.salary,
                nation: i.nation,
                exp: i.exp,
                edu: i.edu,
                post: i.post
              }).then(img => {
                this.bgcodeimg = img;
              });
            })
          }
        })
      })
    },
    
    drawEntText(ent) {
      this.posterEnd = `【${ent.entName}】`;
      this.ifshowentimg = true;
      this.entbgcodeimg = "";
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
              linkid: ent.entId,
              otherinf: "",
              codeid: "",
              idxpath: "pages/companyDetail/companyDetail"
            }
            xz.createPromo(brokerData).then(brokerCode => {
              xz.getCompanyInformation(ent.entId).then( detail => {
                let nation = detail.entNation;
                let nationOjb = this.$store.getters.codeToggleObj(nation);
                let nationName = this.$store.getters.localName(nationOjb);
                poster({
                  poster: "ent",
                  logourl: ent.entImage ? "https://www.azhiye.com/cloudimg/" + ent.entImage : "",
                  codeurl: brokerCode ? "https://www.azhiye.com/cloudimg/" + brokerCode : "",
                  entName: ent.entName,
                  entClass: ent.entClass,
                  entScale: ent.entScale,
                  entProfile: detail.entSummary,
                  jobNum: ent.jobNum,
                  entNation: nationName,
                  entAdd: detail.entAdd
                }).then(img => {
                  this.entbgcodeimg = img;
                });
              })
            })
          }
        })
      })
    }
  }
};
</script>
<style scoped>
.isRegister {
  position: absolute;
  right: 120px;
  top: 0;
  line-height: 45px;
}
.alreadyRegister input {
  border: 1px dashed #c82a2e !important;
}
.registerLoad {
  width: 25x !important;
  height: 25px !important;
  display: block;
  position: relative;
  top: 10px;
}
.qcodeBtn {
  padding: 0 !important;
  border: none !important;
}
.qcodeBtn:hover {
  background: #fff !important;
}
.qcodeShadow,
.qcodeImg,
.qcodeContainer {
  width: 200px;
  display: block;
  position: relative;
}
.qcodeShadow {
  display: flex !important;
  align-items: center;
}
.qcodeShadow .loadImg {
  width: 30px;
  height: 30px;
  display: block;
  margin: 0 auto;
}
.rejectHistory {
  border-radius: 3px;
  background: #fff;
  width: 100%;
}
.rejectTitle {
  font-size: 14px;
  font-weight: bold;
  color: #333;
  line-height: 30px;
  margin-bottom: 5px;
}
.rejectTable {
  width: 100%;
}
.rejectTable thead th {
  font-size: 14px;
  border-bottom: 1px solid #ddd;
  padding: 10px 0;
}
.rejectTable th {
  font-size: 12px;
  color: #333;
}
.rejectItem {
  border-bottom: 1px solid #ddd;
}
.rejectItem th {
  padding: 10px 0;
}
.rejectItem:last-child {
  border-bottom: 0;
}
.rejectLoadContainer {
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.rejectLoadContainer .loadImg {
  width: 30px;
  height: 30px;
  display: block;
}
.checkCurrentAgency {
  font-size: 14px;
  height: 38px;
  outline: none;
  box-shadow: none;
  border: 1px solid #ddd;
  border-radius: 5px;
  background: #fff;
  padding: 0 10px;
  margin-left: 20px;
}
.selectCurrentAgency {
  color: #fff !important;
  background: #409eff !important;
}
.selecteArea {
  margin-left: 20px;
}
.posterContainer {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-start;
}
</style>
<style>
.selecteArea .el-input__inner {
  height: 45px;
}
</style>