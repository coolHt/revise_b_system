<template>
  <div class='inforSet' ref="publishJob">
    <div class="loadShadowGif"
      style="position:fixed;left:0;right:0;bottom:0;top:0;z-index:999;display:flex;align-items:center;" v-show="isLoad">
      <i class="loadgif"></i>
    </div>
    <div class="jobdetailForm">
      <div>
        <h1 class="addCompanyTitle">{{entName}}</h1>
        <h4 class="addJobTitle">新增职位</h4>
        <hr>
        <div class="card-content checkForm">
          <div class="draft-job" style="margin-top:20px;">
            <h5>公司信息</h5>
          </div>
          <div class="infor_field">
            <div class="infor_field">
              <label class="field_name"> <span style="color:#f38480 !important;">*</span>企业对外简称：</label>
              <div class="shortNameContainer">
                <input type="text" name="" class="jobNameInput" v-model="shortName" @input="checkShortName" ref="shortNameInput">
                <p class="textAlarm">字数 {{shorts}} / {{shortLimit}}</p>
              </div>
              <p style="display:block;width: 100%;box-sizing:border-box;padding-left: 150px;">提示: 可输入公司缩写或品牌名，如 "智士网络" 或 "心职"</p>
          </div>
          </div>
          <div class="draft-job">
            <h5>基本信息</h5>
          </div>
          <div class="infor_field">
            <label class="field_name"> <span style="color:#f38480 !important;">*</span>职位名称：</label>
            <input type="text" name="" class="jobNameInput" v-model="entJobName" @input="checkNumber">
            
            <span style="display:block;width: 100%;box-sizing:border-box;padding-left: 150px;">字数 {{inputJobNameLength}} / {{textLength}}</span>
          </div>
          <div class="infor_field">
              <label class="field_name">工作类型：</label>
              <div>
                <el-radio-group v-model="entJobWorkType" @change="changeType">
                  <el-radio-button :label="type" v-for="(type,index) in $store.state.PUBLISH.jobType" :key="index">
                    {{type}}
                  </el-radio-button>
                </el-radio-group>
              </div>
            </div>
          <div class="infor_field">
            <label class="field_name"> <span style="color:#f38480 !important;">*</span>职能分类：</label>
            <role :roleList="editObj.entJobFun" @returnRole="getRoleValue" ref="roleInput"></role>
            <div>
              <IdentifyInput class="identify" labelText="招聘人数：" :mustFill="true" :width="recruitWidth"
                :inputValue="entJobNum.value" :valueVerify="entJobNum.identifyType" @returnValue="getEntJobNum" category="number"></IdentifyInput>
            </div>
            <div class="anyRecruit" @change="selectInfinite">
              <el-checkbox v-model="infiniteNumber">若干</el-checkbox>
            </div>
          </div>
          
          <div class="infor_field">
            <label class="field_name">所属部门(子公司)：</label>
            <div>
              <input name="part" type="text" placeholder="输入部门或子公司" v-model='editObj.entJobPart'>
            </div>
          </div>
          
          <div class="infor_field">
            <div class="draft-job" style="margin-top:50px;">
              <h5>主要信息</h5>
            </div>
            <div class="infor_field" style="align-items:unset;">
              <label class="field_name">职位描述：</label>
              <div>
                <textarea rows="14" cols="10" placeholder="岗位说明" v-if="editObj.JobPost" v-model='editObj.JobPost'
                  class="jobDetail"></textarea>
                <textarea rows="14" cols="10" placeholder="岗位说明" v-else v-model='editObj.entJobExplan'
                  class="jobDetail"></textarea>
                <br>
                <small>注：要求中请勿填写涉及歧视的内容，例如：残疾，乙肝等</small>
              </div>
            </div>
            
            <div class="infor_field" style="align-items:unset">
              <label class="field_name">工作薪资：</label>
              <div style="width:650px;display:flex;">
                <div>
                  <input class="xz_salaryInput" type="number" v-model.number="entJobMinPay.value"
                      :class="{'error_alert':entJobMinPay.empty}" @blur="checkSalaryEmpty('min')">
                  <span class="error_alert_error" v-if="entJobMinPay.empty">请填写最小薪资</span>
                </div>
                <span style="line-height:45px;"> 千元</span>
                <span style="margin:0 6px;line-height:45px;">至</span>
                <div>
                  <input class="xz_salaryInput" type="number" v-model.number="entJobMaxPay.value"
                      :class="{'error_alert':entJobMaxPay.empty}" @blur="checkSalaryEmpty('max')">
                  <span class="error_alert_error" v-if="entJobMaxPay.empty">请填写最大薪资</span>
                  <span style="line-height:45px;"> 千元</span>
                </div>
                <span style="margin:0 6px;line-height:45px;">*</span>
                <div>
                  <input class="xz_salaryInput" type="number" v-model.number="entJobPayMonth.value"
                      :class="{'error_alert':entJobPayMonth.empty}" @blur="checkSalaryEmpty('month')">
                  <span class="error_alert_error" v-if="entJobPayMonth.empty">月份不能少于12个月</span>
                </div>
                <span style="line-height:45px;"> 个月</span>
                <span style="line-height:45px;">=
                    <span style="line-height:45px;font-size:20px;color:rgb(200, 42, 46) !important;">{{totalPay(entJobMinPay.value,entJobMaxPay.value,entJobPayMonth.value)}}元/年</span>
                  </span>
              </div>
              <span v-if="salaryPale" class="error_alert_error" style="margin-left:150px;">最小薪资不能大于最大薪资，并且最大薪资不能超过最小薪资的三倍</span>
              <br>
              <small style="margin-top:10px;display:block;margin-left:150px;">注：请输入年薪范围, 最大薪资不能超过最小薪资的3倍</small>
            </div>
            <div class="infor_field" style="align-items:unset">
              <label class="field_name">时薪：</label>
              <div style="width:650px;display:flex;">
                <div>
                  <input @blur="checkPerThing" class="xz_salaryInput" type="number" v-model.number="perThing.value"
                      :class="{'error_alert':perThing.empty}">
                  <span class="error_alert_error" v-if="perThing.empty">请填写时薪</span>
                </div>
                <span style="line-height:45px;margin-left:10px"> / 小时</span>
              </div>
            </div>
            <div class="infor_field" style="align-items:unset" v-if="missionShow">
              <label class="field_name">佣金：</label> <!--coin-->
              <div style="width:650px;display:flex;">
                <div>
                  <input class="xz_salaryInput" type="number" v-model.number="commission">
                </div>
                <span style="line-height:45px;margin-left:10px"> 元</span>
              </div>
            </div>

            <div class="infor_field" style="align-items:unset;">
              <label class="field_name">职位福利：</label>
              <div class="wealfareBtns">
                <div class="chooseWealfare">
                  <el-tag :key="index" v-for="(tag,index) in entWelfareTag" closable :disable-transitions="false"
                    @close="handleWelfare(entWelfareTag,tag)" class="tag">
                    {{tag}}
                  </el-tag>
                </div>
                <el-button v-for='(tag,tagIndex) in $store.state.PUBLISH.welfareTag' style="margin:5px;" :key="tagIndex"
                  @click='funAddTag(entWelfareTag,tag,tagIndex)'>{{tag}}
                </el-button>
                <div style="width:100%;">
                  <input type="text" v-model="newWelfareBtn" style="width:160px;margin:5px;height:40px;">
                  <el-button size='small' class="addTag" @click="newWelfare">新增福利</el-button>
                </div>
              </div>
            </div>
            <div class="infor_field">
              <label class="field_name">工作经验：</label>
              <div style="width:550px;">
                <el-radio-group v-model="entJobWorkTime" @change="changeExp">
                  <el-radio-button v-for="(tag,index) in $store.state.PUBLISH.workTimeTag" :key="index" :label="tag">
                    {{tag}}
                  </el-radio-button>
                </el-radio-group>
              </div>
            </div>
            <div class="infor_field">
              <label class="field_name">学历：</label>
              <div class="eduContainer">
                <el-radio-group v-model="entJobEdu" @change="changeEdu">
                  <el-radio-button v-for="(tag,index) in $store.state.PUBLISH.eduTag" :key="index" :label="tag">{{tag}}
                  </el-radio-button>
                </el-radio-group>
                <el-checkbox label='统招' v-model='editObj.entJobEduChecked' style="margin-left:10px;"></el-checkbox>
              </div>
            </div>
            <div class="infor_field">
              <label class="field_name">外语：</label>
              <div>
                <div v-show="otherLang" v-for='(item,index) in langTag' :key='index'
                  style="padding-top:5px;margin-bottom:10px;">
                  <el-tag v-if="currentInitLange != '不限'" closable @close='handleClose(langTag,item,"language")'>
                    {{item.name}}</el-tag>
                  <el-rate v-if="currentInitLange != '不限'" style="display:inline-block" v-model='item.level' show-text
                    :texts="$store.state.PUBLISH.langLevel"></el-rate>
                </div>
                <div style="margin-top:5px;display:flex">
                  <el-radio-group v-model="currentInitLange" @change="changeLanguage">
                    <el-radio-button v-for="(tag,index) in $store.state.PUBLISH.languageTag" :key="index" :label="tag">
                      {{tag}}
                    </el-radio-button>
                  </el-radio-group>
                  <div v-show="otherLanguage" class="languageAdd">
                    <el-input class="input-new-tag" v-model="inputNewLangTag" size="small">
                    </el-input>
                    <el-button size='small' @click='funAddLangTag(inputNewLangTag)'>新增</el-button>
                  </div>
                </div>
              </div>
            </div>
            <!--标签组件-->
            <TagsCombine :entJobKnowTagList="entJobKnowTag" :entJobSkillTagList="entJobSkillTag"
              :entJobToolTagList="entJobToolTag" :entJobOtherTagList="entJobOtherTag" ref="tagscombine"></TagsCombine>
            <div class="infor_field">
              <label class="field_name"><span style="color:#f38480 !important;">*</span>工作地点：</label>
              <div style="display:flex;align-items:center;flex-wrap:wrap;">
                <MRegion class="custom-region" :fullrange="true" :selected="selected" @cRegion="getRegion" :search="true"
                  ref="provinceSelect"></MRegion>
                <span class="locateSplit">/</span>
                <IdentifyInput class="identify" :mustFill="true" :inputValue="entJobAdd.value"
                  :valueVerify="entJobAdd.identifyType" width="200px" @returnValue="getEntJobAdd">
                </IdentifyInput>
                <p ref="constrainRegion" class="constrainRegion">必须选择到市或市以下</p>
              </div>
            </div>  
            <!--面试设置-->
            <InterviewSetting ref="interviewData" :interviewSelected="interviewSelected" :interviewAdd="interviewAdd" :cName="contactName" :cCode="contactPhone" :interiviewList="interviewList"></InterviewSetting>
            <div class="infor_field">
              <span class="manageLocality" @click="addStore">添加门店</span>
            </div>
            <!---->
            <div class="form_save publishBtn" v-if="purviews.manageJob">
              <button type="button" class="btn-search"
                @click="cancalPublish = true">{{isPublish?'取消发布':'取消修改'}}</button>
              <button type="button" class="btn-search" @click="funUpload"
                style="color:#fff;background:#5f4b8b">{{isPublish?'发布职位':'修改职位'}}</button>
            </div>
            <!--职能 (假装是插件)-->
            <el-dialog title="选择职能" :visible.sync="jobfunVisible" width="1000px" :append-to-body="true">
              <JobFun @value="returnFun"></JobFun>
            </el-dialog>
            <!--发布成功后弹窗-->
            <el-dialog :visible.sync="publishSuccess" width="400px" style="overflow: hidden;" class="publishSuccess"
              :close-on-click-modal="false" :append-to-body="true">
              <h1>发布成功!</h1>
              <div class="publishOperate">
                <a @click="proceed">继续添加新职位</a>
                <a @click="backRoute">确定</a>
              </div>
            </el-dialog>
            <!--取消发布弹窗-->
            <el-dialog :visible.sync="cancalPublish" width="400px" style="overflow: hidden;" class="publishSuccess"
              :close-on-click-modal="false" @close="cancalPublish = false" :append-to-body="true">
              <h1>{{cancelText}}</h1>
              <div class="publishOperate">
                <a @click="cancalPublish=false">取消</a>
                <a @click="backRoute">确定</a>
              </div>
            </el-dialog>
            <!--编辑成功后弹窗-->
            <el-dialog :visible.sync="editSuccess" width="400px" style="overflow: hidden;" class="publishSuccess"
              :close-on-click-modal="false" :append-to-body="true" @close="backRoute">
              <h1>修改成功!</h1>
              <div class="publishOperate">
                <a @click="backRoute">确定</a>
              </div>
            </el-dialog>
          </div>
        </div>
      </div>
    </div>
    <!--管理门店-->
    <el-dialog :visible.sync="manageAddress" width="1200px" :close-on-click-modal="false" :append-to-body="true" @close="closeType = true">
      <ManageAddress :interviewList="interviewMatch" :name="entJobName"
        :num="entJobNum.value !== undefined ? entJobNum.value : 1" :initCode="selected" :address="entJobAdd.value"
        :entId="entid" 
        :allAddress="allAddress" :jobId="this.dataDetail.jobid ? this.dataDetail.jobid : ''" :closeType="closeType"
        @initCloseManageAddress="initCloseManageAddress"></ManageAddress>
    </el-dialog>
  </div>
</template>
<script>
  import xz from '../common';
  import JobFun from '../plugins/JOBFUN';
  //职能数据
  import funData from '../store/funData';
  //地址管理
  import ManageAddress from '../components/manageAddress';
  //面试设置管理
  import InterviewSetting from '../components/publish/interviewSetting';
  //输入框
  import IdentifyInput from '../components/form/textInput';
  //标签组件
  import TagsCombine from '../components/publish/tagsCombine';
  //职能
  import role from "../components/widgets/role-widget";
  export default {
    components: {
      JobFun,
      ManageAddress,
      InterviewSetting,
      IdentifyInput,
      TagsCombine,
      role
    },
    props: {
      project: {
        type: String,
        default: ""
      },
      entid: {
        type: String,
        default: ''
      },
      dataDetail: "",
      entName: {
        type: String,
        default: ''
      },
      //所有的面试信息
      allInterview: []
    },
    data() {
      return {
        // 佣金
        commission: "", 
        //是否是若干
        infiniteNumber: false,
        recruitWidth: "150px",
        shortLimit: 5, //简称限制
        shorts: "", //已输入简称名字
        //地址管理
        manageAddress: false,
        //面试设置
        isInterview: true,
        //
        funData: funData, //职能数据
        selected: '', //初始化地址
        jobfunVisible: false, //是否显示职能
        publishSuccess: false, //发布成功后弹框
        cancalPublish: false, //是否取消发布
        editSuccess: false, //编辑成功后
        welfareItems: [], //选中的标签
        inputNewLangTag: "", //填写的语言
        searchResult: [], //关键字结果集
        hasResult: false, //判断是否有结果
        newWelfareBtn: '',
        currentInitLange: '英语',
        langTag: [], //外语
        editObj: {},
        //cancel文字
        cancelText: '',
        //是发布还是编辑
        isPublish: true,
        isLoad: false, //遮罩层
        //管理门店关闭状态
        closeType: false,
        //所有的门店集合
        addressList: [],
        /**字段**/
        entJobName: "",
        entJobAdd: {
          value: '',
          identifyType: 'empty'
        },
        entJobNum: {
          value: '',
          identifyType: 'number'
        },
        perThing: {
          value: "",
          empty: false
        },
        entJobMinPay: {
          value: 5,
          empty: false
        },
        entJobMaxPay: {
          value: 8,
          empty: false
        },
        entJobPayMonth: {
          value: 12,
          empty: false
        },
        shortName: "",
        //标签
        entJobKnowTag: [],
        entJobSkillTag: [],
        entJobToolTag: [],
        entJobOtherTag: [],
        //福利
        entWelfareTag: [],
        //面试组件的地点
        interviewSelected: "",
        interviewAdd: "",
        //所有的门店
        allAddress: [],
        //匹配到的面试设置
        interviewMatch: {},
        entJobEdu: '',
        entJobWorkTime: '',
        //运营公司名
        operationName: "",
        //薪资超范围提醒
        salaryPale: false,
        //输入的字数
        inputJobNameLength: 0,
        //限制字数长度
        textLength: 12,
        //企业默认联系人号码
        contactPhone: "",
        //企业默认联系人姓名
        contactName: "",
        //
        entJobWorkType: "全职",
        // 显示佣金
        missionShow: false
      }
    },
    created() {
      if (this.$route.name == 'Edit') { //修改获取jobid ，请求job数据
        let jobid = this.$route.query.jobid;
        this.$store.commit('setJobid', jobid);
        this.cancelText = '是否取消编辑?';
        this.isPublish = false;
      } else {
        this.cancelText = '是否取消发布?';
        this.isPublish = true;
      }
      document.addEventListener('click', (e) => {
        if (e.target.classList[0]) {
          let v = e.target.classList[0];
          if (this.$refs.jobFunInput) {
            if (this.$refs.jobFunInput.getElementsByClassName(v).length == 0 && v !=
              'jobFunInput' && v != 'mustFill') {
              this.hasResult = false;
            }
          }
        }
      }, false)
    },
    computed: {
      //权限
      purviews() {
        return this.$store.state.purview;
      },
      totalPay: function () {
        return function (min, max, n) { //小 大 月
          if (!min || !max || !n) {
            return 0
          }
          var rMin = (min * parseInt(n) / 10).toFixed(1);
          var rMax = (max * parseInt(n) / 10).toFixed(1);
          this.editObj.entJobPay = rMin + '-' + rMax + '万';
          return this.editObj.entJobPay;
        }
      },
      otherLanguage() { //显示新增语言输入框
        return this.$store.state.PUBLISH.otherLanguage;
      },
      otherLang() { //显示选择的语言
        return this.$store.state.PUBLISH.otherLang;
      },
    },
    watch: {
      'dataDetail': {
        handler: function () {
          // 佣金显示
          if(Cookies.get("userid-b") === "04F97C95-DF0F-4E4F-90DB-234E969EB323" || Cookies.get("userid-b") === "a8034cc9-ea31-4df2-91f6-33b375253d4d"){
            this.missionShow = true;
          }
          this.dataDetail != 'add' ? Object.assign(this.editObj, this.dataDetail) : this.editObj = this.$store.state.PUBLISH
            .jobInfo; 
          if(this.dataDetail){
            this.entJobEdu = this.editObj.entJobEdu;
            this.entJobWorkTime = this.editObj.entJobWorkTime;
            this.entJobWorkType = this.editObj.entJobWorkType;
            
            if(this.editObj.entJobName.length >= this.textLength){
              this.entJobName = this.editObj.entJobName.slice(0, this.textLength);//职位名称
              this.inputJobNameLength = this.textLength;
            }else{
              this.entJobName = this.editObj.entJobName;//职位名称
              this.inputJobNameLength = this.editObj.entJobName.length;
            }
            //时薪
            if(this.dataDetail.hourPay){
              this.perThing = {
                value: this.dataDetail.hourPay,
                empty: false
              }
            }
            //简称
            if(this.editObj.shortEntName){
              let sName = this.editObj.shortEntName.trim();
              if(sName.length > this.shortLimit){
                sName = sName.slice(0, this.shortLimit);
                this.shorts = this.shortLimit;
              }else{
                this.shorts = sName.length;
              }
               this.shortName = sName;
            }else{
              this.shortName = "";
              this.shorts = 0;
            }

            //如果有jobid
            if (this.editObj.jobid) {//获取门店列表
              this.getInterviewInformation(this.editObj.jobid, this.editObj.entid);
              //获取门店列表
              xz.getJobsStore(this.entid, this.editObj.jobid).then( list => {
                let storeList = [];
                if(list){
                  list.forEach( l => {
                    if(l.entAddr != this.entJobAdd.value || l.entNation != this.selected || l.entRemark != this.entJobName){
                      storeList.push(l);
                    }
                  })
                  this.allAddress = storeList;
                }else{
                  console.log("获取门店列表出错")
                }
              } );
            }
            if (this.editObj.entJobAdd) { //如果有详细地址直接拿职位数据的，否则请求企业信息，拿企业的地址
              //默认面试地点 ////详细地址
              this.$set(this.entJobAdd, "value", this.editObj.entJobAdd);
              this.selected = this.editObj.entJobNation;
              this.interviewSelected = this.editObj.entJobNation;
            } else { //获取企业信息
              xz.getCompanyInformation(this.entid).then(res => {
                if (res) {
                  //默认面试地点 ////详细地址
                  this.$set(this.entJobAdd, "value", res.entAdd);
                  this.interviewAdd = res.entAdd;
                  this.selected = res.entNation;
                  //默认面试城市
                  this.interviewSelected = res.entNation;
                  //联系人姓名
                  this.contactName = res.entConName;
                  //联系人手机号
                  this.contactPhone = res.entConTel;
                } else {
                  console.log("获取企业信息出错");
                }
              })
            }
            //获取所有标签
            this.getTagFromData(this.editObj, "entJobKnowTag");
            this.getTagFromData(this.editObj, "entJobSkillTag");
            this.getTagFromData(this.editObj, "entJobToolTag");
            this.getTagFromData(this.editObj, "entJobOtherTag");
            this.getTagFromData(this.editObj, "entWelfareTag");
            // 佣金
            this.commission = this.editObj.coin ? this.editObj.coin : "";
            this.$set(this.entJobNum, "value", this.editObj.entJobNum); //招聘人数
            if(this.editObj.entJobNum === 0){
              this.infiniteNumber = true;
              this.recruitWidth = "0px";
            }
            //赋值薪资和月数
            this.$set(this.entJobMinPay, "value", this.editObj.entJobMinPay);
            this.$set(this.entJobMaxPay, "value", this.editObj.entJobMaxPay);
            this.$set(this.entJobPayMonth, "value", this.editObj.entJobPayMonth);
            //语言
            let langName, langLevel = "";
            if(this.editObj.entJobLang){
              let lang;
              if(Array.isArray(this.editObj.entJobLang)){
                lang = this.editObj.entJobLang[0];
              }else{
                lang = JSON.parse(this.editObj.entJobLang)[0];
              }
              langName = lang.name;
              langLevel = lang.level;
            }else{
              langName = "不限";
              langLevel = 3;
            }
            this.langTag = [{
              name: langName,
              level: langLevel
            }];
            this.currentInitLange = langName;
          }
        },
        immediate: true
      }
    },
    methods: {
      changeType(e){
        this.$set(this.perThing, "empty", false);
        
      },
      checkPerThing(){
        if(this.perThing.value){
          this.$set(this.perThing, "empty", false);
        }
      },
      //选择是否是若干人员
      selectInfinite(){
        this.recruitWidth = this.infiniteNumber ? "0px" : "150px";
        this.entJobNum = {
          value: this.infiniteNumber ? 0 : 1,
          identifyType: 'number'
        }
      },
      //获取选择的数据
      getRoleValue(v){
        this.$set(this.editObj, "entJobFun", v);
        if(this.$refs.roleInput){
          let roleCon = this.$refs.roleInput.$el;
          let role = roleCon.getElementsByClassName("roleInput")[0];
          if(role){
            role.classList.remove("error_alert");
          }
        }
      },
      //监听输入字符
      checkNumber(){
        this.inputJobNameLength = this.entJobName.length;
        if(this.inputJobNameLength >= this.textLength){
          this.entJobName = this.entJobName.slice(0, this.textLength);
          this.inputJobNameLength = this.textLength;
        }
      },
      //赋值方法
      getEntJobNum(v) {
        this.$set(this.entJobNum, "value", v);
      }, //招聘人数
      getEntJobAdd(v) {
        this.$set(this.entJobAdd, "value", v)
      }, //详细地址
      //初始化门店关闭
      initCloseManageAddress(list) {
        this.addressList = list;
        this.closeType = false;
        this.manageAddress = false;
      },
      //检查职能分类
      checkentjobfun() {
        if (this.editObj.entJobFun.trim()) {
          if (this.$refs.jobFunInput.classList.contains('error_alert')) {
            this.$refs.jobFunInput.classList.remove('error_alert');
          }
        }
      },
      getRegion(region) { //获取工作地点
        if (region.area) {
          this.editObj.entJobNation = region.area.code;
          this.selected = region.area.code;
        } else if (region.city) {
          this.editObj.entJobNation = region.city.code;
          this.selected = region.city.code;
        } else if (region.province) {
          this.editObj.entJobNation = region.province.code;
          this.selected = region.province.code;
        }
        if (this.editObj.entJobNation) {
          if (this.$refs.provinceSelect.$el.getElementsByClassName("trigger_select")[0].classList.contains(
              'error_alert')) {
            this.$refs.provinceSelect.$el.getElementsByClassName("trigger_select")[0].classList.remove('error_alert');
          }

          this.$refs.constrainRegion.style.cssText += "display:none";
        }
      },
      handleWelfare(arr, item) { //关闭福利
        arr.splice(arr.indexOf(item), 1);
        //去掉相应删除的样式
        let wealfareBtns = document.getElementsByClassName('wealfareBtns')[0].getElementsByClassName(
          'el-button');
        this.welfareItems.forEach(function (v) {
          if (v.tagName == item) {
            wealfareBtns[v.tagIndex].classList.remove('chooseBtn');
          }
        });
      },
      //添加门店验证
      addStore() {
        this.manageAddress = true
      },
      //关闭语言选择
      handleClose(arr, item, type) {
        if (type) {
          if (type == 'language') this.currentInitLange = '不限';
        }
        arr.splice(arr.indexOf(item), 1);
      },
      funAddTag: function (item, value, index) { //选中福利
        let wealfareBtns = document.getElementsByClassName('wealfareBtns')[0].getElementsByClassName(
          'el-button');
        wealfareBtns[index].classList.add('chooseBtn');
        var a = 0;
        if (value) {
          for (var i in item) {
            if (item[i] == value) a++;
          }
          if (!a) {
            this.welfareItems.push({
              tagName: value,
              tagIndex: index
            });
            item.push(value);
          } else {
            return
          }
        }
      },
      //自定义福利
      newWelfare() {
        let item = this.entWelfareTag;
        let v = this.newWelfareBtn;
        var a = 0;
        if (v) {
          for (var i in item) {
            if (item[i] == v) {
              a++
            }
          }
          if (!a) {
            this.welfareItems.push({
              tagName: v,
              tagIndex: this.entWelfareTag.length
            });
            item.push(v);
          } else {
            return
          }
        }
        this.newWelfareBtn = '';
      },
      //检查简称字数
      checkShortName(){
        this.$refs.shortNameInput.classList.remove('error_alert');
        if(this.shortName.length > this.shortLimit){
          this.shortName = this.shortName.slice(0, this.shortLimit);
          this.shorts = this.shortLimit;
        }else{
          this.shorts = this.shortName.length
        }
      },
      //新增语言
      funAddLangTag(value) {
        if (!value.trim()) return;
        this.$store.commit("setOtherLanguage", false);
        this.$store.commit("setOtherLang", true);
        if (value == '英语' || value == '德语' || value == '日语') {
          this.currentInitLange = value;
        }
        this.langTag = [{
          level: 3,
          name: value
        }];
      },
      changeLanguage(data) { //选择语言
        if (!this.langTag[0]) {
          this.langTag = [{
            name: data,
            level: 3
          }]
        }
        this.langTag[0].name = data;
        this.$store.commit("changeLanguage", data);
      },
      changeEdu(v) {this.entJobEdu = v;},
      changeExp(v) {this.entJobWorkTime = v;},
      //去除薪资提示
      checkSalaryEmpty(t){
        if(t == "min"){
          if(this.entJobMinPay.value) this.$set(this.entJobMinPay, "empty", false);
          this.salaryPale = false;
        }else if(t == "max"){
          if(this.entJobMaxPay.value) this.$set(this.entJobMaxPay, "empty", false);
          this.salaryPale = false;
        }else if(t == "month"){
          if(this.entJobPayMonth.value && this.entJobPayMonth.value >= 12){
            this.$set(this.entJobPayMonth, "empty", false); 
          }
        }
      },
      funUpload() { //发布
        let noFill = false;
        const t = this.getTags();
        //设置标签和福利
        this.editObj.entJobKnowTag = t.entJobKnowTag;
        this.editObj.entJobSkillTag = t.entJobSkillTag;
        this.editObj.entJobToolTag = t.entJobToolTag;
        this.editObj.entJobOtherTag = t.entJobOtherTag;
        this.editObj.entWelfareTag = this.entWelfareTag;
        if(!this.entJobName) noFill = true;
        let _this = this;
        //判断未填项
        let fill = this.$refs.publishJob.getElementsByClassName('mustFill');
        for (let i = 0; i < fill.length; i++) {
          if (fill[i].value == '') {
            noFill = true;
            fill[i].classList.add('error_alert');
          }
        }
        //如果没有填写简称
        if(!this.shortName){
          noFill = true;
          this.$refs.shortNameInput.classList.add('error_alert');
        }
        if (!this.selected) { //如果没有选择地区
          this.$refs.provinceSelect.$el.getElementsByClassName("trigger_select")[0].classList.add('error_alert');
        }
        if (!this.entJobMinPay.value) { //未填写最小信息
          noFill = true;
          this.$set(this.entJobMinPay, "empty", true);
        }
        if (!this.entJobMaxPay.value) { //未填写最大薪资
          noFill = true;
          this.$set(this.entJobMaxPay, "empty", true);
        }
        if (!this.entJobPayMonth.value || this.entJobPayMonth.value < 12) { //没有填写月份
          noFill = true;
          this.$set(this.entJobPayMonth, "empty", true);
        }
        if (this.entJobMinPay.value > this.entJobMaxPay.value || (this.entJobMaxPay.value / this.entJobMinPay.value) > 3) { //如果最低信息大于最高薪资
          this.salaryPale = true;
          noFill = true;
        }
        //判断是否填写职能
        if(!this.editObj.entJobFun.trim()){
          let roleCon = this.$refs.roleInput.$el;
          let role = roleCon.getElementsByClassName("roleInput")[0];
          if(role){
            role.classList.add("error_alert");
          }
          noFill = true;
        }
        
        this.editObj.entJobLang = JSON.stringify(this.langTag); // 语言格式转换
        //时薪
        this.editObj.entJobWorkType = this.entJobWorkType;
        if(this.entJobWorkType == "小时工日结"){
          if(!this.perThing.value){
            noFill = true;
            this.$set(this.perThing, "empty", true);
          }
        }
        this.editObj.hourpay = this.perThing.value;
        // ? 
        this.editObj.coin = this.commission ? this.commission : "";
        this.editObj.entJobEdu = this.entJobEdu;
        this.editObj.entJobWorkTime = this.entJobWorkTime;
        this.editObj.JobPost ? this.editObj.entJobExplan = this.editObj.JobPost : this.editObj.entJobExplan = this
          .editObj.entJobExplan;
        //门店数组
        let entJobAddrInfo = [];
        const store = _this.$store.getters;
        //code转名称
        let address = store.codeToggleObj(_this.selected);
        let addressName = store.localName(address, ","); //名称
        //完整地址
        if (_this.entJobAdd.value) addressName += "," + _this.entJobAdd.value;
        //调用腾讯地址转坐标接口
        let geocoder = new qq.maps.Geocoder();
        geocoder.getLocation(addressName);
        geocoder.setComplete(function (result) {
          let detail = result.detail;
          let coordinate = detail.location; //坐标
          if (!_this.editObj.entJobNation) _this.editObj.entJobNation = _this.selected;
          _this.editObj.entJobName = _this.entJobName;
          _this.editObj.entJobNum = _this.entJobNum.value;
          _this.editObj.entJobAdd = _this.entJobAdd.value;
          _this.editObj.entJobMinPay = _this.entJobMinPay.value;
          _this.editObj.entJobMaxPay = _this.entJobMaxPay.value;
          _this.editObj.entJobPayMonth = _this.entJobPayMonth.value;

          entJobAddrInfo.push(_this.apartPoints( //保存默认坐标点
            coordinate.lng, coordinate.lat, _this.editObj.jobid, 1, _this.editObj.entJobName, _this.editObj
            .entJobNum, _this.selected, _this.editObj.entJobAdd
          ));
          //除了第一个的面试设置
          _this.addressList.forEach((list, index) => {
            if (index > 0) {
              entJobAddrInfo.push(_this.apartPoints( //保存其他坐标点
                list.lng, list.lat, _this.editObj.jobid, list.recruit ? 1 : 0, list.name, list.num, list
                .selected, list.addressDetail
              ));
            }
          })
          _this.editObj.entJobAddrInfo = entJobAddrInfo;
          //对外简称
          _this.editObj.shortEntName = _this.shortName;
          let _jobid = _this.editObj.jobid;
          //面试时间数组
          let interviewData = _this.getInterviewData(coordinate.lng, coordinate.lat);
          if(!interviewData) noFill = true;
          if (noFill) {
            document.getElementsByClassName("newJob")[0].scrollTop = 0;
            return;
          }
          _this.isLoad = true;
          if (interviewData) {
            interviewData.forEach(i => {
              i.jobId = _jobid;
            })
          } else {
            return
          }
          _this.editObj.viewinf = interviewData; //所有面试设置;
          // 判断是不是项目职位
          console.log(_this.project);
          _this.editObj.strstatus = _this.project ? 4 : "";
          //保存/新增职位信息
          xz.manipulateJob(
            _this.entid ? _this.entid : _this.editObj.entid,
            _jobid,
            _this.editObj
          ).then((res) => {
            res ? _this.editSuccess = true : console.log("发布/修改职位出错");
          })
        })
        geocoder.setError(function(result){
          _this.$refs.provinceSelect.$el.getElementsByClassName("trigger_select")[0].classList.add('error_alert');
          _this.$refs.constrainRegion.style.cssText += "display:block";
        })
      },
      //获取面试对象中的数据
      getInterviewData(lng = '', lat = '') {
        if (this.$refs.interviewData) {
          //验证填写表单
          let isEmpty = this.$refs.interviewData.checkDataIsEmpty();
          if (isEmpty) {
            let dateArr = isEmpty; //面试时间数组
            let inteviewData = [];
            dateArr.list.forEach(d => {
              inteviewData.push({
                strlng: lng,
                strlat: lat,
                userName: isEmpty.username,
                userTel: isEmpty.userTel,
                vDate: d.vDate,
                bvTime: d.vBtime ? d.vBtime : "00:00",
                evTime: d.vEtime ? d.vEtime : "00:00",
                id: 1, //需要考虑重复自增
                vRepeat: 0,
                vDays: 0,
                vAddr: isEmpty.vAddr,
                vOtherInf: isEmpty.vOtherInf
              })
            })
            return inteviewData;
          } else {
            return false;
          }

        }
      },
      //门店对象
      apartPoints(entLong, entLat, entJobId, entStatus, entRemark, entRecruitNum, entNation, entAddr) {
        return {
          entLong,
          entLat,
          entJobId,
          entStatus,
          entRemark,
          entRecruitNum,
          entNation,
          entAddr
        }
      },
      //返回上一级
      backRoute() {
        this.reset();
        this.cancalPublish = false;
        this.$emit("closePublish");
      },
      //重置
      reset() {
        //企业默认联系人姓名和号码
        this.contactPhone = "",
        this.contactName = "";
        this.$store.commit("setJobInit");
        this.allAddress = [];
        this.interviewMatch = {};
      },
      //返回选择的职能
      returnFun(data) {
        this.editObj.entJobFun = data;
        this.jobfunVisible = false;
      },
      //选择结果
      chooseResult(e) {
        this.editObj.entJobFun = e.target.innerText;
        this.hasResult = false;
      },
      //从数据中获取标签
      getTagFromData(data, n) {
        if (!data[n]) {
          this[n] = [];
        } else {
          Array.isArray(data[n]) ? this[n] = data[n] : this[n] = data[n].split(',');
        }
      },
      //获取标签组件中的所有标签
      getTags() {
        const b = this.$refs.tagscombine;
        return {
          entJobKnowTag: b.entJobKnowTag,
          entJobSkillTag: b.entJobSkillTag,
          entJobToolTag: b.entJobToolTag,
          entJobOtherTag: b.entJobOtherTag,
        }
      },
      //获取面试
      getInterviewInformation(jobid) {
        xz.getInterviewInformation(jobid).then( res => {
          if (res) {
            //匹配面试时间
            this.interviewList = res;
            if (Array.isArray(res)) { //如果是数组遍历查找
              //设置面试详细地址
              this.interviewAdd = res[0].StrVaddr;
              
              res.forEach( s => {
                if (s.GdJobId == this.editObj.jobid) {
                  this.interviewMatch = {
                    userName: s.Username,
                    userTel: s.Usertel,
                    vDate: s.DtvDate,
                    vDays: s.IntEveryDay,
                    vOtherInf: s.StrOtherInfo,
                    vBtime: s.DtBvtime,
                    vEtime: s.DtEvtime,
                    vaddr: s.StrVaddr
                  }
                }
              })
            } else { //如果是对象直接赋值
              //设置面试详细地址
              this.interviewAdd = res.StrVaddr;
              this.interviewMatch = {
                userName: res.Username,
                userTel: res.Usertel,
                vDate: res.DtvDate,
                vDays: res.IntEveryDay,
                vOtherInf: res.StrOtherInfo,
                vBtime: res.DtBvtime,
                vEtime: res.DtEvtime,
                vaddr: res.StrVaddr
              }
            }
          } else {
            console.log("获取面试信息失败");
          }
        })
      },
      //继续添加职位
      proceed() {
        this.reset();
        this.$router.go(0);
      },
    }
  }
</script>
<style scoped>
  .anyRecruit{
    margin-left: 10px;
  }
  .otherAddress {
    font-size: 14px;
    margin: 10px 0 0 0;
    color: #1470CE !important;
    cursor: pointer;
    margin-left: 150px;
  }

  .otherAddress:hover {
    text-decoration: underline;
  }

  .addCompanyTitle {
    font-size: 25px;
    font-weight: bold;
    color: #333;
    margin-bottom: 15px;
  }

  .addJobTitle {
    font-size: 18px;
    font-weight: bold;
    color: #5f4b8b;
  }

  .xz_salaryInput {
    width: 82px;
  }

  .field_name {
    line-height: 45px;
  }
  .jobNameInput{
    width: 550px;
    border: 1px solid #ddd;
    border-radius: 6px;
    height: 45px;
    font-size: 14px;
    padding: 0 15px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    outline: none;
  }
  .shortNameContainer{
    display: flex;
  }
  .shortNameContainer .jobNameInput{
    width: 200px !important;
  }
  .textAlarm{
    margin-left: 10px;
    line-height: 45px;
  }
  .constrainRegion{
    color: #c82a2e!important;
    font-size: 14px;
    margin-top: 5px;
    width: 100%;
    display: none;
  }
  .commissionContainer{
    outline: none;
    border: 1px solid #ddd;
    border-radius: 6px;
    height: 120px;
    font-size: 14px;
    padding: 15px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    line-height: 25px;
    width: 550px;
  }
</style>
<style>
.eduContainer .el-radio-button__inner{
  padding: 12px 15px !important;
}
</style> 